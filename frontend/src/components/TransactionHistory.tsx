import React from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  currentAccountId?: string;
}

const statusColors: Record<string, string> = {
  completed: '#6ee7b7',
  failed: '#fca5a5',
  pending: '#fcd34d',
  reversed: '#c4b5fd',
};

const statusBg: Record<string, string> = {
  completed: 'rgba(16,185,129,0.15)',
  failed: 'rgba(239,68,68,0.15)',
  pending: 'rgba(245,158,11,0.15)',
  reversed: 'rgba(139,92,246,0.15)',
};

const TransactionHistory: React.FC<Props> = ({ transactions, currentAccountId }) => {
  if (transactions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={{ color: '#64748b', textAlign: 'center' }}>No transactions yet. Send money to get started! 💳</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Transaction History</h2>
      <div style={styles.list}>
        {transactions.map((tx) => {
          const isOutgoing = tx.fromAccountId === currentAccountId;
          const isIncoming = tx.toAccountId === currentAccountId;
          const sign = isOutgoing ? '-' : isIncoming ? '+' : '';
          const amountColor = isOutgoing ? '#fca5a5' : isIncoming ? '#6ee7b7' : '#e2e8f0';

          return (
            <div key={tx.transactionId} style={styles.txCard}>
              <div style={styles.txLeft}>
                <div style={styles.txIcon}>
                  {isOutgoing ? '📤' : isIncoming ? '📥' : '🔄'}
                </div>
                <div>
                  <p style={styles.txDesc}>
                    {tx.description || (isOutgoing ? 'Money Sent' : 'Money Received')}
                  </p>
                  <p style={styles.txMeta}>
                    {isOutgoing ? `To: ${tx.toAccountId.slice(0, 8)}...` : `From: ${tx.fromAccountId.slice(0, 8)}...`}
                  </p>
                  <p style={styles.txMeta}>
                    {new Date(tx.createdAt).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div style={styles.txRight}>
                <p style={{ ...styles.txAmount, color: amountColor }}>
                  {sign}₹{tx.amount.toLocaleString('en-IN')}
                </p>
                <span style={{
                  ...styles.statusBadge,
                  color: statusColors[tx.status] || '#94a3b8',
                  background: statusBg[tx.status] || 'rgba(255,255,255,0.05)',
                }}>
                  {tx.status.toUpperCase()}
                </span>
                {tx.failureReason && (
                  <p style={styles.failReason}>{tx.failureReason}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '16px',
    padding: '28px',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: '20px',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  emptyState: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '16px',
    padding: '40px 28px',
  },
  txCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '14px 18px',
    transition: 'background 0.2s',
  },
  txLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  txIcon: { fontSize: '1.5rem' },
  txDesc: { color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' },
  txMeta: { color: '#64748b', fontSize: '0.78rem', margin: '1px 0' },
  txRight: { textAlign: 'right' as const },
  txAmount: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' },
  statusBadge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '20px',
    letterSpacing: '0.05em',
  },
  failReason: { color: '#fca5a5', fontSize: '0.7rem', marginTop: '4px', maxWidth: '180px' },
};

export default TransactionHistory;
