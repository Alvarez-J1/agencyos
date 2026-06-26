const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');

const connectDB = require('./config/db');
const { validateMongoUri } = require('./config/db');
const { validateJwtSecret } = require('./config/jwt');
const { apiLimiter } = require('./config/rateLimiters');
const ensureResourceIndexes = require('./config/resourceIndexes');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const requestBodyLimit = process.env.REQUEST_BODY_LIMIT?.trim() || '100kb';
const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

const getAllowedOrigins = () =>
  (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const validateCorsConfig = () => {
  if (isProduction && getAllowedOrigins().length === 0) {
    throw new Error(
      'CLIENT_ORIGIN is required when NODE_ENV=production. Set one or more comma-separated frontend origins.'
    );
  }
};

const createCorsOrigin = () => {
  const allowedOrigins = new Set(getAllowedOrigins());

  return (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    if (!isProduction && localhostOriginPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  };
};

validateJwtSecret();
validateCorsConfig();
validateMongoUri();

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors({ origin: createCorsOrigin() }));
app.use(express.json({ limit: requestBodyLimit }));

app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AgencyOS API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/tasks', taskRoutes);

const startServer = async () => {
  const isDatabaseConnected = await connectDB();

  if (isDatabaseConnected) {
    await ensureResourceIndexes();
  }

  app.listen(PORT, () => {
    console.log(`AgencyOS API running on http://localhost:${PORT}`);
  });
};

startServer();
