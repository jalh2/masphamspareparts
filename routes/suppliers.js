const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Create supplier (admin only)
router.post('/', supplierController.createSupplier);

// List suppliers
router.get('/', supplierController.listSuppliers);

// Get one supplier
router.get('/:id', supplierController.getSupplier);

// Get transactions for supplier
router.get('/:id/transactions', supplierController.getTransactions);

// Add balance transaction
router.post('/:id/transactions', supplierController.addTransaction);

// Reset supplier password
router.post('/:id/reset-password', supplierController.resetSupplierPassword);

// Delete supplier
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
