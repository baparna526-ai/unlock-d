// Types shared across the frontend

export interface Account {
  accountId: string;
  ownerName: string;
  email: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  transactionId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  description: string;
  failureReason: string | null;
  processedAt: string | null;
  createdAt: string;
}

export interface TransferPayload {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  idempotencyKey?: string;
}

export interface TransferResponse {
  message: string;
  transaction: Transaction;
  updatedBalances: {
    from: { accountId: string; newBalance: number };
    to: { accountId: string; newBalance: number };
  };
}
