const express = require('express');

const { loginLimiter, signupLimiter } = require('../config/rateLimiters');
const { login, signup } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupLimiter, signup);
router.post('/login', loginLimiter, login);

module.exports = router;
