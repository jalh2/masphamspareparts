const mongoose = require('mongoose');

const quantityHistorySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['addition', 'subtraction', 'sale', 'initial', 'update'],
    required: true,
  },
});

const tireSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'LRD'],
    default: 'USD',
  },
  currentQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  quantityHistory: [quantityHistorySchema],
});

module.exports = mongoose.model('Tire', tireSchema);
