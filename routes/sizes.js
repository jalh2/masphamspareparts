const express = require('express');
const router = express.Router();
const { getAllSizes, addSize, deleteSize } = require('../controllers/sizeController');

// Get all sizes
router.get('/', getAllSizes);

// Add new size
router.post('/', addSize);

// Delete size
router.delete('/:id', deleteSize);

module.exports = router;
