const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['addition', 'subtraction', 'initial'], required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
  balanceAfter: { type: Number, required: true },
});

const supplierSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, trim: true },
  contact: {
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
  balance: { type: Number, default: 0 },
  transactions: [transactionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Supplier', supplierSchema);
