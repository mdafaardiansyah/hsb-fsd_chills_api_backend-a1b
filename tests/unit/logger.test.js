const logger = require('../../src/utils/logger');

// Mock console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

describe('Logger Utils Unit Tests', () => {
  let mockConsole;

  beforeEach(() => {
    // Mock all console methods
    mockConsole = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn()
    };
    
    // Replace console methods with mocks
    console.log = mockConsole.log;
    console.error = mockConsole.error;
    console.warn = mockConsole.warn;
    console.info = mockConsole.info;
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
  });

  describe('info', () => {
    test('should log info message with correct format', () => {
      const message = 'This is an info message';
      
      logger.info(message);
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      expect(loggedMessage).toContain('[INFO]');
      expect(loggedMessage).toContain(message);
      expect(loggedMessage).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    test('should handle empty message', () => {
      logger.info('');
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      expect(loggedMessage).toContain('[INFO]');
    });

    test('should handle special characters', () => {
      const message = 'Special chars: áéíóú, 中文, emoji 🎬';
      
      logger.info(message);
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      expect(loggedMessage).toContain(message);
    });
  });

  describe('error', () => {
    test('should log error message with correct format', () => {
      const message = 'This is an error message';
      
      logger.error(message);
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.error.mock.calls[0][0];
      expect(loggedMessage).toContain('[ERROR]');
      expect(loggedMessage).toContain(message);
      expect(loggedMessage).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    test('should handle Error objects', () => {
      const error = new Error('Test error');
      
      logger.error(error.message);
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.error.mock.calls[0][0];
      expect(loggedMessage).toContain('[ERROR]');
      expect(loggedMessage).toContain('Test error');
    });
  });

  describe('warn', () => {
    it('should log warning message with timestamp and format', () => {
      logger.warn('Warning message');
      
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.warn.mock.calls[0][0];
      expect(loggedMessage).toContain('[WARN]');
      expect(loggedMessage).toContain('Warning message');
      expect(loggedMessage).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    it('should handle null data', () => {
      logger.warn('Warning', null);
      
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.warn.mock.calls[0][0];
      expect(loggedMessage).toContain('[WARN]');
      expect(loggedMessage).toContain('Warning');
    });

    it('should handle object data', () => {
      const data = { key: 'value' };
      logger.warn('Warning with data', data);
      
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.warn.mock.calls[0][0];
      expect(loggedMessage).toContain('[WARN]');
      expect(loggedMessage).toContain('Warning with data');
    });
  });

  describe('debug', () => {
    it('should log debug message in development environment', () => {
      process.env.NODE_ENV = 'development';
      logger.debug('Debug message');
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      expect(loggedMessage).toContain('[DEBUG]');
      expect(loggedMessage).toContain('Debug message');
    });

    it('should not log debug message in production environment', () => {
      process.env.NODE_ENV = 'production';
      logger.debug('Debug message');
      
      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('should not log debug message in test environment', () => {
      process.env.NODE_ENV = 'test';
      logger.debug('Debug message');
      
      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('should log success message with correct format', () => {
      const message = 'This is a success message';
      
      logger.success(message);
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      expect(loggedMessage).toContain('[SUCCESS]');
      expect(loggedMessage).toContain(message);
      expect(loggedMessage).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });
  });

  describe('Timestamp Format', () => {
    test('should generate valid timestamp format', () => {
      logger.info('Test message');
      
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
      const match = loggedMessage.match(timestampRegex);
      
      expect(match).not.toBeNull();
      
      // Verify the timestamp is a valid date
      // Extract the timestamp string from the match object if it's not null
      const timestamp = match ? match[0] : null; 
      // Check if timestamp is null before creating a Date object
      const date = timestamp ? new Date(timestamp) : null; 
      
      expect(date).toBeInstanceOf(Date);
      // Check if date is not null and then if it's a valid date
      expect(date && !isNaN(date.getTime())).toBe(true); 
    });

    test('should have consistent timestamp format across different log levels', () => {
      const testMessage = 'Test message';
      process.env.NODE_ENV = 'development'; // Ensure debug logs are also checked
      
      logger.info(testMessage);
      logger.error(testMessage);
      logger.warn(testMessage);
      logger.debug(testMessage);
      logger.success(testMessage);
      
      const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
      
      // Check info log
      expect(mockConsole.log.mock.calls[0][0]).toMatch(timestampRegex); // info logs to console.log
      
      // Check error log
      expect(mockConsole.error.mock.calls[0][0]).toMatch(timestampRegex);
      
      // Check warn log
      expect(mockConsole.warn.mock.calls[0][0]).toMatch(timestampRegex);
      
      // Check debug log (mockConsole.log is used for debug)
      expect(mockConsole.log.mock.calls[1][0]).toMatch(timestampRegex); 
      
      // Check success log (mockConsole.log is used for success)
      expect(mockConsole.log.mock.calls[2][0]).toMatch(timestampRegex); 
    });
  });

  describe('Message Content', () => {
    test('should preserve message content exactly', () => {
      const messages = [
        'Simple message',
        'Message with numbers: 123',
        'Message with symbols: !@#$%^&*()',
        'Multi-line\nmessage\nwith\nbreaks',
        'JSON-like: {"key": "value"}',
        'URL: https://example.com/path?param=value'
      ];
      
      messages.forEach(message => {
        logger.info(message);
        const loggedMessage = mockConsole.log.mock.calls[mockConsole.log.mock.calls.length - 1][0]; // Changed mockConsole.info to mockConsole.log
        expect(loggedMessage).toContain(message);
      });
    });

    test('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      
      logger.info(longMessage);
      
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      expect(loggedMessage).toContain(longMessage);
    });
  });

  describe('Log Level Indicators', () => {
    test('should use correct log level indicators', () => {
      const testMessage = 'Test';
      process.env.NODE_ENV = 'development'; // Ensure debug logs are captured
      
      // Reset mock calls to ensure clean state for this specific test
      mockConsole.log.mockClear();
      mockConsole.error.mockClear();
      mockConsole.warn.mockClear();

      logger.info(testMessage);     // logs to console.log -> mockConsole.log.mock.calls[0]
      logger.error(testMessage);    // logs to console.error
      logger.warn(testMessage);     // logs to console.warn
      logger.debug(testMessage);    // logs to console.log -> mockConsole.log.mock.calls[1]
      logger.success(testMessage);  // logs to console.log -> mockConsole.log.mock.calls[2]
      
      expect(mockConsole.log.mock.calls[0][0]).toContain('[INFO]');
      expect(mockConsole.error.mock.calls[0][0]).toContain('[ERROR]');
      expect(mockConsole.warn.mock.calls[0][0]).toContain('[WARN]');
      expect(mockConsole.log.mock.calls[1][0]).toContain('[DEBUG]');
      expect(mockConsole.log.mock.calls[2][0]).toContain('[SUCCESS]');
    });
  });

  describe('Edge Cases', () => {
    test('should handle null and undefined messages', () => {
      logger.info(null);
      logger.info(undefined);
      
      expect(mockConsole.log).toHaveBeenCalledTimes(2);
      expect(mockConsole.log.mock.calls[0][0]).toContain('null');
      expect(mockConsole.log.mock.calls[1][0]).toContain('undefined');
    });

    test('should handle numeric messages', () => {
      logger.info(123);
      logger.info(0);
      logger.info(-456);
      logger.info(3.14159);
      
      expect(mockConsole.log).toHaveBeenCalledTimes(4);
      expect(mockConsole.log.mock.calls[0][0]).toContain('123');
      expect(mockConsole.log.mock.calls[1][0]).toContain('0');
      expect(mockConsole.log.mock.calls[2][0]).toContain('-456');
      expect(mockConsole.log.mock.calls[3][0]).toContain('3.14159');
    });

    test('should handle boolean messages', () => {
      logger.info(true);
      logger.info(false);
      
      expect(mockConsole.log).toHaveBeenCalledTimes(2);
      expect(mockConsole.log.mock.calls[0][0]).toContain('true');
      expect(mockConsole.log.mock.calls[1][0]).toContain('false');
    });

    test('should handle object messages', () => {
      const obj = { key: 'value', number: 42 };
      
      logger.info(obj);
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.log.mock.calls[0][0];
      expect(loggedMessage).toContain('[object Object]');
    });
  });
});