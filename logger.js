const winston = require('winston');

// Imports the Google Cloud client library for Winston
const { LoggingWinston } = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston();

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(info => {
    const { timestamp, level, message } = info;
    const severity = level.toUpperCase();
    const logValue = {
      timestamp,
      severity,
      message,
    };

    return JSON.stringify(logValue);
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: "../../var/log/webapp/csye6225.log",
      level: 'info',
      
    }),

    // Create a separate file for Log 'error' and 'warning' messages
    new winston.transports.File({
      filename: "../../var/log/webapp/csye6225.log",
      level: 'error',
    }),
 
    // Create a separate file for Log 'warning' messages
    new winston.transports.Console({
      format: logFormat,
      level: 'warn',
    }),
    loggingWinston
  ],
});

if (process.env.NODE_ENV === 'production') {
  module.exports = logger;
} else {
  module.exports = {
    info: (message) => console.log(`[INFO] ${message}`),
    debug: (message) => console.error(`[DEBUG] ${message}`),
    warn: (message) => console.warn(`[WARN] ${message}`),
    error: (message) => console.error(`[ERROR] ${message}`),
  }
}