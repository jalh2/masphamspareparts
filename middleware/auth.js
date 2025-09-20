const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin/Manager access required' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Error verifying admin/manager status' });
  }
};

module.exports = { auth, isAdmin };
