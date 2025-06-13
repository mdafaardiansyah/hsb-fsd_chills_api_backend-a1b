const {
  success,
  error,
  validationError,
  notFound,
  created,
  noContent,
  unauthorized,
  forbidden
} = require('../../src/utils/response');

// Mock response object
const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis() // Added send mock
  };
  return res;
};

describe('Response Utils Unit Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = createMockResponse();
  });

  describe('success', () => {
    test('should send success response with data and default message', () => {
      const testData = { id: 1, name: 'test' };
      
      success(mockRes, testData);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message: 'Success' // Updated default message
      });
    });

    test('should send success response with custom message', () => {
      const testData = { movies: [] };
      const customMessage = 'Movies retrieved successfully';
      
      success(mockRes, testData, customMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message: customMessage
      });
    });

    test('should handle null data', () => {
      success(mockRes, null);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success' // data field is omitted when null
      });
    });

    test('should handle empty array data', () => {
      success(mockRes, []);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        message: 'Success' // Updated default message
      });
    });
  });

  describe('error', () => {
    test('should send error response with default message and status', () => {
      error(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error' // Updated default message
      });
    });

    test('should send error response with custom message', () => {
      const customMessage = 'Database connection failed';
      
      error(mockRes, customMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: customMessage
      });
    });

    test('should send error response with custom status code', () => {
      const customMessage = 'Bad request';
      const customStatus = 400;
      
      error(mockRes, customMessage, customStatus);
      
      expect(mockRes.status).toHaveBeenCalledWith(customStatus);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: customMessage
      });
    });
  });

  describe('validationError', () => {
    test('should send validation error with single error message', () => {
      const errorMessage = 'Title is required';
      
      validationError(mockRes, errorMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: errorMessage
      });
    });

    test('should send validation error with array of errors', () => {
      const errors = ['Title is required', 'Year must be valid', 'Rating must be between 0-10'];
      
      validationError(mockRes, errors);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    });

    test('should handle empty error array', () => {
      validationError(mockRes, []);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: []
      });
    });

    it('should use custom message when provided', () => {
      const errors = ['Invalid input'];
      const customMessage = 'Custom validation message';
      
      validationError(mockRes, errors, customMessage); // Corrected function call
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: customMessage,
        errors: errors
      });
    });
  });

  describe('notFound', () => {
    test('should send not found response with default message', () => {
      notFound(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found'
      });
    });

    test('should send not found response with custom message', () => {
      const customMessage = 'Movie not found';
      
      notFound(mockRes, customMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: customMessage
      });
    });
  });

  describe('created', () => {
    test('should send created response with data and default message', () => {
      const testData = { id: 1, title: 'New Movie' };
      
      created(mockRes, testData);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message: 'Resource created successfully'
      });
    });

    test('should send created response with custom message', () => {
      const testData = { id: 1, title: 'New Movie' };
      const customMessage = 'Movie created successfully';
      
      created(mockRes, testData, customMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message: customMessage
      });
    });
  });

  describe('noContent', () => {
    test('should send no content response', () => {
      noContent(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled(); // Corrected to check for send() call
    });
  });

  describe('unauthorized', () => {
    test('should send unauthorized response with default message', () => {
      unauthorized(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access'
      });
    });

    test('should send unauthorized response with custom message', () => {
      const customMessage = 'Invalid API key';
      
      unauthorized(mockRes, customMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: customMessage
      });
    });
  });

  describe('forbidden', () => {
    test('should send forbidden response with default message', () => {
      forbidden(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access forbidden'
      });
    });

    test('should send forbidden response with custom message', () => {
      const customMessage = 'Insufficient permissions';
      
      forbidden(mockRes, customMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: customMessage
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined data in success response', () => {
      success(mockRes, undefined);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        // data field is omitted when undefined
        message: 'Success' // Corrected default message
      });
    });

    test('should handle complex nested data objects', () => {
      const complexData = {
        movies: [
          { id: 1, title: 'Movie 1', metadata: { tags: ['action', 'drama'] } },
          { id: 2, title: 'Movie 2', metadata: { tags: ['comedy'] } }
        ],
        pagination: { page: 1, total: 2, hasNext: false }
      };
      
      success(mockRes, complexData, 'Complex data retrieved');
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: complexData,
        message: 'Complex data retrieved'
      });
    });

    test('should handle very long error messages', () => {
      const longMessage = 'This is a very long error message that might exceed normal length limits and should still be handled properly by the response utility function';
      
      error(mockRes, longMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: longMessage
      });
    });

    test('should handle special characters in messages', () => {
      const specialMessage = 'Error with special chars: áéíóú, 中文, emoji 🎬';
      
      error(mockRes, specialMessage);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: specialMessage
      });
    });
  });
});