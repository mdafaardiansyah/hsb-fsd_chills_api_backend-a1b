const movieService = require('../services/movie.service'); // Import the movie service
const response = require('../utils/response'); // Import response utility
const validation = require('../utils/validation'); // Import validation utility
const logger = require('../utils/logger'); // Import logger utility

/**
 * @module movieController
 * @description Controller for handling movie-related API requests.
 */

/**
 * @function handleGetAllMovies
 * @description Handles the request to get all movies with optional filtering, sorting, and searching.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleGetAllMovies(req, res) {
  try {
    // Extract query parameters
    const {
      genre,
      director,
      year,
      sortBy,
      sortOrder,
      search,
      limit,
      offset,
      page
    } = req.query;
    
    // Build options object
    const options = {};
    
    if (genre) options.genre = genre;
    if (director) options.director = director;
    if (year) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) options.year = yearNum;
    }
    if (sortBy) options.sortBy = sortBy;
    if (sortOrder) options.sortOrder = sortOrder;
    if (search) options.search = search;
    
    // Handle pagination
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        options.limit = limitNum;
        
        // Calculate offset from page or use direct offset
        if (page) {
          const pageNum = parseInt(page);
          if (!isNaN(pageNum) && pageNum > 0) {
            options.offset = (pageNum - 1) * limitNum;
          }
        } else if (offset) {
          const offsetNum = parseInt(offset);
          if (!isNaN(offsetNum) && offsetNum >= 0) {
            options.offset = offsetNum;
          }
        }
      }
    }
    
    logger.info('Fetching movies with options:', options);
    const movies = await movieService.getAllMovies(options);
    
    // Build response with metadata
    const responseData = {
      movies,
      count: movies.length,
      filters: {
        genre: options.genre || null,
        director: options.director || null,
        year: options.year || null,
        search: options.search || null
      },
      sorting: {
        sortBy: options.sortBy || 'created_at',
        sortOrder: options.sortOrder || 'desc'
      },
      pagination: {
        limit: options.limit || null,
        offset: options.offset || null,
        page: page ? parseInt(page) : null
      }
    };
    
    logger.success(`Retrieved ${movies.length} movies`);
    return response.success(res, responseData, 'Movies retrieved successfully');
  } catch (error) {
    logger.error('Error in handleGetAllMovies:', error);
    return response.error(res, 'Failed to retrieve movies', 500);
  }
}

/**
 * @function handleGetMovieById
 * @description Handles the request to get a movie by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleGetMovieById(req, res) {
  try {
    const idValidation = validation.validateMovieId(req.params.id);
    if (!idValidation.isValid) {
      return response.validationError(res, [idValidation.error]);
    }

    logger.info(`Fetching movie with ID: ${idValidation.id}`);
    const movie = await movieService.getMovieById(idValidation.id);
    
    if (movie) {
      logger.success(`Movie found: ${movie.title}`);
      return response.success(res, movie, 'Movie retrieved successfully');
    } else {
      logger.warn(`Movie not found with ID: ${idValidation.id}`);
      return response.notFound(res, 'Movie not found');
    }
  } catch (error) {
    logger.error('Error in handleGetMovieById:', error);
    return response.error(res, 'Failed to retrieve movie', 500);
  }
}

/**
 * @function handleCreateMovie
 * @description Handles the request to create a new movie.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleCreateMovie(req, res) {
  try {
    const movieData = req.body;
    
    // Validate movie data
    const validationResult = validation.validateMovieData(movieData);
    if (!validationResult.isValid) {
      return response.validationError(res, validationResult.errors);
    }

    logger.info(`Creating new movie: ${movieData.title}`);
    const result = await movieService.createMovie(movieData);
    
    // Fetch the newly created movie to include in the response
    const newMovie = await movieService.getMovieById(result.insertId);

    logger.success(`Movie created successfully with ID: ${result.insertId}`);
    return response.created(res, newMovie, 'Movie created successfully'); // Return the full movie object
  } catch (error) {
    logger.error('Error in handleCreateMovie:', error);
    return response.error(res, 'Failed to create movie', 500);
  }
}

/**
 * @function handleUpdateMovie
 * @description Handles the request to update an existing movie by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleUpdateMovie(req, res) {
  try {
    const id = parseInt(req.params.id, 10); // Get the movie ID from request parameters
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid movie ID format.' });
    }
    const movieData = req.body; // Get update data from the request body

    if (Object.keys(movieData).length === 0) {
        return res.status(400).json({ message: 'No data provided for update.' });
    }

    const result = await movieService.updateMovieById(id, movieData);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Movie updated successfully.', affectedRows: result.affectedRows }); // Send a 200 OK response
    } else {
      // Check if the movie existed before attempting update
      const movieExists = await movieService.getMovieById(id);
      if (!movieExists) {
        return res.status(404).json({ message: 'Movie not found.' });
      }
      // If movie exists but no rows affected, it might be due to no actual change in data or no valid fields
      return res.status(200).json({ message: 'Movie found, but no changes were made or no valid fields provided for update.', affectedRows: 0 });
    }
  } catch (error) {
    console.error('Error in handleUpdateMovie:', error.message);
    res.status(500).json({ message: 'Failed to update movie.', error: error.message });
  }
}

/**
 * @function handleDeleteMovie
 * @description Handles the request to delete a movie by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleDeleteMovie(req, res) {
  try {
    const id = parseInt(req.params.id, 10); // Get the movie ID from request parameters
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid movie ID format.' });
    }
    const result = await movieService.deleteMovieById(id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Movie deleted successfully.', affectedRows: result.affectedRows }); // Send a 200 OK (or 204 No Content)
    } else {
      res.status(404).json({ message: 'Movie not found or already deleted.' }); // Send a 404 Not Found if no rows were affected
    }
  } catch (error) {
    console.error('Error in handleDeleteMovie:', error.message);
    res.status(500).json({ message: 'Failed to delete movie.', error: error.message });
  }
}

module.exports = {
  handleGetAllMovies,
  handleGetMovieById,
  handleCreateMovie,
  handleUpdateMovie,
  handleDeleteMovie
};