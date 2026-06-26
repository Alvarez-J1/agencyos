const jwt = require('jsonwebtoken');

const { getJwtSecret } = require('../config/jwt');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
