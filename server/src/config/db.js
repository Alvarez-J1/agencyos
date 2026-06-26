const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agencyos';

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

module.exports = connectDB;
