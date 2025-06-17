const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadService = require('../services/upload.service');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @module uploadRoutes
 * @description Defines the API routes for file upload operations.
 * All routes are prefixed with '/api/upload' (defined in the main app file).
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FileInfo:
 *       type: object
 *       properties:
 *         originalName:
 *           type: string
 *           description: Original filename
 *         filename:
 *           type: string
 *           description: Stored filename
 *         mimetype:
 *           type: string
 *           description: File MIME type
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         url:
 *           type: string
 *           description: URL to access the file
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: Upload timestamp
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a single file with smart naming (Phase 1 Feature)
 *     description: |
 *       Upload a single image file to the server with intelligent file naming.
 *       
 *       **Phase 1 Features:**
 *       - Smart file renaming with context awareness
 *       - Automatic timestamp and unique identifier generation
 *       - Context-based naming (movie posters, user avatars, etc.)
 *       - Duplicate file handling with unique suffixes
 *       
 *       **Smart Naming Examples:**
 *       - Movie poster: `movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg`
 *       - User avatar: `user_avatar_456_john-doe_20241201_143022.jpg`
 *       - Generic file: `upload_20241201_143022_abc123.jpg`
 *       
 *       **Context Parameters (optional):**
 *       - `type`: File type context (movie_poster, user_avatar, etc.)
 *       - `movieId`: Associated movie ID for movie-related uploads
 *       - `userId`: Associated user ID for user-related uploads
 *       - `orientation`: For posters (landscape, portrait)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPG, PNG, GIF, WebP)
 *               type:
 *                 type: string
 *                 description: File type context for smart naming
 *                 enum: [movie_poster, user_avatar, general]
 *                 example: movie_poster
 *               movieId:
 *                 type: integer
 *                 description: Movie ID for movie-related uploads
 *                 example: 123
 *               userId:
 *                 type: integer
 *                 description: User ID for user-related uploads
 *                 example: 456
 *               orientation:
 *                 type: string
 *                 description: Poster orientation (for movie posters)
 *                 enum: [landscape, portrait]
 *                 example: landscape
 *             required:
 *               - file
 *           example:
 *             file: "[binary data]"
 *             type: "movie_poster"
 *             movieId: 123
 *             orientation: "landscape"
 *     responses:
 *       200:
 *         description: File uploaded successfully with smart naming
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *             example:
 *               success: true
 *               message: "File uploaded successfully"
 *               data:
 *                 filename: "movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg"
 *                 originalName: "poster.jpg"
 *                 path: "/uploads/movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg"
 *                 size: 245760
 *                 mimetype: "image/jpeg"
 *                 uploadedAt: "2024-12-01T14:30:22.123Z"
 *               meta:
 *                 smartNaming: true
 *                 context:
 *                   type: "movie_poster"
 *                   movieId: 123
 *                   orientation: "landscape"
 *                 namingPattern: "movie_poster_{movieId}_{movieSlug}_{orientation}_{timestamp}"
 *       400:
 *         description: Validation error with enhanced details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnhancedErrorResponse'
 *             examples:
 *               noFile:
 *                 summary: No file uploaded
 *                 value:
 *                   success: false
 *                   message: "No file uploaded. Please select a file to upload."
 *                   error:
 *                     type: "validation"
 *                     details:
 *                       field: "file"
 *                       requirement: "File is required"
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *               invalidFileType:
 *                 summary: Invalid file type
 *                 value:
 *                   success: false
 *                   message: "Please upload only image files (JPG, PNG, GIF, WebP)."
 *                   error:
 *                     type: "validation"
 *                     details:
 *                       field: "file"
 *                       value: "document.pdf"
 *                       allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"]
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *               fileTooLarge:
 *                 summary: File too large
 *                 value:
 *                   success: false
 *                   message: "The file you uploaded is too large. Please choose a file smaller than 5MB."
 *                   error:
 *                     type: "validation"
 *                     details:
 *                       field: "file"
 *                       size: "7340032"
 *                       maxSize: "5242880"
 *                     timestamp: "2024-12-01T14:30:22.123Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', 
  authMiddleware.verifyToken,
  uploadService.uploadSingle('file'),
  uploadController.handleFileUpload
);

/**
 * @swagger
 * /upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     description: Upload multiple image files to the server
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload (max 5 files)
 *     responses:
 *       200:
 *         description: Files uploaded successfully
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
 *                   example: "Files uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FileInfo'
 *                     count:
 *                       type: integer
 *                       description: Number of files uploaded
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/multiple',
  authMiddleware.verifyToken,
  uploadService.uploadMultiple('files', 5),
  uploadController.handleMultipleFileUpload
);

/**
 * @swagger
 * /upload/{filename}:
 *   delete:
 *     summary: Delete an uploaded file
 *     description: Delete a file from the server
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
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
 *                   example: "File deleted successfully"
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:filename',
  authMiddleware.verifyToken,
  uploadController.handleDeleteFile
);

module.exports = router;