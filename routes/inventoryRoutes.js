const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Get all tires
router.get('/', inventoryController.getAllTires);

// Get a single tire
router.get('/:id', inventoryController.getTire);

// Create a new tire
router.post('/', inventoryController.createTire);

// Update tire quantity
router.patch('/:id/quantity', inventoryController.updateQuantity);

// Update tire price
router.patch('/:id/price', inventoryController.updatePrice);

// Delete a tire
router.delete('/:id', inventoryController.deleteTire);

module.exports = router;
