const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const auth = require('../middleware/auth');

// GET logged-in user's account details
router.get('/me', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.userId });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;