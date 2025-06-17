const db = require('../config/database'); // Import the database query function
const slugGenerator = require('../utils/slugGenerator');
const pagination = require('../utils/pagination');
const errorMessages = require('../utils/errorMessages');

/**
 * @module movieService
 * @description Service layer for movie-related database operations.
 */

/**
 * @function getAllMovies
 * @description Retrieves all movies from the database with enhanced pagination and filtering.
 * @param {Object} options - Query options
 * @param {string} [options.genre] - Filter by genre
 * @param {string} [options.director] - Filter by director
 * @param {number} [options.year] - Filter by release year
 * @param {string} [options.sortBy] - Sort by field (title, release_year, rating, created_at)
 * @param {string} [options.sortOrder] - Sort order (asc, desc)
 * @param {string} [options.search] - Search term for title, director, or overview
 * @param {number} [options.limit] - Limit number of results
 * @param {number} [options.offset] - Offset for pagination
 * @param {number} [options.page] - Page number for pagination
 * @param {boolean} [options.includePagination] - Include pagination metadata
 * @returns {Promise<Object>} A promise that resolves with movies and pagination data.
 */
async function getAllMovies(options = {}) {
  try {
    // Validate pagination parameters
    const validatedPagination = pagination.validatePaginationParams({
      page: options.page,
      limit: options.limit,
      offset: options.offset
    });

    // Build the main query
    let query = `
        SELECT 
            movie_id,
            title,
            slug,
            overview,
            poster_landscape,
            poster_portrait,
            release_year,
            duration_minutes,
            rating,
            director,
            cast_list,
            trailer_url,
            video_url,
            is_trending,
            is_top_rated,
            view_count,
            created_at,
            updated_at
        FROM movies
    `;

    // Build count query for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM movies';
    
    const queryParams = [];
    const conditions = [];

    // Add filtering conditions
    if (options.genre) {
        conditions.push(`
            EXISTS (
                SELECT 1 FROM movie_genres mg 
                JOIN genres g ON mg.genre_id = g.genre_id 
                WHERE mg.movie_id = movies.movie_id 
                AND g.name = ?
            )
        `);
        queryParams.push(options.genre);
    }

    if (options.director) {
        conditions.push('director = ?');
        queryParams.push(options.director);
    }

    if (options.year) {
        conditions.push('release_year = ?');
        queryParams.push(options.year);
    }

    // Add search functionality
    if (options.search) {
        conditions.push('(title LIKE ? OR director LIKE ? OR overview LIKE ?)');
        const searchTerm = `%${options.search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
        const whereClause = ' WHERE ' + conditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
    }

    // Add sorting
    const validSortFields = ['title', 'release_year', 'rating', 'created_at', 'view_count'];
    const sortBy = validSortFields.includes(options.sortBy) ? options.sortBy : 'created_at';
    const sortOrder = options.sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    // Execute count query for pagination
    let totalItems = 0;
    if (options.includePagination !== false) {
      const countResult = await db.query(countQuery, queryParams);
      totalItems = countResult[0]?.total || 0;
    }

    // Add pagination
    if (validatedPagination.limit) {
        query += ' LIMIT ?';
        queryParams.push(validatedPagination.limit);
        
        if (validatedPagination.offset) {
            query += ' OFFSET ?';
            queryParams.push(validatedPagination.offset);
        }
    }

    // Execute the main query
    const movies = await db.query(query, queryParams);
    
    // Return enhanced response with pagination
    if (options.includePagination !== false) {
      const paginationData = pagination.calculatePaginationMetadata({
        currentPage: validatedPagination.page,
        limit: validatedPagination.limit,
        totalItems
      });
      
      return {
        movies,
        pagination: paginationData,
        totalItems,
        summary: pagination.generatePaginationSummary(paginationData)
      };
    }
    
    return { movies };
    
  } catch (error) {
    throw errorMessages.createErrorResponse('database', error.message, {
      operation: 'getAllMovies',
      filters: options
    });
  }
}

/**
 * @function getMovieById
 * @description Retrieves a movie by its ID or slug from the database.
 * @param {number|string} identifier - The ID or slug of the movie to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves with the movie object or null if not found.
 */
async function getMovieById(identifier) {
  try {
    // Determine if identifier is a slug or ID
    const isSlug = slugGenerator.isValidSlug(identifier) && isNaN(identifier);
    
    const query = `
        SELECT 
            movie_id,
            title,
            slug,
            overview,
            poster_landscape,
            poster_portrait,
            release_year,
            duration_minutes,
            rating,
            director,
            cast_list,
            trailer_url,
            video_url,
            is_trending,
            is_top_rated,
            view_count,
            created_at,
            updated_at
        FROM movies 
        WHERE ${isSlug ? 'slug' : 'movie_id'} = ?
    `;

    const movies = await db.query(query, [identifier]);
    
    if (movies.length === 0) {
      return null;
    }
    
    // Get genres for the movie
    const movie = movies[0];
    const genreQuery = `
      SELECT g.genre_name
      FROM movie_genres mg
      JOIN genres g ON mg.genre_id = g.genre_id
      WHERE mg.movie_id = ?
    `;
    
    const genres = await db.query(genreQuery, [movie.movie_id]);
    movie.genres = genres.map(g => g.genre_name);
    
    return movie;
    
  } catch (error) {
    throw errorMessages.createErrorResponse('database', error.message, {
      operation: 'getMovieById',
      identifier
    });
  }
}

/**
 * @function createMovie
 * @description Creates a new movie in the database with slug generation.
 * @param {Object} movieData - The movie data to insert
 * @returns {Promise<Object>} A promise that resolves with the created movie data.
 */
async function createMovie(movieData) {
  try {
    // Basic validation
    if (!movieData.title) {
        throw errorMessages.createErrorResponse('validation', 'Title is required', {
          field: 'title',
          operation: 'createMovie'
        });
    }

    // Generate unique slug
    const baseSlug = slugGenerator.generateSlug(movieData.title);
    let finalSlug = baseSlug;
    let slugCounter = 1;
    
    // Check for slug uniqueness
    while (await checkSlugExists(finalSlug)) {
      finalSlug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }

    const query = `
        INSERT INTO movies (
            title, slug, overview, poster_landscape, poster_portrait, 
            release_year, duration_minutes, rating, director, 
            cast_list, trailer_url, video_url, is_trending, 
            is_top_rated, view_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        movieData.title,
        finalSlug,
        movieData.overview || null,
        movieData.poster_landscape || null,
        movieData.poster_portrait || null,
        movieData.release_year || null,
        movieData.duration_minutes || null,
        movieData.rating || 0.0,
        movieData.director || null,
        movieData.cast_list || null,
        movieData.trailer_url || null,
        movieData.video_url || null,
        movieData.is_trending || false,
        movieData.is_top_rated || false,
        movieData.view_count || 0
    ];

    const result = await db.query(query, params);
    
    // Return the created movie with its ID and slug
    return {
        movie_id: result.insertId,
        slug: finalSlug,
        ...movieData
    };
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw errorMessages.createErrorResponse('duplicate', 'Movie with this title already exists', {
        field: 'title',
        value: movieData.title
      });
    }
    
    throw errorMessages.createErrorResponse('database', error.message, {
      operation: 'createMovie',
      data: movieData
    });
  }
}

/**
 * @function checkSlugExists
 * @description Checks if a slug already exists in the database.
 * @param {string} slug - The slug to check
 * @returns {Promise<boolean>} True if slug exists, false otherwise
 */
async function checkSlugExists(slug) {
  try {
    const query = 'SELECT COUNT(*) as count FROM movies WHERE slug = ?';
    const result = await db.query(query, [slug]);
    return result[0].count > 0;
  } catch (error) {
    throw errorMessages.createErrorResponse('database', error.message, {
      operation: 'checkSlugExists',
      slug
    });
  }
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
  getMoviesWithFilters,
  checkSlugExists
};