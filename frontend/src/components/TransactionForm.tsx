import React, { useState } from 'react';
import { Account } from '../types';
import { createTransaction } from '../api/finance';

interface Props {
  accounts: Account[];
  onSuccess: () => void;
}

const TransactionForm: React.FC<Props> = ({ accounts, onSuccess }) => {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedFrom = accounts.find((a) => a.accountId === fromAccountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const parsedAmount = parseFloat(amount);
    if (!fromAccountId || !toAccountId || !parsedAmount) {
      setError('Please fill all required fields.');
      return;
    }
    if (fromAccountId === toAccountId) {
      setError('Sender and receiver cannot be the same account.');
      return;
    }
    if (parsedAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setLoading(true);
    try {
      const result = await createTransaction({
        fromAccountId,
        toAccountId,
        amount: parsedAmount,
        description,
      });
      setSuccess(`✅ Transfer of ₹${parsedAmount} completed! New balance: ₹${result.updatedBalances.from.newBalance}`);
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>💸 Send Money</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* From Account */}
        <div style={styles.field}>
          <label style={styles.label}>From Account *</label>
          <select
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select sender account</option>
            {accounts.map((a) => (
              <option key={a.accountId} value={a.accountId}>
                {a.ownerName} — ₹{a.balance.toLocaleString()} ({a.currency})
              </option>
            ))}
          </select>
          {selectedFrom && (
            <p style={styles.hint}>Available balance: <strong>₹{selectedFrom.balance.toLocaleString()}</strong></p>
          )}
        </div>

        {/* To Account */}
        <div style={styles.field}>
          <label style={styles.label}>To Account *</label>
          <select
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select receiver account</option>
            {accounts
              .filter((a) => a.accountId !== fromAccountId)
              .map((a) => (
                <option key={a.accountId} value={a.accountId}>
                  {a.ownerName} ({a.email})
                </option>
              ))}
          </select>
        </div>

        {/* Amount */}
        <div style={styles.field}>
          <label style={styles.label}>Amount (₹) *</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={styles.input}
            required
          />
        </div>

        {/* Description */}
        <div style={styles.field}>
          <label style={styles.label}>Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Rent payment, Groceries..."
            style={styles.input}
            maxLength={200}
          />
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <button type="submit" disabled={loading} style={loading ? styles.btnDisabled : styles.btn}>
          {loading ? '⏳ Processing...' : '🚀 Send Money'}
        </button>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '16px',
    padding: '28px',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  select: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
  },
  hint: { fontSize: '0.8rem', color: '#6ee7b7', margin: '2px 0 0 0' },
  error: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#fca5a5',
    fontSize: '0.9rem',
  },
  successMsg: {
    background: 'rgba(16,185,129,0.15)',
    border: '1px solid rgba(16,185,129,0.4)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#6ee7b7',
    fontSize: '0.9rem',
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
    marginTop: '8px',
    transition: 'opacity 0.2s',
  },
  btnDisabled: {
    background: 'rgba(99,102,241,0.3)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    color: '#94a3b8',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'not-allowed',
    marginTop: '8px',
  },
};

export default TransactionForm;
