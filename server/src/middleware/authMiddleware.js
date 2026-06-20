const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Token missing.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'agencyos-dev-secret';
    const decoded = jwt.verify(token, secret);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Authentication database unavailable.' });
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized. User not found.' });
    }

    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Not authorized. Token invalid.' });
  }
};

module.exports = { protect };
