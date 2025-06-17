/**
 * @module fileNaming
 * @description Smart file naming utility for context-aware file renaming
 */

const path = require('path');
const crypto = require('crypto');

const fileNaming = {
  /**
   * Generate smart filename based on context
   * @param {Object} options - Naming options
   * @param {string} options.originalName - Original filename
   * @param {string} options.context - File context (movie-poster, user-avatar, etc)
   * @param {string|number} options.entityId - Related entity ID
   * @param {string} options.variant - File variant (landscape, portrait, thumbnail)
   * @param {string} options.entityName - Entity name for readable filename
   * @returns {string} Smart filename
   * @example
   * generateSmartFilename({
   *   originalName: 'poster.jpg',
   *   context: 'movie-poster',
   *   entityId: 123,
   *   variant: 'landscape',
   *   entityName: 'The Dark Knight'
   * }) // returns 'movie-poster-123-the-dark-knight-landscape-1640995200000-a1b2c3d4.jpg'
   */
  generateSmartFilename: (options) => {
    const { 
      originalName, 
      context = 'general', 
      entityId, 
      variant, 
      entityName 
    } = options;
    
    if (!originalName) {
      throw new Error('Original filename is required');
    }
    
    // Extract file extension
    const ext = path.extname(originalName).toLowerCase();
    
    // Generate timestamp
    const timestamp = Date.now();
    
    // Generate short hash for uniqueness
    const hash = crypto.randomBytes(4).toString('hex');
    
    // Build filename parts
    const parts = [context];
    
    if (entityId) {
      parts.push(entityId.toString());
    }
    
    // Add sanitized entity name if provided
    if (entityName) {
      const sanitizedName = fileNaming.sanitizeForFilename(entityName);
      if (sanitizedName) {
        parts.push(sanitizedName);
      }
    }
    
    if (variant) {
      parts.push(variant);
    }
    
    parts.push(timestamp);
    parts.push(hash);
    
    return `${parts.join('-')}${ext}`;
  },

  /**
   * Generate movie poster filename
   * @param {string} movieTitle - Movie title
   * @param {number} movieId - Movie ID
   * @param {string} variant - poster variant (landscape/portrait)
   * @param {string} originalName - Original filename
   * @returns {string} Movie poster filename
   */
  generateMoviePosterFilename: (movieTitle, movieId, variant, originalName) => {
    if (!movieTitle || !movieId || !variant || !originalName) {
      throw new Error('All parameters are required for movie poster filename generation');
    }

    return fileNaming.generateSmartFilename({
      originalName,
      context: 'movie-poster',
      entityId: movieId,
      variant,
      entityName: movieTitle
    });
  },

  /**
   * Generate user avatar filename
   * @param {string} username - Username
   * @param {number} userId - User ID
   * @param {string} originalName - Original filename
   * @returns {string} User avatar filename
   */
  generateUserAvatarFilename: (username, userId, originalName) => {
    if (!username || !userId || !originalName) {
      throw new Error('All parameters are required for user avatar filename generation');
    }

    return fileNaming.generateSmartFilename({
      originalName,
      context: 'user-avatar',
      entityId: userId,
      entityName: username
    });
  },

  /**
   * Generate thumbnail filename from original filename
   * @param {string} originalFilename - Original filename
   * @param {string} size - Thumbnail size (small, medium, large)
   * @returns {string} Thumbnail filename
   */
  generateThumbnailFilename: (originalFilename, size = 'medium') => {
    if (!originalFilename) {
      throw new Error('Original filename is required');
    }

    const ext = path.extname(originalFilename);
    const nameWithoutExt = path.basename(originalFilename, ext);
    
    return `${nameWithoutExt}-thumb-${size}${ext}`;
  },

  /**
   * Sanitize string for use in filename
   * @param {string} str - String to sanitize
   * @param {number} maxLength - Maximum length (default: 30)
   * @returns {string} Sanitized string
   */
  sanitizeForFilename: (str, maxLength = 30) => {
    if (!str || typeof str !== 'string') {
      return '';
    }

    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, maxLength) // Limit length
      .replace(/-[^-]*$/, ''); // Cut at word boundary if truncated
  },

  /**
   * Parse smart filename to extract metadata
   * @param {string} filename - Smart filename to parse
   * @returns {Object} Parsed metadata
   */
  parseSmartFilename: (filename) => {
    if (!filename || typeof filename !== 'string') {
      return null;
    }

    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const parts = nameWithoutExt.split('-');

    if (parts.length < 3) {
      return null; // Not a smart filename
    }

    // Extract timestamp and hash (last two parts)
    const hash = parts.pop();
    const timestamp = parts.pop();

    // Extract context (first part)
    const context = parts.shift();

    // Try to extract entity ID (should be numeric)
    let entityId = null;
    let variant = null;
    let entityName = null;

    if (parts.length > 0 && /^\d+$/.test(parts[0])) {
      entityId = parseInt(parts.shift(), 10);
    }

    // Remaining parts could be entity name and variant
    if (parts.length > 0) {
      // Last part might be variant if it's a known variant
      const knownVariants = ['landscape', 'portrait', 'thumbnail', 'small', 'medium', 'large'];
      const lastPart = parts[parts.length - 1];
      
      if (knownVariants.includes(lastPart)) {
        variant = parts.pop();
      }
      
      // Remaining parts form the entity name
      if (parts.length > 0) {
        entityName = parts.join('-');
      }
    }

    return {
      context,
      entityId,
      entityName,
      variant,
      timestamp: parseInt(timestamp, 10),
      hash,
      extension: ext
    };
  },

  /**
   * Check if filename follows smart naming convention
   * @param {string} filename - Filename to check
   * @returns {boolean} True if follows smart naming convention
   */
  isSmartFilename: (filename) => {
    const parsed = fileNaming.parseSmartFilename(filename);
    return parsed !== null && parsed.context && parsed.timestamp && parsed.hash;
  }
};

module.exports = fileNaming;