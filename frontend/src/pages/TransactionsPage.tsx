import React, { useEffect, useState, useCallback } from 'react';
import { Account, Transaction } from '../types';
import { getAccounts, getTransactions, createAccount } from '../api/finance';
import TransactionForm from '../components/TransactionForm';
import TransactionHistory from '../components/TransactionHistory';

const TransactionsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  // Create account form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBalance, setNewBalance] = useState('10000');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [accs, txData] = await Promise.all([
        getAccounts(),
        getTransactions({ accountId: selectedAccountId || undefined, limit: 100 }),
      ]);
      setAccounts(accs);
      setTransactions(txData.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedAccountId]);

  useEffect(() => {
    fetchAll();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);
    try {
      await createAccount({ ownerName: newName, email: newEmail, initialBalance: parseFloat(newBalance) });
      setNewName(''); setNewEmail(''); setNewBalance('10000');
      setShowCreateAccount(false);
      fetchAll();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const selectedAccount = accounts.find(a => a.accountId === selectedAccountId);

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={{ color: '#6366f1', marginTop: '16px' }}>Loading Finance Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>💰 Finance Dashboard</h1>
          <p style={styles.subheading}>Secure money transfers with real-time balance updates</p>
        </div>
        <button onClick={() => setShowCreateAccount(!showCreateAccount)} style={styles.addBtn}>
          {showCreateAccount ? '✕ Cancel' : '+ New Account'}
        </button>
      </div>

      {/* Create Account Form */}
      {showCreateAccount && (
        <div style={styles.card}>
          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Create New Account</h3>
          <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input style={styles.input} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full Name *" required />
            <input style={styles.input} value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email *" type="email" required />
            <input style={styles.input} value={newBalance} onChange={e => setNewBalance(e.target.value)} placeholder="Initial Balance (₹)" type="number" />
            {createError && <p style={{ color: '#fca5a5', fontSize: '0.85rem' }}>⚠️ {createError}</p>}
            <button type="submit" style={styles.btn} disabled={createLoading}>
              {createLoading ? 'Creating...' : '✅ Create Account'}
            </button>
          </form>
        </div>
      )}

      {/* Account Cards */}
      <div style={styles.accountGrid}>
        {accounts.map((a) => (
          <div
            key={a.accountId}
            style={{
              ...styles.accountCard,
              border: selectedAccountId === a.accountId
                ? '2px solid #6366f1'
                : '1px solid rgba(99,102,241,0.2)',
            }}
            onClick={() => setSelectedAccountId(selectedAccountId === a.accountId ? '' : a.accountId)}
          >
            <p style={styles.accountName}>{a.ownerName}</p>
            <p style={styles.accountEmail}>{a.email}</p>
            <p style={styles.accountBalance}>₹{a.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p style={styles.accountCurrency}>{a.currency}</p>
          </div>
        ))}
        {accounts.length === 0 && (
          <p style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center' }}>
            No accounts yet. Create one above to get started!
          </p>
        )}
      </div>

      {/* Main Content */}
      {accounts.length >= 2 ? (
        <div style={styles.mainGrid}>
          <TransactionForm accounts={accounts} onSuccess={fetchAll} />
          <TransactionHistory transactions={transactions} currentAccountId={selectedAccountId} />
        </div>
      ) : (
        <div style={styles.card}>
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>
            ℹ️ Create at least <strong style={{ color: '#6366f1' }}>2 accounts</strong> to start transferring money.
          </p>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #0d1117 100%)',
    padding: '32px 24px',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loadingWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f1a',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(99,102,241,0.2)',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },
  heading: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  subheading: { color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' },
  addBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  card: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '16px',
    padding: '24px',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  btn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  accountCard: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    borderRadius: '14px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  accountName: { color: '#e2e8f0', fontWeight: 700, fontSize: '1rem', margin: '0 0 4px 0' },
  accountEmail: { color: '#64748b', fontSize: '0.78rem', margin: '0 0 12px 0' },
  accountBalance: { color: '#6ee7b7', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 2px 0' },
  accountCurrency: { color: '#6366f1', fontSize: '0.8rem', fontWeight: 600, margin: 0 },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.5fr)',
    gap: '24px',
    alignItems: 'start',
  },
};

export default TransactionsPage;
