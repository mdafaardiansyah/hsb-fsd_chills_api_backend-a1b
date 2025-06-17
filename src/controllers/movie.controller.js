const movieService = require('../services/movie.service'); // Import the movie service
const response = require('../utils/response'); // Import response utility
const validation = require('../utils/validation'); // Import validation utility
const pagination = require('../utils/pagination');
const errorMessages = require('../utils/errorMessages');
const slugGenerator = require('../utils/slugGenerator');
const logger = require('../utils/logger'); // Import logger utility

/**
 * @module movieController
 * @description Controller for handling movie-related API requests.
 */

/**
 * @function handleGetAllMovies
 * @description Handles the request to get all movies with enhanced pagination and filtering.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleGetAllMovies(req, res) {
    try {
        // Extract and validate query parameters
        const {
            genre,
            director,
            year,
            search,
            sortBy = 'created_at',
            sortOrder = 'desc',
            limit = 10,
            page = 1
        } = req.query;

        // Validate pagination parameters
        const validatedPagination = pagination.validatePaginationParams({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        // Build options object
        const options = {
            genre,
            director,
            year: year ? parseInt(year) : undefined,
            search,
            sortBy,
            sortOrder,
            limit: validatedPagination.limit,
            page: validatedPagination.page,
            offset: validatedPagination.offset,
            includePagination: true
        };

        // Get movies from service with enhanced pagination
        const result = await movieService.getAllMovies(options);
        
        // Generate pagination links
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        const paginationLinks = pagination.generatePaginationLinks({
            baseUrl,
            currentPage: result.pagination.currentPage,
            totalPages: result.pagination.totalPages,
            queryParams: req.query
        });
        
        // Format enhanced response
        const responseData = {
            movies: result.movies,
            pagination: {
                ...result.pagination,
                links: paginationLinks
            },
            summary: result.summary,
            filters: {
                genre,
                director,
                year,
                search
            },
            sorting: {
                sortBy,
                sortOrder
            },
            meta: {
                totalItems: result.totalItems,
                requestedAt: new Date().toISOString(),
                processingTime: `${Date.now() - req.startTime}ms`
            }
        };

        response.success(res, 'Movies retrieved successfully', responseData);
        
    } catch (error) {
        logger.error('Error in handleGetAllMovies:', error);
        
        const errorResponse = errorMessages.createErrorResponse('database', error.message, {
            operation: 'getAllMovies',
            query: req.query
        });
        
        response.error(res, errorResponse.message, errorResponse.statusCode, errorResponse.details);
    }
}

/**
 * @function handleGetMovieById
 * @description Handles the request to get a movie by its ID or slug.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleGetMovieById(req, res) {
    try {
        const { identifier } = req.params;
        
        // Validate identifier (can be ID or slug)
        if (!identifier || identifier.trim() === '') {
            const errorResponse = errorMessages.formatValidationErrors([
                { field: 'identifier', message: 'Movie ID or slug is required' }
            ]);
            return response.validationError(res, errorResponse.message, errorResponse.errors);
        }
        
        // Check if it's a valid ID or slug
        const isNumericId = !isNaN(identifier) && validation.isPositiveInteger(identifier);
        const isValidSlug = slugGenerator.isValidSlug(identifier);
        
        if (!isNumericId && !isValidSlug) {
            const errorResponse = errorMessages.createErrorResponse('validation', 
                'Invalid movie identifier. Must be a valid ID or slug.', {
                    field: 'identifier',
                    value: identifier,
                    expectedFormat: 'positive integer or valid slug'
                }
            );
            return response.validationError(res, errorResponse.message, errorResponse.details);
        }
        
        const movie = await movieService.getMovieById(identifier);
        
        if (!movie) {
            const errorResponse = errorMessages.createErrorResponse('notFound', 
                `Movie not found with ${isNumericId ? 'ID' : 'slug'}: ${identifier}`, {
                    identifier,
                    type: isNumericId ? 'ID' : 'slug'
                }
            );
            return response.notFound(res, errorResponse.message);
        }
        
        // Add metadata to response
        const responseData = {
            ...movie,
            meta: {
                accessedBy: isNumericId ? 'ID' : 'slug',
                identifier,
                retrievedAt: new Date().toISOString()
            }
        };
        
        response.success(res, 'Movie retrieved successfully', responseData);
        
    } catch (error) {
        logger.error('Error in handleGetMovieById:', error);
        
        const errorResponse = errorMessages.createErrorResponse('database', error.message, {
            operation: 'getMovieById',
            identifier: req.params.identifier
        });
        
        response.error(res, errorResponse.message, errorResponse.statusCode, errorResponse.details);
    }
}

/**
 * @function handleCreateMovie
 * @description Handles the request to create a new movie with slug generation.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleCreateMovie(req, res) {
    try {
        // Validate movie data
        const validationResult = validation.validateMovieData(req.body);
        if (!validationResult.isValid) {
            const errorResponse = errorMessages.formatValidationErrors(
                validationResult.errors.map(error => ({
                    field: error.field || 'unknown',
                    message: error.message || error
                }))
            );
            return response.validationError(res, errorResponse.message, errorResponse.errors);
        }
        
        // Log movie creation attempt
        logger.info('Creating new movie:', { title: req.body.title });
        
        const createdMovie = await movieService.createMovie(req.body);
        
        // Add metadata to response
        const responseData = {
            ...createdMovie,
            meta: {
                slug: createdMovie.slug,
                createdAt: new Date().toISOString(),
                operation: 'create'
            }
        };
        
        logger.success(`Movie created successfully: ${createdMovie.title} (slug: ${createdMovie.slug})`);
        response.created(res, 'Movie created successfully', responseData);
        
    } catch (error) {
        logger.error('Error in handleCreateMovie:', error);
        
        // Handle specific error types
        if (error.type === 'duplicate') {
            return response.error(res, error.message, 409, error.details);
        }
        
        if (error.type === 'validation') {
            return response.validationError(res, error.message, error.details);
        }
        
        const errorResponse = errorMessages.createErrorResponse('database', error.message, {
            operation: 'createMovie',
            data: req.body
        });
        
        response.error(res, errorResponse.message, errorResponse.statusCode, errorResponse.details);
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
    logger.error('Error in handleUpdateMovie:', error);
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
    logger.error('Error in handleDeleteMovie:', error);
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