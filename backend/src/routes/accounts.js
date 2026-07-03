const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Account = require('../models/Account');

// ─────────────────────────────────────────────
// POST /api/accounts
// Create a new account
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { ownerName, email, initialBalance = 0, currency = 'INR' } = req.body;

    if (!ownerName || !email) {
      return res.status(400).json({ error: 'ownerName and email are required.' });
    }

    const existing = await Account.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const account = new Account({
      accountId: uuidv4(),
      ownerName,
      email,
      balance: initialBalance,
      currency,
    });

    await account.save();
    return res.status(201).json({ message: 'Account created successfully.', account });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create account.', details: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/accounts
// Get all accounts
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find({}).sort({ createdAt: -1 });
    return res.status(200).json(accounts);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch accounts.', details: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/accounts/:accountId
// Get single account with balance
// ─────────────────────────────────────────────
router.get('/:accountId', async (req, res) => {
  try {
    const account = await Account.findOne({ accountId: req.params.accountId });
    if (!account) return res.status(404).json({ error: 'Account not found.' });
    return res.status(200).json(account);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch account.', details: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/accounts/:accountId/balance
// Get live balance of an account
// ─────────────────────────────────────────────
router.get('/:accountId/balance', async (req, res) => {
  try {
    const account = await Account.findOne({ accountId: req.params.accountId });
    if (!account) return res.status(404).json({ error: 'Account not found.' });
    return res.status(200).json({
      accountId: account.accountId,
      ownerName: account.ownerName,
      balance: account.balance,
      currency: account.currency,
      lastUpdated: account.updatedAt,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch balance.', details: err.message });
  }
});

module.exports = router;
