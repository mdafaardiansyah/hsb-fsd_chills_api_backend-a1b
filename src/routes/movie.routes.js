const express = require('express');                 // Import Express framework
const router = express.Router();                 // Create a new Express router
const movieController = require('../controllers/movie.controller'); // Import the movie controller
const authMiddleware = require('../middleware/auth.middleware'); // Import auth middleware

/**
 * @module movieRoutes
 * @description Defines the API routes for movie operations.
 * All routes are prefixed with '/api/movies' (defined in the main app file).
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies with enhanced pagination
 *     description: |
 *       Retrieve a paginated list of movies with comprehensive metadata.
 *       
 *       **Phase 1 Features:**
 *       - Enhanced pagination with navigation links
 *       - Performance tracking
 *       - User-friendly summary
 *       - Filtering and sorting support
 *       - Movies include slug field for SEO-friendly URLs
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 2
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of movies per page
 *         example: 10
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter movies by genre
 *         example: "action"
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter movies by release year
 *         example: 2020
 *       - in: query
 *         name: director
 *         schema:
 *           type: string
 *         description: Filter movies by director
 *         example: "Christopher Nolan"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, year, rating, created_at]
 *           default: title
 *         description: Field to sort by
 *         example: "rating"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Successfully retrieved movies with enhanced pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieListResponse'
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnhancedErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authMiddleware.verifyToken, movieController.handleGetAllMovies);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie (Phase 1 Feature)
 *     description: |
 *       Add a new movie to the database with automatic slug generation.
 *       
 *       **Phase 1 Features:**
 *       - Automatic slug generation from movie title
 *       - SEO-friendly URL slugs (lowercase, hyphenated)
 *       - Enhanced error messages with detailed validation
 *       - Duplicate title handling with unique slugs
 *       
 *       **Slug Generation:**
 *       - Title "The Dark Knight" → slug "the-dark-knight"
 *       - Special characters removed, spaces converted to hyphens
 *       - Automatic uniqueness handling for duplicate titles
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *           example:
 *             title: "The Dark Knight"
 *             overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
 *             year: 2008
 *             duration_minutes: 152
 *             rating: 9.0
 *             director: "Christopher Nolan"
 *             genre: "Action, Crime, Drama"
 *             cast_list: "Christian Bale, Heath Ledger, Aaron Eckhart"
 *             trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
 *             video_url: "https://streaming.example.com/dark-knight"
 *             poster_landscape: "https://images.example.com/dark_knight_landscape.jpg"
 *             poster_portrait: "https://images.example.com/dark_knight_portrait.jpg"
 *     responses:
 *       201:
 *         description: Movie created successfully with auto-generated slug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieResponse'
 *             example:
 *               success: true
 *               message: "Movie created successfully"
 *               data:
 *                 movie_id: 2
 *                 title: "The Dark Knight"
 *                 slug: "the-dark-knight"
 *                 overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
 *                 year: 2008
 *                 duration_minutes: 152
 *                 rating: 9.0
 *                 director: "Christopher Nolan"
 *                 genre: "Action, Crime, Drama"
 *                 cast_list: "Christian Bale, Heath Ledger, Aaron Eckhart"
 *                 trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
 *                 video_url: "https://streaming.example.com/dark-knight"
 *                 poster_landscape: "https://images.example.com/dark_knight_landscape.jpg"
 *                 poster_portrait: "https://images.example.com/dark_knight_portrait.jpg"
 *                 created_at: "2024-12-01T14:30:22.123Z"
 *                 updated_at: "2024-12-01T14:30:22.123Z"
 *               meta:
 *                 slugGenerated: true
 *                 originalTitle: "The Dark Knight"
 *                 generatedSlug: "the-dark-knight"
 *                 createdAt: "2024-12-01T14:30:22.123Z"
 *       400:
 *         description: Validation error with enhanced details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnhancedErrorResponse'
 *             examples:
 *               missingTitle:
 *                 summary: Missing required title field
 *                 value:
 *                   success: false
 *                   message: "Title is required and cannot be empty"
 *                   error:
 *                     type: "validation"
 *                     details:
 *                       field: "title"
 *                       value: null
 *                       requirement: "Title must be a non-empty string"
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *               invalidYear:
 *                 summary: Invalid year format
 *                 value:
 *                   success: false
 *                   message: "Year must be a valid number between 1888 and current year"
 *                   error:
 *                     type: "validation"
 *                     details:
 *                       field: "year"
 *                       value: "invalid"
 *                       requirement: "Year must be integer between 1888-2024"
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', authMiddleware.verifyToken, movieController.handleCreateMovie);

/**
 * @swagger
 * /movies/{identifier}:
 *   get:
 *     summary: Get a movie by ID or slug (Phase 1 Feature)
 *     description: |
 *       Retrieve a single movie using either its numeric ID or URL-friendly slug.
 *       
 *       **Phase 1 Features:**
 *       - Dual access method: ID or slug
 *       - SEO-friendly URLs with slugs
 *       - Enhanced metadata in response
 *       - Automatic slug generation from title
 *       
 *       **Examples:**
 *       - By ID: `/api/movies/123`
 *       - By slug: `/api/movies/the-dark-knight`
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           oneOf:
 *             - type: integer
 *               description: Movie ID (numeric)
 *               example: 123
 *             - type: string
 *               pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
 *               description: Movie slug (URL-friendly)
 *               example: "the-dark-knight"
 *         description: The movie ID (numeric) or slug (URL-friendly string)
 *         examples:
 *           byId:
 *             value: 123
 *             summary: Access movie by numeric ID
 *           bySlug:
 *             value: "the-dark-knight"
 *             summary: Access movie by SEO-friendly slug
 *     responses:
 *       200:
 *         description: Movie retrieved successfully with enhanced metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieResponse'
 *       400:
 *         description: Invalid identifier format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnhancedErrorResponse'
 *             examples:
 *               invalidSlug:
 *                 summary: Invalid slug format
 *                 value:
 *                   success: false
 *                   message: "Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens."
 *                   error:
 *                     type: "validation"
 *                     details:
 *                       identifier: "Invalid-Slug!"
 *                       expectedFormat: "lowercase-with-hyphens"
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnhancedErrorResponse'
 *             examples:
 *               notFoundById:
 *                 summary: Movie not found by ID
 *                 value:
 *                   success: false
 *                   message: "Movie not found with ID: 999"
 *                   error:
 *                     type: "notFound"
 *                     details:
 *                       identifier: "999"
 *                       type: "ID"
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *               notFoundBySlug:
 *                 summary: Movie not found by slug
 *                 value:
 *                   success: false
 *                   message: "Movie not found with slug: non-existent-movie"
 *                   error:
 *                     type: "notFound"
 *                     details:
 *                       identifier: "non-existent-movie"
 *                       type: "slug"
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:identifier', authMiddleware.verifyToken, movieController.handleGetMovieById);

/**
 * @swagger
 * /movies/{id}:
 *   patch:
 *     summary: Update a movie
 *     description: Update an existing movie by its ID. All fields are optional.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the movie to update
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieUpdate'
 *           example:
 *             title: "The Shawshank Redemption - Director's Cut"
 *             duration_minutes: 150
 *             rating: 9.5
 *             overview: "Extended version with additional scenes and director's commentary."
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movie updated successfully."
 *                 affectedRows:
 *                   type: integer
 *                   example: 1
 *             example:
 *               message: "Movie updated successfully."
 *               affectedRows: 1
 *       400:
 *         description: Invalid input data or movie ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 invalidId:
 *                   summary: Invalid movie ID
 *                   value:
 *                     message: "Invalid movie ID format."
 *                 noData:
 *                   summary: No update data provided
 *                   value:
 *                     message: "No data provided for update."
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Movie not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 message: "Failed to update movie."
 *                 error: "Database connection failed"
 */
router.patch('/:id', authMiddleware.verifyToken, movieController.handleUpdateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Remove a movie from the database by its ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the movie to delete
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movie deleted successfully."
 *                 affectedRows:
 *                   type: integer
 *                   example: 1
 *             example:
 *               message: "Movie deleted successfully."
 *               affectedRows: 1
 *       400:
 *         description: Invalid movie ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Invalid movie ID format."
 *       404:
 *         description: Movie not found or already deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Movie not found or already deleted."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 message: "Failed to delete movie."
 *                 error: "Database connection failed"
 */
router.delete('/:id', movieController.handleDeleteMovie);

module.exports = router; // Export the router