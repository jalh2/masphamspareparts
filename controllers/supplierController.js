const crypto = require('crypto');
const User = require('../models/User');
const Supplier = require('../models/Supplier');

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Create a supplier account (user + supplier profile)
exports.createSupplier = async (req, res) => {
  try {
    const { username, password, name, contact, initialBalance } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      salt,
      role: 'supplier',
    });
    await user.save();

    const startingBalance = typeof initialBalance === 'number' ? initialBalance : 0;

    const supplier = new Supplier({
      user: user._id,
      name,
      contact: contact || {},
      balance: startingBalance,
      transactions: startingBalance !== 0 ? [
        {
          amount: startingBalance,
          type: 'initial',
          note: 'Initial balance',
          balanceAfter: startingBalance,
        },
      ] : [],
    });

    await supplier.save();

    res.status(201).json({
      id: supplier._id,
      username: user.username,
      role: user.role,
      name: supplier.name,
      contact: supplier.contact,
      balance: supplier.balance,
      createdAt: supplier.createdAt,
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(400).json({ message: error.message });
  }
};

// List all suppliers
exports.listSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('user', 'username role createdAt').sort({ createdAt: -1 });
    res.json(suppliers.map((s) => ({
      id: s._id,
      username: s.user?.username,
      role: s.user?.role,
      name: s.name,
      contact: s.contact,
      balance: s.balance,
      createdAt: s.createdAt,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one supplier
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('user', 'username role createdAt');
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({
      id: supplier._id,
      username: supplier.user?.username,
      role: supplier.user?.role,
      name: supplier.name,
      contact: supplier.contact,
      balance: supplier.balance,
      transactions: supplier.transactions,
      createdAt: supplier.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a balance transaction (addition increases balance owed; subtraction decreases)
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, note } = req.body;

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    if (!['addition', 'subtraction'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "addition" or "subtraction"' });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const newBalance = type === 'addition' ? supplier.balance + amount : supplier.balance - amount;

    supplier.balance = newBalance;
    supplier.transactions.push({
      amount,
      type,
      note: note || '',
      balanceAfter: newBalance,
    });

    await supplier.save();

    res.json({
      id: supplier._id,
      balance: supplier.balance,
      transactions: supplier.transactions,
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get transactions for a supplier
exports.getTransactions = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier.transactions || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset supplier's password
exports.resetSupplierPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const supplier = await Supplier.findById(req.params.id).populate('user');
    if (!supplier || !supplier.user) {
      return res.status(404).json({ message: 'Supplier or user not found' });
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);

    supplier.user.salt = newSalt;
    supplier.user.password = newHash;
    await supplier.user.save();

    res.json({ message: 'Supplier password reset successfully' });
  } catch (error) {
    console.error('Error resetting supplier password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete supplier and associated user
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const userId = supplier.user;

    // Delete supplier document
    await Supplier.deleteOne({ _id: supplier._id });

    // Optionally delete associated user account
    if (userId) {
      await User.deleteOne({ _id: userId });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
