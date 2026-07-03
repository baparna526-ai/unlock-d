const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// ─────────────────────────────────────────────
// POST /api/transactions
// Create a secure money transfer (ATOMIC)
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { fromAccountId, toAccountId, amount, description, idempotencyKey } = req.body;

  // --- Basic validation ---
  if (!fromAccountId || !toAccountId || !amount) {
    return res.status(400).json({ error: 'fromAccountId, toAccountId, and amount are required.' });
  }
  if (fromAccountId === toAccountId) {
    return res.status(400).json({ error: 'Cannot transfer to the same account.' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  // --- Idempotency check: reject duplicate requests ---
  const iKey = idempotencyKey || uuidv4();
  const existingTx = await Transaction.findOne({ idempotencyKey: iKey });
  if (existingTx) {
    return res.status(409).json({
      error: 'Duplicate transaction detected.',
      transaction: existingTx,
    });
  }

  // --- Start MongoDB atomic session ---
  const session = await mongoose.startSession();
  session.startTransaction();

  let transaction;

  try {
    // Lock and fetch both accounts
    const fromAccount = await Account.findOne({ accountId: fromAccountId }).session(session);
    const toAccount = await Account.findOne({ accountId: toAccountId }).session(session);

    if (!fromAccount) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Sender account not found.' });
    }
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Receiver account not found.' });
    }
    if (!fromAccount.isActive || !toAccount.isActive) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'One or both accounts are inactive.' });
    }

    // ✅ Overdraft protection check
    if (fromAccount.balance < amount) {
      // Create a FAILED transaction record for audit trail
      const failedTx = new Transaction({
        transactionId: uuidv4(),
        idempotencyKey: iKey,
        fromAccountId,
        toAccountId,
        amount,
        status: 'failed',
        description: description || '',
        failureReason: `Insufficient funds. Available: ${fromAccount.balance}, Required: ${amount}`,
        processedAt: new Date(),
      });
      await failedTx.save({ session });
      await session.commitTransaction();
      return res.status(422).json({
        error: 'Insufficient funds.',
        availableBalance: fromAccount.balance,
        requiredAmount: amount,
        transaction: failedTx,
      });
    }

    // ✅ Create pending transaction record
    transaction = new Transaction({
      transactionId: uuidv4(),
      idempotencyKey: iKey,
      fromAccountId,
      toAccountId,
      amount,
      currency: fromAccount.currency,
      status: 'pending',
      description: description || '',
    });
    await transaction.save({ session });

    // ✅ Atomic balance updates — both happen or neither does
    fromAccount.balance = parseFloat((fromAccount.balance - amount).toFixed(2));
    toAccount.balance = parseFloat((toAccount.balance + amount).toFixed(2));

    await fromAccount.save({ session });
    await toAccount.save({ session });

    // ✅ Mark transaction as completed
    transaction.status = 'completed';
    transaction.processedAt = new Date();
    await transaction.save({ session });

    // Commit the transaction — all changes are saved together
    await session.commitTransaction();

    return res.status(201).json({
      message: 'Transaction completed successfully.',
      transaction,
      updatedBalances: {
        from: { accountId: fromAccountId, newBalance: fromAccount.balance },
        to: { accountId: toAccountId, newBalance: toAccount.balance },
      },
    });
  } catch (err) {
    // Rollback everything if anything fails
    await session.abortTransaction();

    // If transaction was partially created, mark as failed
    if (transaction) {
      await Transaction.findByIdAndUpdate(transaction._id, {
        status: 'failed',
        failureReason: err.message,
        processedAt: new Date(),
      });
    }

    console.error('Transaction error:', err);
    return res.status(500).json({ error: 'Transaction failed. All changes rolled back.', details: err.message });
  } finally {
    session.endSession();
  }
});

// ─────────────────────────────────────────────
// GET /api/transactions
// Get all transactions (with optional filters)
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { accountId, status, limit = 50, page = 1 } = req.query;
    const query = {};

    if (accountId) {
      query.$or = [{ fromAccountId: accountId }, { toAccountId: accountId }];
    }
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/transactions/:transactionId
// Get a single transaction by ID
// ─────────────────────────────────────────────
router.get('/:transactionId', async (req, res) => {
  try {
    const tx = await Transaction.findOne({ transactionId: req.params.transactionId });
    if (!tx) return res.status(404).json({ error: 'Transaction not found.' });
    return res.status(200).json(tx);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch transaction.', details: err.message });
  }
});

module.exports = router;
