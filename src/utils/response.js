/**
 * @module response
 * @description Utility functions for consistent API responses
 */

/**
 * Response utility object
 */
const response = {
  /**
   * Send success response
   * @param {import('express').Response} res - Express response object
   * @param {any} data - Data to send
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    const responseObj = {
      success: true,
      message,
      ...(data && { data })
    };
    
    return res.status(statusCode).json(responseObj);
  },

  /**
   * Send error response
   * @param {import('express').Response} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {any} errors - Additional error details
   */
  error: (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    const responseObj = {
      success: false,
      message,
      ...(errors && { errors })
    };
    
    return res.status(statusCode).json(responseObj);
  },

  /**
   * Send validation error response
   * @param {import('express').Response} res - Express response object
   * @param {Array} errors - Array of validation errors
   * @param {string} message - Error message
   */
  validationError: (res, errors, message = 'Validation failed') => {
    return module.exports.error(res, message, 400, errors); // Use module.exports to call the correct error function
  },

  /**
   * Send not found response
   * @param {import('express').Response} res - Express response object
   * @param {string} message - Not found message
   */
  notFound: (res, message = 'Resource not found') => {
    return module.exports.error(res, message, 404); // Use module.exports to call the correct error function
  },

  /**
   * Send created response
   * @param {import('express').Response} res - Express response object
   * @param {any} data - Created resource data
   * @param {string} message - Success message
   */
  created: (res, data = null, message = 'Resource created successfully') => {
    return module.exports.success(res, data, message, 201); // Use module.exports to call the correct success function
  },

  /**
   * Send no content response
   * @param {import('express').Response} res - Express response object
   */
  noContent: (res) => {
    return res.status(204).send();
  },

  /**
   * Send unauthorized response
   * @param {import('express').Response} res - Express response object
   * @param {string} message - Unauthorized message
   */
  unauthorized: (res, message = 'Unauthorized access') => {
    return module.exports.error(res, message, 401); // Use module.exports to call the correct error function
  },

  /**
   * Send forbidden response
   * @param {import('express').Response} res - Express response object
   * @param {string} message - Forbidden message
   */
  forbidden: (res, message = 'Access forbidden') => {
    return module.exports.error(res, message, 403); // Use module.exports to call the correct error function
  }
};

module.exports = response;