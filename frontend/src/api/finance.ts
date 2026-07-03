import { Account, Transaction, TransferPayload, TransferResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Accounts ─────────────────────────────────

export async function getAccounts(): Promise<Account[]> {
  const res = await fetch(`${API_BASE}/api/accounts`);
  if (!res.ok) throw new Error('Failed to fetch accounts');
  return res.json();
}

export async function createAccount(data: {
  ownerName: string;
  email: string;
  initialBalance?: number;
  currency?: string;
}): Promise<{ account: Account }> {
  const res = await fetch(`${API_BASE}/api/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create account');
  return json;
}

export async function getAccountBalance(accountId: string): Promise<{
  accountId: string;
  ownerName: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}> {
  const res = await fetch(`${API_BASE}/api/accounts/${accountId}/balance`);
  if (!res.ok) throw new Error('Failed to fetch balance');
  return res.json();
}

// ── Transactions ──────────────────────────────

export async function getTransactions(params?: {
  accountId?: string;
  status?: string;
  limit?: number;
  page?: number;
}): Promise<{ transactions: Transaction[]; pagination: any }> {
  const query = new URLSearchParams();
  if (params?.accountId) query.append('accountId', params.accountId);
  if (params?.status) query.append('status', params.status);
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.page) query.append('page', String(params.page));

  const res = await fetch(`${API_BASE}/api/transactions?${query}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function createTransaction(payload: TransferPayload): Promise<TransferResponse> {
  const res = await fetch(`${API_BASE}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Transaction failed');
  return json;
}
