const db = require('../config/database'); // Import the database query function

/**
 * @module movieService
 * @description Service layer for movie-related database operations.
 */

/**
 * @function getAllMovies
 * @description Retrieves all movies from the database with optional filtering, sorting, and searching.
 * @param {Object} options - Query options
 * @param {string} [options.genre] - Filter by genre
 * @param {string} [options.director] - Filter by director
 * @param {number} [options.year] - Filter by release year
 * @param {string} [options.sortBy] - Sort by field (title, release_year, rating, created_at)
 * @param {string} [options.sortOrder] - Sort order (asc, desc)
 * @param {string} [options.search] - Search term for title, director, or overview
 * @param {number} [options.limit] - Limit number of results
 * @param {number} [options.offset] - Offset for pagination
 * @returns {Promise<Array>} A promise that resolves with an array of movies.
 */
async function getAllMovies(options = {}) {
  let query = `
    SELECT m.movie_id, m.title, m.overview, m.release_year, m.duration_minutes, 
           m.rating, m.director, m.poster_landscape, m.poster_portrait, 
           m.created_at, m.updated_at,
           GROUP_CONCAT(g.genre_name) as genres
    FROM movies m
    LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.genre_id
  `;
  
  const conditions = [];
  const params = [];
  
  // Filter by genre
  if (options.genre) {
    conditions.push('g.genre_name LIKE ?');
    params.push(`%${options.genre}%`);
  }
  
  // Filter by director
  if (options.director) {
    conditions.push('m.director LIKE ?');
    params.push(`%${options.director}%`);
  }
  
  // Filter by year
  if (options.year) {
    conditions.push('m.release_year = ?');
    params.push(options.year);
  }
  
  // Search functionality
  if (options.search) {
    conditions.push('(m.title LIKE ? OR m.director LIKE ? OR m.overview LIKE ?)');
    const searchTerm = `%${options.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  // Add WHERE clause if there are conditions
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  // Group by movie to handle multiple genres
  query += ' GROUP BY m.movie_id';
  
  // Sorting
  const validSortFields = ['title', 'release_year', 'rating', 'created_at'];
  const sortBy = validSortFields.includes(options.sortBy) ? options.sortBy : 'created_at';
  const sortOrder = options.sortOrder === 'asc' ? 'ASC' : 'DESC';
  
  query += ` ORDER BY m.${sortBy} ${sortOrder}`;
  
  // Pagination
  if (options.limit) {
    query += ' LIMIT ?';
    params.push(parseInt(options.limit));
    
    if (options.offset) {
      query += ' OFFSET ?';
      params.push(parseInt(options.offset));
    }
  }
  
  const rows = await db.query(query, params);
  return rows;
}

/**
 * @function getMovieById
 * @description Retrieves a single movie by its ID.
 * @param {number} id - The ID of the movie to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves with the movie object, or null if not found.
 */
async function getMovieById(id) {
  const rows = await db.query('SELECT movie_id, title, overview, release_year, duration_minutes, rating, director, cast_list, trailer_url, video_url, poster_landscape, poster_portrait FROM movies WHERE movie_id = ?', [id]);
  return rows[0] || null; // Return the first row (the movie) or null if no movie was found
}

/**
 * @function createMovie
 * @description Adds a new movie to the database.
 * @param {Object} movieData - An object containing the movie details.
 * @param {string} movieData.title - The title of the movie (required).
 * @param {string} [movieData.overview] - The overview of the movie.
 * @param {number} [movieData.release_year] - The release year of the movie.
 * @param {number} [movieData.duration_minutes] - The duration of the movie in minutes.
 * @param {number} [movieData.rating] - The rating of the movie.
 * @param {string} [movieData.director] - The director of the movie.
 * @param {string} [movieData.cast_list] - The cast list of the movie.
 * @param {string} [movieData.trailer_url] - The URL of the movie trailer.
 * @param {string} [movieData.video_url] - The URL of the movie video.
 * @param {string} [movieData.poster_landscape] - The URL of the landscape poster.
 * @param {string} [movieData.poster_portrait] - The URL of the portrait poster.
 * @returns {Promise<Object>} A promise that resolves with an object containing the insertId and affectedRows.
 */
async function createMovie(movieData) {
  let {
    title, overview = null, year = null, duration_minutes = null, // Changed release_year to year
    rating = 0.0, director = null, cast_list = null, trailer_url = null,
    video_url = null, poster_landscape = null, poster_portrait = null
    // genre = null // Genre removed as it's not a direct column in movies table
  } = movieData;

  // Use 'year' from input for 'release_year' column
  const release_year = year;

  // Trim whitespace from string fields
  if (typeof title === 'string') {
    title = title.trim();
  }
  if (typeof director === 'string') {
    director = director.trim();
  }
  // if (typeof genre === 'string') { // Trim genre if it's a string
  //   genre = genre.trim();
  // }
  // Similarly, you might want to trim other string fields like overview, cast_list etc.

  // Basic validation: title is required
  if (!title) {
    throw new Error('Movie title is required.');
  }

  const result = await db.query(
    `INSERT INTO movies (title, overview, release_year, duration_minutes, rating, director, cast_list, trailer_url, video_url, poster_landscape, poster_portrait)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // Genre removed from INSERT statement
    [title, overview, release_year, duration_minutes, rating, director, cast_list, trailer_url, video_url, poster_landscape, poster_portrait] // Using the mapped release_year
  );
  return { insertId: result.insertId, affectedRows: result.affectedRows };
}

/**
 * @function updateMovieById
 * @description Updates an existing movie by its ID.
 * @param {number} id - The ID of the movie to update.
 * @param {Object} movieData - An object containing the movie fields to update.
 * @returns {Promise<Object>} A promise that resolves with an object containing affectedRows.
 * Returns { affectedRows: 0 } if the movie was not found or no data was changed.
 */
async function updateMovieById(id, movieData) {
  // Check if movieData is empty or id is not provided
  if (!id || Object.keys(movieData).length === 0) {
    return { affectedRows: 0, message: 'No ID provided or no data to update.' };
  }

  // Construct the SET part of the query dynamically
  // This prevents accidentally setting fields to NULL if they are not provided in movieData
  const fields = [];
  const values = [];
  const allowedFields = ['title', 'overview', 'release_year', 'duration_minutes', 'rating', 'director', 'cast_list', 'trailer_url', 'video_url', 'is_trending', 'is_top_rated', 'view_count', 'poster_landscape', 'poster_portrait'];

  allowedFields.forEach(field => {
    if (movieData.hasOwnProperty(field)) {
      fields.push(`${field} = ?`);
      values.push(movieData[field]);
    }
  });

  if (fields.length === 0) {
    return { affectedRows: 0, message: 'No valid fields provided for update.' };
  }

  values.push(id); // Add the movie_id for the WHERE clause

  const sql = `UPDATE movies SET ${fields.join(', ')} WHERE movie_id = ?`;
  const result = await db.query(sql, values);

  return { affectedRows: result.affectedRows };
}


/**
 * @function deleteMovieById
 * @description Deletes a movie by its ID.
 * @param {number} id - The ID of the movie to delete.
 * @returns {Promise<Object>} A promise that resolves with an object containing affectedRows.
 */
async function deleteMovieById(id) {
  const result = await db.query('DELETE FROM movies WHERE movie_id = ?', [id]);
  return { affectedRows: result.affectedRows };
}

/**
 * @function getMoviesWithFilters
 * @description Retrieves movies with advanced filtering options.
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} A promise that resolves with filtered movies.
 */
async function getMoviesWithFilters(filters) {
  return getAllMovies(filters);
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
  getMoviesWithFilters
};