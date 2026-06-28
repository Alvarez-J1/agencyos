const mongoose = require('mongoose');

const isProduction = () => process.env.NODE_ENV === 'production';

let memoryServer = null;

const getConfiguredMongoUri = () => {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (mongoUri) {
    return mongoUri;
  }

  if (isProduction()) {
    throw new Error('MONGODB_URI is required when NODE_ENV=production. Set MONGODB_URI before starting the API.');
  }

  return null;
};

const startInMemoryMongo = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create({ instance: { dbName: 'agencyos' } });
  return memoryServer.getUri();
};

const connectDB = async () => {
  let mongoUri = getConfiguredMongoUri();
  const usingInMemory = !mongoUri;

  try {
    mongoose.set('bufferCommands', false);

    if (usingInMemory) {
      console.log('No MONGODB_URI set — starting a self-contained in-memory MongoDB for local development.');
      mongoUri = await startInMemoryMongo();
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: usingInMemory ? 30000 : 1000 });
    console.log(usingInMemory ? 'In-memory MongoDB connected' : 'MongoDB connected');
    return true;
  } catch (_error) {
    console.warn('MongoDB not connected. Protected API data will be unavailable until MongoDB is running.');
    return false;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

const validateMongoUri = () => {
  if (!process.env.MONGODB_URI?.trim() && isProduction()) {
    throw new Error('MONGODB_URI is required when NODE_ENV=production. Set MONGODB_URI before starting the API.');
  }
};

module.exports = connectDB;
module.exports.validateMongoUri = validateMongoUri;
module.exports.disconnectDB = disconnectDB;
