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
 *     summary: Upload a single file
 *     description: Upload a single image file to the server
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
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
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
 *                   example: "File uploaded successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FileInfo'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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