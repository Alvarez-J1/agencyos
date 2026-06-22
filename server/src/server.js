const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigin = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN
  : (origin, callback) => {
      const isLocalhost = !origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      callback(isLocalhost ? null : new Error('Not allowed by CORS'), isLocalhost);
    };

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AgencyOS API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`AgencyOS API running on http://localhost:${PORT}`);
  });
};

startServer();
