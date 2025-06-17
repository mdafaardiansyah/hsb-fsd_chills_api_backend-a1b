const uploadService = require('../services/upload.service');
const response = require('../utils/response');
const fileNaming = require('../utils/fileNaming');
const errorMessages = require('../utils/errorMessages');
const logger = require('../utils/logger');

/**
 * @module uploadController
 * @description Controller for handling file upload requests.
 */

/**
 * @function handleFileUpload
 * @description Handles single file upload with smart file naming
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleFileUpload(req, res) {
    try {
        // Check if file was uploaded
        if (!req.file) {
            const errorResponse = errorMessages.createErrorResponse('validation', 
                'No file uploaded', {
                    field: 'file',
                    operation: 'fileUpload'
                }
            );
            return response.validationError(res, errorResponse.message, errorResponse.details);
        }

        // Extract context from request body or query
        const context = {
            type: req.body.type || req.query.type || 'general',
            movieId: req.body.movieId || req.query.movieId,
            movieTitle: req.body.movieTitle || req.query.movieTitle,
            userId: req.user?.id || req.body.userId || req.query.userId,
            category: req.body.category || req.query.category
        };

        // Generate smart filename
        const originalExtension = req.file.originalname.split('.').pop();
        const smartFilename = fileNaming.generateSmartFilename({
            originalName: req.file.originalname,
            extension: originalExtension,
            context
        });

        // Get file information with enhanced metadata
        const fileInfo = {
            ...uploadService.getFileInfo(req.file),
            smartFilename,
            context,
            metadata: {
                uploadedAt: new Date().toISOString(),
                originalName: req.file.originalname,
                smartNaming: fileNaming.isSmartFilename(smartFilename),
                parsedContext: fileNaming.parseSmartFilename(smartFilename)
            }
        };
        
        logger.info('File uploaded successfully:', {
            originalName: req.file.originalname,
            smartFilename,
            size: req.file.size,
            type: req.file.mimetype
        });
        
        response.success(res, 'File uploaded successfully', fileInfo);
        
    } catch (error) {
        logger.error('Upload error:', error);
        
        // Handle specific upload errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            const errorResponse = errorMessages.createErrorResponse('fileUpload', 
                'File size exceeds the maximum allowed limit', {
                    maxSize: '5MB',
                    actualSize: req.file?.size
                }
            );
            return response.validationError(res, errorResponse.message, errorResponse.details);
        }
        
        if (error.code === 'INVALID_FILE_TYPE') {
            const errorResponse = errorMessages.createErrorResponse('fileUpload', 
                'Invalid file type. Only image files are allowed', {
                    allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                    receivedType: req.file?.mimetype
                }
            );
            return response.validationError(res, errorResponse.message, errorResponse.details);
        }
        
        const errorResponse = errorMessages.createErrorResponse('fileUpload', error.message, {
            operation: 'fileUpload',
            filename: req.file?.originalname
        });
        
        response.error(res, errorResponse.message, errorResponse.statusCode, errorResponse.details);
    }
}

/**
 * @function handleMultipleFileUpload
 * @description Handles multiple file upload request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleMultipleFileUpload(req, res) {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return response.validationError(res, ['No files uploaded']);
    }
    
    logger.info(`${req.files.length} files uploaded`);
    
    // Get file information for all uploaded files
    const filesInfo = req.files.map(file => uploadService.getFileInfo(file, req));
    
    logger.success(`Multiple file upload successful: ${req.files.length} files`);
    
    return response.success(res, {
      files: filesInfo,
      count: filesInfo.length
    }, 'Files uploaded successfully');
    
  } catch (error) {
    logger.error('Error in handleMultipleFileUpload:', error);
    
    if (error.message.includes('Only image files are allowed')) {
      return response.validationError(res, ['Only image files are allowed']);
    }
    
    if (error.message.includes('File too large')) {
      return response.validationError(res, ['One or more files are too large. Maximum size is 5MB per file']);
    }
    
    return response.error(res, 'Failed to upload files', 500);
  }
}

/**
 * @function handleDeleteFile
 * @description Handles file deletion request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleDeleteFile(req, res) {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return response.validationError(res, ['Filename is required']);
    }
    
    logger.info(`Attempting to delete file: ${filename}`);
    
    const deleted = await uploadService.deleteFile(filename);
    
    if (deleted) {
      logger.success(`File deleted successfully: ${filename}`);
      return response.success(res, null, 'File deleted successfully');
    } else {
      return response.notFound(res, 'File not found');
    }
    
  } catch (error) {
    logger.error('Error in handleDeleteFile:', error);
    return response.error(res, 'Failed to delete file', 500);
  }
}

module.exports = {
  handleFileUpload,
  handleMultipleFileUpload,
  handleDeleteFile
};