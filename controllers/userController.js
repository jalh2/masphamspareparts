const User = require('../models/User');
const crypto = require('crypto');

const generateHash = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

exports.changePassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    // Basic validation
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Username is required' });
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 4) {
      return res.status(400).json({ message: 'New password must be at least 4 characters long' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new salt and hash for new password
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = generateHash(newPassword, newSalt);

    // Update user's password
    user.password = newHash;
    user.salt = newSalt;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Public endpoint: return list of usernames for login dropdown
exports.listUsernames = async (req, res) => {
  try {
    const users = await User.find({}, 'username').sort({ username: 1 }).lean();
    const usernames = users.map((u) => u.username);
    res.json({ usernames });
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
