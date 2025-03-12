const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

// Load environment variables
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'familycabinsecret';
const expiration = '2h';

module.exports = {
  // Function for GraphQL context
  authMiddleware: function ({ req }) {
    // Allow token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Extract token from "Bearer <tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      // Verify token and extract user data
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      logger.error(`Invalid token: ${err.message}`);
    }

    return req;
  },
  
  // Function to generate JWT token
  signToken: function ({ username, email, _id, role, cabins }) {
    const payload = { username, email, _id, role, cabins };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  
  // Express middleware to verify authentication
  isAuthenticated: function (req, res, next) {
    // Check for token
    const token = req.headers.authorization?.split(' ').pop().trim();
    
    if (!token) {
      return res.status(401).json({ message: 'You are not authenticated!' });
    }
    
    try {
      // Verify token
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch (err) {
      logger.error(`Authentication error: ${err.message}`);
      return res.status(401).json({ message: 'Invalid or expired token!' });
    }
  },
  
  // Middleware to check if user is an admin
  isAdmin: function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'You are not authenticated!' });
    }
    
    if (req.user.role !== 'GLOBAL_ADMIN' && 
        !(req.user.cabins && req.user.cabins.some(cabin => cabin.role === 'ADMIN'))) {
      return res.status(403).json({ message: 'You do not have admin privileges!' });
    }
    
    next();
  }
};
