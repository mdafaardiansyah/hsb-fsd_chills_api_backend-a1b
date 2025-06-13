const uploadService = require('../services/upload.service');
const response = require('../utils/response');
const logger = require('../utils/logger');

/**
 * @module uploadController
 * @description Controller for handling file upload requests.
 */

/**
 * @function handleFileUpload
 * @description Handles single file upload request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleFileUpload(req, res) {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return response.validationError(res, ['No file uploaded']);
    }
    
    logger.info(`File uploaded: ${req.file.filename}`);
    
    // Get file information
    const fileInfo = uploadService.getFileInfo(req.file, req);
    
    logger.success(`File upload successful: ${fileInfo.filename}`);
    
    return response.success(res, fileInfo, 'File uploaded successfully');
    
  } catch (error) {
    logger.error('Error in handleFileUpload:', error);
    
    if (error.message.includes('Only image files are allowed')) {
      return response.validationError(res, ['Only image files are allowed']);
    }
    
    if (error.message.includes('File too large')) {
      return response.validationError(res, ['File size too large. Maximum size is 5MB']);
    }
    
    return response.error(res, 'Failed to upload file', 500);
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