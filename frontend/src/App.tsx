import { useState, useEffect, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Account, Transaction } from './types'
import { getAccounts, getTransactions, createAccount, createTransaction } from './api/finance'

function App() {
  const [count, setCount] = useState(0)

  // ── Finance MERN state ─────────────────────────
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showCreateAccount, setShowCreateAccount] = useState(false)

  // Account creation form state
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newBalance, setNewBalance] = useState('10000')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Transaction form state
  const [fromAccountId, setFromAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [accs, txData] = await Promise.all([
        getAccounts(),
        getTransactions({ accountId: selectedAccountId || undefined, limit: 100 }),
      ])
      setAccounts(accs)
      setTransactions(txData.transactions)
    } catch (err) {
      console.error('Failed to fetch data from API:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedAccountId])

  useEffect(() => {
    fetchAll()
    // Auto-refresh data every 10 seconds
    const interval = setInterval(fetchAll, 10000)
    return () => clearInterval(interval)
  }, [fetchAll])

  // Create new user account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    setCreateLoading(true)
    try {
      await createAccount({
        ownerName: newName,
        email: newEmail,
        initialBalance: parseFloat(newBalance) || 0,
      })
      setNewName('')
      setNewEmail('')
      setNewBalance('10000')
      setShowCreateAccount(false)
      fetchAll()
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create account')
    } finally {
      setCreateLoading(false)
    }
  }

  // Create new transaction/transfer
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setTxError(null)
    setTxLoading(true)
    try {
      if (!fromAccountId || !toAccountId || !transferAmount) {
        throw new Error('Please fill in all fields.')
      }
      if (fromAccountId === toAccountId) {
        throw new Error('Sender and Receiver cannot be the same.')
      }
      await createTransaction({
        fromAccountId: fromAccountId,
        toAccountId: toAccountId,
        amount: parseFloat(transferAmount),
      })
      setTransferAmount('')
      setFromAccountId('')
      setToAccountId('')
      fetchAll()
    } catch (err: any) {
      setTxError(err.message || 'Transaction failed')
    } finally {
      setTxLoading(false)
    }
  }

  const selectedAccount = accounts.find((a) => a.accountId === selectedAccountId)

  return (
    <>
      {/* ── Original Starter Header ──────────────────── */}
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>UnlockD Finance</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      {/* ── Active Finance API Dashboard ────────────── */}
      <section className="finance-section">
        <div className="finance-header">
          <div>
            <h2>💳 MERN Accounts Dashboard</h2>
            <p>Select an account card to view its transaction history below</p>
          </div>
          <button
            onClick={() => setShowCreateAccount(!showCreateAccount)}
            className="action-btn-outline"
          >
            {showCreateAccount ? '✕ Cancel' : '+ New Account'}
          </button>
        </div>

        {/* Create Account Form */}
        {showCreateAccount && (
          <div className="finance-form-card">
            <h3>Create a New Account</h3>
            <form onSubmit={handleCreateAccount} className="finance-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="finance-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter owner's full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  className="finance-input"
                  value={newEmail}
                  type="email"
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Initial Deposit (INR)</label>
                <input
                  className="finance-input"
                  value={newBalance}
                  type="number"
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder="Enter starting balance"
                />
              </div>
              {createError && <p style={{ color: '#fca5a5', margin: 0 }}>⚠️ {createError}</p>}
              <button className="finance-btn" type="submit" disabled={createLoading}>
                {createLoading ? 'Processing...' : 'Confirm Create'}
              </button>
            </form>
          </div>
        )}

        {/* Account Cards Grid */}
        <div className="finance-grid">
          {loading ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Connecting to API server...</p>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.accountId}
                className={`finance-card ${selectedAccountId === acc.accountId ? 'active' : ''}`}
                onClick={() =>
                  setSelectedAccountId(selectedAccountId === acc.accountId ? '' : acc.accountId)
                }
              >
                <h3>{acc.ownerName}</h3>
                <p style={{ opacity: 0.7 }}>{acc.email}</p>
                <p className="balance-amount">₹{acc.balance.toLocaleString('en-IN')}</p>
                <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.5 }}>
                  ID: {acc.accountId.substring(0, 8)}...
                </p>
              </div>
            ))
          )}
          {!loading && accounts.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b' }}>
              No accounts registered yet. Use the "+ New Account" button to register one!
            </p>
          )}
        </div>

        {/* Transfer and History Columns */}
        {!loading && accounts.length >= 2 ? (
          <div className="dashboard-columns">
            {/* Money Transfer Card */}
            <div className="finance-form-card" style={{ height: 'fit-content' }}>
              <h3>💸 Transfer Money</h3>
              <form onSubmit={handleTransfer} className="finance-form" style={{ marginTop: '16px' }}>
                <div className="form-group">
                  <label>From Account (Sender)</label>
                  <select
                    className="finance-select"
                    value={fromAccountId}
                    onChange={(e) => setFromAccountId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Sender --</option>
                    {accounts.map((a) => (
                      <option key={a.accountId} value={a.accountId}>
                        {a.ownerName} (Balance: ₹{a.balance.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>To Account (Receiver)</label>
                  <select
                    className="finance-select"
                    value={toAccountId}
                    onChange={(e) => setToAccountId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Receiver --</option>
                    {accounts.map((a) => (
                      <option key={a.accountId} value={a.accountId}>
                        {a.ownerName} (Balance: ₹{a.balance.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (INR)</label>
                  <input
                    className="finance-input"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter transfer amount"
                    required
                  />
                </div>

                {txError && <p style={{ color: '#fca5a5', margin: 0 }}>⚠️ {txError}</p>}
                <button className="finance-btn" type="submit" disabled={txLoading}>
                  {txLoading ? 'Transferring...' : 'Send Money'}
                </button>
              </form>
            </div>

            {/* Transaction History Card */}
            <div className="finance-form-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>📜 Transaction History {selectedAccount && `(${selectedAccount.ownerName})`}</h3>
              <div className="table-container" style={{ marginTop: '16px' }}>
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Detail</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter(
                        (tx) =>
                          !selectedAccountId ||
                          tx.fromAccountId === selectedAccountId ||
                          tx.toAccountId === selectedAccountId
                      )
                      .map((tx) => {
                        const isSender = selectedAccountId === tx.fromAccountId
                        const isReceiver = selectedAccountId === tx.toAccountId
                        let amountClass = ''
                        let prefix = ''

                        if (selectedAccountId) {
                          if (isSender) {
                            amountClass = 'amount-sent'
                            prefix = '-'
                          } else if (isReceiver) {
                            amountClass = 'amount-received'
                            prefix = '+'
                          }
                        }

                        const senderAcc = accounts.find(a => a.accountId === tx.fromAccountId)
                        const receiverAcc = accounts.find(a => a.accountId === tx.toAccountId)
                        const senderName = senderAcc ? senderAcc.ownerName : tx.fromAccountId.substring(0, 8)
                        const receiverName = receiverAcc ? receiverAcc.ownerName : tx.toAccountId.substring(0, 8)

                        return (
                          <tr key={tx.transactionId}>
                            <td>
                              <span
                                style={{
                                  background: tx.status === 'completed' ? '#065f46' : '#991b1b',
                                  color: '#fff',
                                  fontSize: '11px',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td>
                              {senderName} ➔ {receiverName}
                            </td>
                            <td className={amountClass}>
                              {prefix}₹{tx.amount.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        )
                      })}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>
                          No transactions completed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="finance-form-card" style={{ textAlign: 'center' }}>
              <p style={{ color: '#94a3b8' }}>
                💡 Create at least <strong>2 accounts</strong> to start testing money transfers.
              </p>
            </div>
          )
        )}
      </section>

      <div className="ticks"></div>

      {/* ── Original Documentation/Social Links Footer ── */}
      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
