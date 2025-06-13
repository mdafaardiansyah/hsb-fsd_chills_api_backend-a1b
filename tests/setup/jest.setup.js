/**
 * Jest Global Setup Configuration
 * This file runs before all tests and sets up global configurations
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  /**
   * Wait for specified milliseconds
   * @param {number} ms - Milliseconds to wait
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Generate random string
   * @param {number} length - Length of string
   */
  randomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  
  /**
   * Generate random number within range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   */
  randomNumber: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

// Console override for cleaner test output
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

// Suppress console output during tests unless explicitly needed
if (process.env.SUPPRESS_CONSOLE !== 'false') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
}

// Restore console for debugging if needed
global.restoreConsole = () => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
};

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Custom matchers
expect.extend({
  /**
   * Check if response has valid API structure
   */
  toHaveValidApiStructure(received) {
    const pass = 
      typeof received === 'object' &&
      received !== null &&
      typeof received.success === 'boolean' &&
      typeof received.message === 'string';
    
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to have valid API structure`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to have valid API structure with success (boolean) and message (string)`,
        pass: false
      };
    }
  },
  
  /**
   * Check if response is a successful API response
   */
  toBeSuccessfulApiResponse(received) {
    const pass = 
      typeof received === 'object' &&
      received !== null &&
      received.success === true &&
      typeof received.message === 'string' &&
      received.data !== undefined;
    
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be a successful API response`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be a successful API response with success: true, message (string), and data`,
        pass: false
      };
    }
  },
  
  /**
   * Check if response is an error API response
   */
  toBeErrorApiResponse(received) {
    const pass = 
      typeof received === 'object' &&
      received !== null &&
      received.success === false &&
      typeof received.message === 'string';
    
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be an error API response`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be an error API response with success: false and message (string)`,
        pass: false
      };
    }
  }
});

console.log('Jest setup completed - Test environment configured');