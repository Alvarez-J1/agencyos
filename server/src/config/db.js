const mongoose = require('mongoose');

const DEVELOPMENT_MONGODB_URI = 'mongodb://127.0.0.1:27017/agencyos';

const isProduction = () => process.env.NODE_ENV === 'production';

const getMongoUri = () => {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (mongoUri) {
    return mongoUri;
  }

  if (isProduction()) {
    throw new Error('MONGODB_URI is required when NODE_ENV=production. Set MONGODB_URI before starting the API.');
  }

  return DEVELOPMENT_MONGODB_URI;
};

const connectDB = async () => {
  const mongoUri = getMongoUri();

  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1000 });
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB not connected. Protected API data will be unavailable until MongoDB is running.');
    return false;
  }
};

const validateMongoUri = () => {
  getMongoUri();
};

module.exports = connectDB;
module.exports.validateMongoUri = validateMongoUri;
