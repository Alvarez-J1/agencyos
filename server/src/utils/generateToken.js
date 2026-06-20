const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'agencyos-dev-secret';

  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
