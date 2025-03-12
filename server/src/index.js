const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const cors = require('cors');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./graphql');
const { authMiddleware } = require('./middleware/auth');
const { setupLogger } = require('./utils/logger');

// Setup logger
const logger = setupLogger();

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  formatError: (err) => {
    logger.error(`GraphQL Error: ${err.message}`);
    return err;
  },
});

// Start Apollo Server and apply middleware
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/build')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`🚀 GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize server
startApolloServer().catch(err => {
  logger.error(`Server initialization error: ${err.message}`);
});
