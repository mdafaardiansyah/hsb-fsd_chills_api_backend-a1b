/**
 * @module errorMessages
 * @description User-friendly error message utility for converting technical errors
 */

const errorMessages = {
  /**
   * Convert technical errors to user-friendly messages
   * @param {Error} error - Technical error object
   * @param {string} context - Error context (movie, user, upload, auth, etc.)
   * @returns {string} User-friendly error message
   * @example
   * getUserFriendlyMessage(new Error('ER_DUP_ENTRY'), 'movie')
   * // Returns: 'A movie with this title already exists. Please choose a different title.'
   */
  getUserFriendlyMessage: (error, context = 'general') => {
    const errorCode = error.code || error.name || '';
    const errorMessage = error.message || '';
    
    // Database constraint errors
    if (errorCode === 'ER_DUP_ENTRY') {
      return errorMessages.handleDuplicateEntry(errorMessage, context);
    }
    
    if (errorCode === 'ER_NO_REFERENCED_ROW_2' || errorCode === 'ER_NO_REFERENCED_ROW') {
      return errorMessages.handleForeignKeyError(context);
    }
    
    if (errorCode === 'ER_ROW_IS_REFERENCED_2' || errorCode === 'ER_ROW_IS_REFERENCED') {
      return errorMessages.handleReferenceConstraintError(context);
    }
    
    // Connection and database errors
    if (errorCode === 'ECONNREFUSED' || errorCode === 'ER_ACCESS_DENIED_ERROR') {
      return 'Unable to connect to the database. Please try again later.';
    }
    
    if (errorCode === 'ER_NO_SUCH_TABLE') {
      return 'A system error occurred. Please contact support if this persists.';
    }
    
    // Validation errors
    if (errorCode === 'ValidationError' || errorMessage.includes('validation')) {
      return 'Please check your input. Some required fields are missing or invalid.';
    }
    
    // File upload errors
    if (errorMessage.includes('File too large') || errorMessage.includes('LIMIT_FILE_SIZE')) {
      return 'The file you uploaded is too large. Please choose a file smaller than 5MB.';
    }
    
    if (errorMessage.includes('Only image files') || errorMessage.includes('LIMIT_FILE_TYPE')) {
      return 'Please upload only image files (JPG, PNG, GIF, WebP).';
    }
    
    if (errorMessage.includes('Too many files') || errorMessage.includes('LIMIT_FILE_COUNT')) {
      return 'You can upload a maximum of 5 files at once.';
    }
    
    // Authentication and authorization errors
    if (errorCode === 'JsonWebTokenError' || errorCode === 'TokenExpiredError') {
      return 'Your session has expired. Please log in again.';
    }
    
    if (errorCode === 'UnauthorizedError' || errorMessage.includes('Unauthorized')) {
      return 'You are not authorized to perform this action.';
    }
    
    if (errorMessage.includes('Invalid credentials') || errorMessage.includes('password')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    // Network and timeout errors
    if (errorCode === 'ETIMEDOUT' || errorMessage.includes('timeout')) {
      return 'The request timed out. Please check your connection and try again.';
    }
    
    if (errorCode === 'ENOTFOUND' || errorMessage.includes('network')) {
      return 'Network error occurred. Please check your internet connection.';
    }
    
    // Default context-specific messages
    return errorMessages.getContextSpecificMessage(context);
  },

  /**
   * Handle duplicate entry errors with context-specific messages
   * @param {string} errorMessage - Original error message
   * @param {string} context - Error context
   * @returns {string} User-friendly duplicate entry message
   */
  handleDuplicateEntry: (errorMessage, context) => {
    const lowerMessage = errorMessage.toLowerCase();
    
    if (context === 'movie') {
      if (lowerMessage.includes('title')) {
        return 'A movie with this title already exists. Please choose a different title.';
      }
      return 'This movie already exists in the database.';
    }
    
    if (context === 'user') {
      if (lowerMessage.includes('email')) {
        return 'An account with this email address already exists. Please use a different email or try logging in.';
      }
      if (lowerMessage.includes('username')) {
        return 'This username is already taken. Please choose a different username.';
      }
      return 'An account with these details already exists.';
    }
    
    if (context === 'genre') {
      return 'This genre already exists. Please choose a different name.';
    }
    
    return 'This item already exists. Please check your input and try again.';
  },

  /**
   * Handle foreign key constraint errors
   * @param {string} context - Error context
   * @returns {string} User-friendly foreign key error message
   */
  handleForeignKeyError: (context) => {
    const messages = {
      movie: 'The selected genre or category does not exist. Please choose a valid option.',
      user: 'The selected package or subscription does not exist. Please choose a valid option.',
      episode: 'The selected series does not exist. Please choose a valid series.',
      review: 'The selected movie or user does not exist.',
      general: 'The referenced item does not exist. Please check your selection.'
    };
    
    return messages[context] || messages.general;
  },

  /**
   * Handle reference constraint errors (cannot delete referenced item)
   * @param {string} context - Error context
   * @returns {string} User-friendly reference constraint error message
   */
  handleReferenceConstraintError: (context) => {
    const messages = {
      movie: 'This movie cannot be deleted because it has associated reviews or ratings.',
      user: 'This user cannot be deleted because they have associated data.',
      genre: 'This genre cannot be deleted because it is used by existing movies.',
      series: 'This series cannot be deleted because it has associated episodes.',
      general: 'This item cannot be deleted because it is being used by other data.'
    };
    
    return messages[context] || messages.general;
  },

  /**
   * Get context-specific default error messages
   * @param {string} context - Error context
   * @returns {string} Context-specific error message
   */
  getContextSpecificMessage: (context) => {
    const messages = {
      movie: 'There was a problem with the movie operation. Please check your input and try again.',
      user: 'There was a problem with your account operation. Please try again.',
      upload: 'There was a problem uploading your file. Please check the file and try again.',
      auth: 'Authentication failed. Please check your credentials and try again.',
      search: 'There was a problem with your search. Please try different search terms.',
      pagination: 'There was a problem loading the requested page. Please try again.',
      general: 'Something went wrong. Please try again later.'
    };
    
    return messages[context] || messages.general;
  },

  /**
   * Format validation errors for user display
   * @param {Array} errors - Array of validation error messages
   * @returns {Array} User-friendly validation error messages
   */
  formatValidationErrors: (errors) => {
    if (!Array.isArray(errors)) {
      return [errorMessages.getUserFriendlyMessage({ message: errors }, 'validation')];
    }
    
    return errors.map(error => {
      const message = typeof error === 'string' ? error : error.message || error.toString();
      
      // Convert field names to user-friendly labels
      const fieldLabels = {
        title: 'Movie Title',
        director: 'Director Name',
        year: 'Release Year',
        release_year: 'Release Year',
        genre: 'Genre',
        duration_minutes: 'Duration',
        rating: 'Rating',
        email: 'Email Address',
        password: 'Password',
        username: 'Username',
        full_name: 'Full Name',
        phone_number: 'Phone Number',
        date_of_birth: 'Date of Birth',
        overview: 'Movie Description',
        cast_list: 'Cast List',
        trailer_url: 'Trailer URL',
        video_url: 'Video URL'
      };
      
      // Replace technical field names with user-friendly labels
      let friendlyMessage = message;
      Object.entries(fieldLabels).forEach(([field, label]) => {
        const regex = new RegExp(`\\b${field}\\b`, 'gi');
        friendlyMessage = friendlyMessage.replace(regex, label);
      });
      
      // Clean up common validation message patterns
      friendlyMessage = friendlyMessage
        .replace(/is required and must be a non-empty string/gi, 'is required')
        .replace(/must be a positive integer/gi, 'must be a positive number')
        .replace(/must be a valid year between/gi, 'must be a year between')
        .replace(/must be a valid URL/gi, 'must be a valid web address')
        .replace(/must be a valid email/gi, 'must be a valid email address');
      
      return friendlyMessage;
    });
  },

  /**
   * Create error response object with user-friendly messages
   * @param {Error} error - Original error
   * @param {string} context - Error context
   * @param {Object} additionalInfo - Additional error information
   * @returns {Object} Formatted error response
   */
  createErrorResponse: (error, context = 'general', additionalInfo = {}) => {
    const userMessage = errorMessages.getUserFriendlyMessage(error, context);
    
    const response = {
      success: false,
      message: userMessage,
      error: {
        type: context,
        timestamp: new Date().toISOString(),
        ...additionalInfo
      }
    };
    
    // Add technical details in development mode
    if (process.env.NODE_ENV === 'development') {
      response.error.technical = {
        code: error.code || error.name,
        message: error.message,
        stack: error.stack
      };
    }
    
    return response;
  },

  /**
   * Get HTTP status code based on error type
   * @param {Error} error - Error object
   * @param {string} context - Error context
   * @returns {number} Appropriate HTTP status code
   */
  getHttpStatusCode: (error, context = 'general') => {
    const errorCode = error.code || error.name || '';
    const errorMessage = error.message || '';
    
    // Client errors (4xx)
    if (errorCode === 'ValidationError' || errorMessage.includes('validation')) {
      return 400; // Bad Request
    }
    
    if (errorCode === 'ER_DUP_ENTRY') {
      return 409; // Conflict
    }
    
    if (errorCode === 'JsonWebTokenError' || errorCode === 'TokenExpiredError') {
      return 401; // Unauthorized
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
      return 404; // Not Found
    }
    
    if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      return 403; // Forbidden
    }
    
    if (errorMessage.includes('File too large') || errorMessage.includes('LIMIT_')) {
      return 413; // Payload Too Large
    }
    
    // Server errors (5xx)
    if (errorCode === 'ECONNREFUSED' || errorCode === 'ER_ACCESS_DENIED_ERROR') {
      return 503; // Service Unavailable
    }
    
    if (errorCode === 'ETIMEDOUT') {
      return 504; // Gateway Timeout
    }
    
    // Default to 500 for server errors
    return 500; // Internal Server Error
  }
};

module.exports = errorMessages;