const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

// Load environment variables
require('dotenv').config();

// MongoDB connection string
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/familycabin';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  logger.info('MongoDB database connection established successfully');
});

module.exports = db;
