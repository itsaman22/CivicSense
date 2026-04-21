// 💰 Coin History Model - Track all coin transactions
const mongoose = require('mongoose');

const coinHistorySchema = new mongoose.Schema({
  // User who received/spent coins
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Coins earned/spent in this transaction
  coinsEarned: {
    type: Number,
    required: true
  },

  // Type of transaction
  transactionType: {
    type: String,
    enum: ['reward', 'redemption', 'welcome_bonus', 'adjustment'],
    default: 'reward'
  },

  // Description of the transaction
  description: {
    type: String,
    required: true
  },

  // Related issue (if applicable)
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: false
  },

  // Related voucher (if applicable)
  voucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher',
    required: false
  },

  // Additional details
  details: {
    type: String,
    required: false
  },

  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the CoinHistory model
const CoinHistory = mongoose.model('CoinHistory', coinHistorySchema);

module.exports = CoinHistory;
