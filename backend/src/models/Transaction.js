const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,    // ✅ Duplicate prevention - same ID = rejected
      index: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,    // ✅ Duplicate prevention - same key = rejected
      index: true,
    },
    fromAccountId: {
      type: String,
      required: true,
      ref: 'Account',
    },
    toAccountId: {
      type: String,
      required: true,
      ref: 'Account',
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'reversed'],
      default: 'pending',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    failureReason: {
      type: String,
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }  // createdAt = timestamp of transaction
);

// Index for fast history queries
TransactionSchema.index({ fromAccountId: 1, createdAt: -1 });
TransactionSchema.index({ toAccountId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
