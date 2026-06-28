const mongoose = require('mongoose');

const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');

const DEMO_USER = {
  name: 'Demo Account',
  email: 'demo@agencyos.com',
  password: 'password123'
};

const DEMO_CLIENTS = [
  { id: 1, name: 'Sarah Chen', company: 'Northwind Labs', email: 'sarah@northwind.io', status: 'Active', activeProjects: 2, lastContact: '2 days ago' },
  { id: 2, name: 'Marcus Lee', company: 'Brightwave Media', email: 'marcus@brightwave.co', status: 'Active', activeProjects: 1, lastContact: '1 week ago' },
  { id: 3, name: 'Priya Patel', company: 'Atlas Logistics', email: 'priya@atlaslogistics.com', status: 'Onboarding', activeProjects: 0, lastContact: 'Yesterday' },
  { id: 4, name: 'Daniel Romero', company: 'Vertex Studio', email: 'daniel@vertexstudio.design', status: 'Paused', activeProjects: 0, lastContact: '3 weeks ago' }
];

const DEMO_PROJECTS = [
  { id: 1, name: 'Website Redesign', client: 'Northwind Labs', status: 'In Progress', dueDate: '2026-07-15', progress: 65, notes: 'New marketing site with refreshed brand system.' },
  { id: 2, name: 'Brand Campaign Q3', client: 'Brightwave Media', status: 'Planning', dueDate: '2026-08-01', progress: 20, notes: 'Multi-channel launch for the autumn product line.' },
  { id: 3, name: 'Onboarding Portal', client: 'Atlas Logistics', status: 'Review', dueDate: '2026-07-05', progress: 85, notes: 'Self-serve onboarding flow for new partners.' },
  { id: 4, name: 'Mobile App Launch', client: 'Northwind Labs', status: 'Completed', dueDate: '2026-06-10', progress: 100, notes: 'Shipped to the App Store and Play Store.' }
];

const DEMO_TASKS = [
  { id: 1, title: 'Finalize homepage mockups', project: 'Website Redesign', assignee: 'Demo Account', priority: 'High', status: 'In Progress', dueDate: '2026-07-01', notes: 'Awaiting sign-off from the client.' },
  { id: 2, title: 'Draft campaign brief', project: 'Brand Campaign Q3', assignee: 'Demo Account', priority: 'Medium', status: 'Todo', dueDate: '2026-07-03', notes: '' },
  { id: 3, title: 'QA onboarding flow', project: 'Onboarding Portal', assignee: 'Demo Account', priority: 'High', status: 'Todo', dueDate: '2026-07-04', notes: 'Test edge cases for partner invites.' },
  { id: 4, title: 'Publish app to stores', project: 'Mobile App Launch', assignee: 'Demo Account', priority: 'Medium', status: 'Completed', dueDate: '2026-06-09', notes: 'Released v1.0.' }
];

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const seedDemoWorkspace = async (ownerId) => {
  const existingClients = await Client.countDocuments({ owner: ownerId });

  if (existingClients > 0) {
    return;
  }

  const withOwner = (records) => records.map((record) => ({ ...record, owner: ownerId }));

  await Promise.all([
    Client.insertMany(withOwner(DEMO_CLIENTS)),
    Project.insertMany(withOwner(DEMO_PROJECTS)),
    Task.insertMany(withOwner(DEMO_TASKS))
  ]);
};

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

const demoLogin = async (_req, res) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      message: 'The demo workspace is unavailable right now. Please make sure the database is running and try again.'
    });
  }

  try {
    let user = await User.findOne({ email: DEMO_USER.email });

    if (!user) {
      user = await User.create({ ...DEMO_USER });
    }

    await seedDemoWorkspace(user._id);

    return res.json(buildAuthResponse(user));
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to start the demo right now. Please try again.' });
  }
};

module.exports = { login, signup, demoLogin };
