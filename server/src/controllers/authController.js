const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json(buildAuthResponse(user));
  } catch (_error) {
    return res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json(buildAuthResponse(user));
  } catch (_error) {
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

module.exports = { login, signup };
