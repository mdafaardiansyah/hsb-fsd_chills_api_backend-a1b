/**
 * Test helper functions
 */

/**
 * Sample movie data for testing
 */
const sampleMovies = {
  valid: {
    title: 'Test Movie',
    director: 'Test Director',
    year: 2023,
    genre: 'Action',
    rating: 8.5
  },
  validWithoutRating: {
    title: 'Movie Without Rating',
    director: 'Another Director',
    year: 2022,
    genre: 'Drama'
  },
  invalidYear: {
    title: 'Invalid Year Movie',
    director: 'Test Director',
    year: 1800, // Invalid year
    genre: 'Action',
    rating: 8.5
  },
  invalidRating: {
    title: 'Invalid Rating Movie',
    director: 'Test Director',
    year: 2023,
    genre: 'Action',
    rating: 15.0 // Invalid rating (> 10)
  },
  missingFields: {
    title: 'Incomplete Movie'
    // Missing required fields
  }
};

/**
 * Generate random movie data
 * @returns {Object} Random movie data
 */
const generateRandomMovie = () => {
  const titles = ['Action Hero', 'Drama Queen', 'Comedy King', 'Horror Night', 'Sci-Fi Future'];
  const directors = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
  const genres = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi'];
  
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    director: directors[Math.floor(Math.random() * directors.length)],
    year: Math.floor(Math.random() * (2024 - 1900) + 1900),
    genre: genres[Math.floor(Math.random() * genres.length)],
    rating: Math.round((Math.random() * 10) * 10) / 10
  };
};

/**
 * Wait for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after specified time
 */
const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Validate response structure
 * @param {Object} response - Response object to validate
 * @param {boolean} expectSuccess - Whether to expect success response
 * @returns {boolean} True if valid structure
 */
const validateResponseStructure = (response, expectSuccess = true) => {
  const hasRequiredFields = 
    typeof response.success === 'boolean' &&
    typeof response.message === 'string';
  
  if (expectSuccess) {
    return hasRequiredFields && response.success === true && response.data !== undefined;
  } else {
    return hasRequiredFields && response.success === false;
  }
};

/**
 * Create multiple test movies
 * @param {number} count - Number of movies to create
 * @returns {Array} Array of movie objects
 */
const createMultipleMovies = (count = 5) => {
  const movies = [];
  for (let i = 0; i < count; i++) {
    movies.push({
      title: `Test Movie ${i + 1}`,
      director: `Director ${i + 1}`,
      year: 2020 + i,
      genre: ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi'][i % 5],
      rating: Math.round((5 + i) * 10) / 10
    });
  }
  return movies;
};

module.exports = {
  sampleMovies,
  generateRandomMovie,
  wait,
  validateResponseStructure,
  createMultipleMovies
};