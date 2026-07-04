const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// POST transfer money
router.post('/transfer', auth, async (req, res) => {
  const { toAccountNumber, amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Enter a valid amount' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromAccount = await Account.findOne({ user: req.userId }).session(session);
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber }).session(session);

    if (!toAccount) {
      throw new Error('Recipient account not found');
    }
    if (fromAccount._id.equals(toAccount._id)) {
      throw new Error('Cannot transfer to your own account');
    }
    if (fromAccount.balance < amount) {
      throw new Error('Insufficient balance');
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;
    await fromAccount.save({ session });
    await toAccount.save({ session });

    const transaction = new Transaction({
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      amount,
      description,
      status: 'success'
    });
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: 'Transfer successful', newBalance: fromAccount.balance });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// GET transaction history for logged-in user
router.get('/history', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.userId });
    const transactions = await Transaction.find({
      $or: [{ fromAccount: account._id }, { toAccount: account._id }]
    })
      .sort({ createdAt: -1 })
      .populate('fromAccount toAccount', 'accountNumber');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;