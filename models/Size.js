const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Size', sizeSchema);
