require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');

const app = express();

// ── Middleware ────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Connect DB ────────────────────────────────
connectDB();

// ── Routes ────────────────────────────────────
app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);

// ── Health Check ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'UnlockD Finance API' });
});

// ── 404 Handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.', details: err.message });
});

module.exports = app;
