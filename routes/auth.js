const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user (defaults to supplier)
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Create admin (special route for initial setup)
router.post('/create-admin', authController.createAdmin);

module.exports = router;
