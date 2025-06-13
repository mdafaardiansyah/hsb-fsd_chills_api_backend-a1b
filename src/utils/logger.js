/**
 * @module logger
 * @description Simple logging utility for the application
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Get current timestamp
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Logger utility object
 */
const logger = {
  /**
   * Log info message
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  info: (message, data = null) => {
    console.log(
      `${colors.cyan}[INFO]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  },

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {any} error - Optional error object to log
   */
  error: (message, error = null) => {
    console.error(
      `${colors.red}[ERROR]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`,
      error ? (error.stack || error) : ''
    );
  },

  /**
   * Log warning message
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  warn: (message, data = null) => {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${colors.magenta}[DEBUG]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`,
        data ? JSON.stringify(data, null, 2) : ''
      );
    }
  },

  /**
   * Log success message
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  success: (message, data = null) => {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  }
};

module.exports = logger;