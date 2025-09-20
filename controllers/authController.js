const crypto = require('crypto');
const User = require('../models/User');

// Helper function to hash password
const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

// Helper function to generate random salt
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Register new user (defaults to supplier role)
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      salt,
      role: 'supplier',
    });

    await user.save();

    const userResponse = {
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password
    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Send user data (excluding password and salt)
    const userResponse = {
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create admin (special route for initial setup)
exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    // Create admin user
    const admin = new User({
      username,
      password: hashedPassword,
      salt,
      role: 'admin',
    });

    await admin.save();

    const adminResponse = {
      username: admin.username,
      role: admin.role,
      createdAt: admin.createdAt,
    };

    res.status(201).json(adminResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
