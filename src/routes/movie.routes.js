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
 *     summary: Get all movies
 *     description: Retrieve a list of all movies in the database
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movies retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *             example:
 *               success: true
 *               message: "Movies retrieved successfully"
 *               data:
 *                 - movie_id: 1
 *                   title: "The Shawshank Redemption"
 *                   overview: "Two imprisoned men bond over a number of years"
 *                   year: 1994
 *                   duration_minutes: 142
 *                   rating: 9.3
 *                   director: "Frank Darabont"
 *                   genre: "Drama"
 *                   cast_list: "Tim Robbins, Morgan Freeman"
 *                   trailer_url: "https://www.youtube.com/watch?v=6hB3S9bIaco"
 *                   video_url: null
 *                   poster_landscape: "https://images.example.com/shawshank_landscape.jpg"
 *                   poster_portrait: "https://images.example.com/shawshank_portrait.jpg"
 *                   created_at: "2024-01-15T10:30:00Z"
 *                   updated_at: "2024-01-15T10:30:00Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authMiddleware.verifyToken, movieController.handleGetAllMovies);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     description: Add a new movie to the database
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
 *             title: "The Godfather"
 *             overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
 *             year: 1972
 *             duration_minutes: 175
 *             rating: 9.2
 *             director: "Francis Ford Coppola"
 *             genre: "Crime, Drama"
 *             cast_list: "Marlon Brando, Al Pacino, James Caan"
 *             trailer_url: "https://www.youtube.com/watch?v=sY1S34973zA"
 *             video_url: "https://streaming.example.com/godfather"
 *             poster_landscape: "https://images.example.com/godfather_landscape.jpg"
 *             poster_portrait: "https://images.example.com/godfather_portrait.jpg"
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *             example:
 *               success: true
 *               message: "Movie created successfully"
 *               data:
 *                 movie_id: 2
 *                 title: "The Godfather"
 *                 overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
 *                 year: 1972
 *                 duration_minutes: 175
 *                 rating: 9.2
 *                 director: "Francis Ford Coppola"
 *                 genre: "Crime, Drama"
 *                 cast_list: "Marlon Brando, Al Pacino, James Caan"
 *                 trailer_url: "https://www.youtube.com/watch?v=sY1S34973zA"
 *                 video_url: "https://streaming.example.com/godfather"
 *                 poster_landscape: "https://images.example.com/godfather_landscape.jpg"
 *                 poster_portrait: "https://images.example.com/godfather_portrait.jpg"
 *                 created_at: "2024-01-15T11:00:00Z"
 *                 updated_at: "2024-01-15T11:00:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', authMiddleware.verifyToken, movieController.handleCreateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a specific movie by its unique identifier
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the movie
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *             example:
 *               success: true
 *               message: "Movie retrieved successfully"
 *               data:
 *                 movie_id: 1
 *                 title: "The Shawshank Redemption"
 *                 overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
 *                 year: 1994
 *                 duration_minutes: 142
 *                 rating: 9.3
 *                 director: "Frank Darabont"
 *                 genre: "Drama"
 *                 cast_list: "Tim Robbins, Morgan Freeman, Bob Gunton"
 *                 trailer_url: "https://www.youtube.com/watch?v=6hB3S9bIaco"
 *                 video_url: "https://streaming.example.com/shawshank"
 *                 poster_landscape: "https://images.example.com/shawshank_landscape.jpg"
 *                 poster_portrait: "https://images.example.com/shawshank_portrait.jpg"
 *                 created_at: "2024-01-15T10:30:00Z"
 *                 updated_at: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Invalid movie ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: "Validation failed"
 *               errors: ["Movie ID must be a positive integer"]
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', movieController.handleGetMovieById);

/**
 * @swagger
 * /movies/{id}:
 *   patch:
 *     summary: Update a movie
 *     description: Update an existing movie by its ID. All fields are optional.
 *     tags: [Movies]
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
router.patch('/:id', movieController.handleUpdateMovie);

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