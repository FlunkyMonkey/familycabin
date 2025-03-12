const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure log directory exists
const logDir = '/var/log/familycabin';
const localLogDir = path.join(__dirname, '../../../logs');

// Setup logger with appropriate configuration
const setupLogger = () => {
  // Create log directory if it doesn't exist (for development)
  try {
    if (!fs.existsSync(localLogDir)) {
      fs.mkdirSync(localLogDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating local log directory:', error);
  }

  // Determine log path based on environment
  const logPath = process.env.NODE_ENV === 'production' ? logDir : localLogDir;
  
  // Create the logger
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: 'familycabin' },
    transports: [
      // Write all logs with level 'error' and below to error.log
      new winston.transports.File({ 
        filename: path.join(logPath, 'error.log'), 
        level: 'error' 
      }),
      // Write all logs with level 'info' and below to combined.log
      new winston.transports.File({ 
        filename: path.join(logPath, 'combined.log') 
      })
    ]
  });

  // If we're not in production, also log to the console
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  return logger;
};

// Create a singleton logger instance
const logger = setupLogger();

module.exports = { logger, setupLogger };
