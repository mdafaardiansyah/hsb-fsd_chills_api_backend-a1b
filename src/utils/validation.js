/**
 * @module validation
 * @description Validation utilities for the application
 */

/**
 * Validation utility object
 */
const validation = {
  /**
   * Validate if a value is a non-empty string
   * @param {any} value - Value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  isNonEmptyString: (value) => {
    return typeof value === 'string' && value.trim().length > 0;
  },

  /**
   * Validate if a value is a positive integer
   * @param {any} value - Value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  isPositiveInteger: (value) => {
    return Number.isInteger(value) && value > 0;
  },

  /**
   * Validate if a value is a valid year (between 1900 and current year + 10)
   * @param {any} value - Value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  isValidYear: (value) => {
    const currentYear = new Date().getFullYear();
    return Number.isInteger(value) && value >= 1900 && value <= currentYear + 10;
  },

  /**
   * Validate if a value is a valid rating (between 0 and 10)
   * @param {any} value - Value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  isValidRating: (value) => {
    return typeof value === 'number' && value >= 0 && value <= 10;
  },

  /**
   * Validate if a value is a valid URL
   * @param {any} value - Value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  isValidUrl: (value) => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate movie data for creation
   * @param {Object} movieData - Movie data to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateMovieData: (movieData) => {
    const errors = [];

    // Title is required
    if (!validation.isNonEmptyString(movieData.title)) {
      errors.push('Title is required and must be a non-empty string');
    }

    // Director is required
    if (!validation.isNonEmptyString(movieData.director)) {
      errors.push('Director is required and must be a non-empty string');
    }

    // Year is required
    if (movieData.year === undefined || movieData.year === null) {
      errors.push('Year is required');
    } else if (!validation.isValidYear(movieData.year)) {
      errors.push('Year must be a valid year between 1900 and ' + (new Date().getFullYear() + 10));
    }

    // Genre is required
    if (!validation.isNonEmptyString(movieData.genre)) {
      errors.push('Genre is required and must be a non-empty string');
    }

    // Optional fields validation
    // Removed release_year validation here as 'year' is the primary field.

    if (movieData.duration_minutes !== undefined && movieData.duration_minutes !== null) {
      if (!validation.isPositiveInteger(movieData.duration_minutes)) {
        errors.push('Duration must be a positive integer');
      }
    }

    if (movieData.rating !== undefined && movieData.rating !== null) {
      if (!validation.isValidRating(movieData.rating)) {
        errors.push('Rating must be a number between 0 and 10');
      }
    }

    if (movieData.trailer_url && !validation.isValidUrl(movieData.trailer_url)) {
      errors.push('Trailer URL must be a valid URL');
    }

    if (movieData.video_url && !validation.isValidUrl(movieData.video_url)) {
      errors.push('Video URL must be a valid URL');
    }

    if (movieData.poster_landscape && !validation.isValidUrl(movieData.poster_landscape)) {
      errors.push('Landscape poster URL must be a valid URL');
    }

    if (movieData.poster_portrait && !validation.isValidUrl(movieData.poster_portrait)) {
      errors.push('Portrait poster URL must be a valid URL');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate movie ID
   * @param {any} id - ID to validate
   * @returns {Object} Validation result with isValid and error
   */
  validateMovieId: (id) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return {
        isValid: false,
        error: 'Movie ID must be a positive integer'
      };
    }
    return {
      isValid: true,
      id: numericId
    };
  }
};

module.exports = validation;