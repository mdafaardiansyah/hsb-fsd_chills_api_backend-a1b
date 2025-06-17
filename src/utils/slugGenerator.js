/**
 * @module slugGenerator
 * @description Utility for generating URL-friendly slugs from movie titles
 */

const slugGenerator = {
  /**
   * Generate URL-friendly slug from movie title
   * @param {string} title - Movie title
   * @param {number} movieId - Movie ID for uniqueness (optional)
   * @returns {string} Generated slug
   * @example
   * generateMovieSlug('The Dark Knight', 123) // returns 'the-dark-knight-123'
   */
  generateMovieSlug: (title, movieId = null) => {
    if (!title || typeof title !== 'string') {
      throw new Error('Title is required for slug generation');
    }

    // Convert to lowercase and remove special characters
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    // Limit slug length to prevent overly long URLs
    if (slug.length > 50) {
      slug = slug.substring(0, 50).replace(/-[^-]*$/, ''); // Cut at word boundary
    }

    // Add movie ID for uniqueness if provided
    if (movieId) {
      slug = `${slug}-${movieId}`;
    }

    // Fallback if slug is empty after processing
    if (!slug) {
      slug = movieId ? `movie-${movieId}` : `movie-${Date.now()}`;
    }

    return slug;
  },

  /**
   * Validate slug format
   * @param {string} slug - Slug to validate
   * @returns {boolean} True if valid slug format
   */
  isValidSlug: (slug) => {
    if (!slug || typeof slug !== 'string') {
      return false;
    }
    
    // Slug should contain only lowercase letters, numbers, and hyphens
    // Should not start or end with hyphen
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length <= 100;
  },

  /**
   * Extract movie ID from slug if present
   * @param {string} slug - Slug containing movie ID
   * @returns {number|null} Movie ID or null if not found
   */
  extractMovieIdFromSlug: (slug) => {
    if (!slug || typeof slug !== 'string') {
      return null;
    }

    // Look for pattern ending with -number
    const match = slug.match(/-([0-9]+)$/);
    return match ? parseInt(match[1], 10) : null;
  },

  /**
   * Generate slug from existing movie data
   * @param {Object} movie - Movie object with title and movie_id
   * @returns {string} Generated slug
   */
  generateFromMovie: (movie) => {
    if (!movie || !movie.title) {
      throw new Error('Movie object with title is required');
    }

    return slugGenerator.generateMovieSlug(movie.title, movie.movie_id);
  }
};

module.exports = slugGenerator;