const express = require('express');

const { loginLimiter, signupLimiter } = require('../config/rateLimiters');
const { login, signup, demoLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/demo', loginLimiter, demoLogin);

module.exports = router;
