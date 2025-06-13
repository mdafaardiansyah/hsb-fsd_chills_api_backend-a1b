const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

/**
 * @module uploadService
 * @description Service for handling file uploads using multer.
 */

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info('Created uploads directory');
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, fileName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * @function uploadSingle
 * @description Middleware for uploading a single file.
 * @param {string} fieldName - The name of the form field
 * @returns {Function} Multer middleware function
 */
function uploadSingle(fieldName = 'file') {
  return upload.single(fieldName);
}

/**
 * @function uploadMultiple
 * @description Middleware for uploading multiple files.
 * @param {string} fieldName - The name of the form field
 * @param {number} maxCount - Maximum number of files
 * @returns {Function} Multer middleware function
 */
function uploadMultiple(fieldName = 'files', maxCount = 5) {
  return upload.array(fieldName, maxCount);
}

/**
 * @function getFileUrl
 * @description Generates a URL for accessing uploaded file.
 * @param {string} filename - The filename
 * @param {Object} req - Express request object
 * @returns {string} File URL
 */
function getFileUrl(filename, req) {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${filename}`;
}

/**
 * @function deleteFile
 * @description Deletes a file from the uploads directory.
 * @param {string} filename - The filename to delete
 * @returns {Promise<boolean>} True if file was deleted successfully
 */
async function deleteFile(filename) {
  try {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error deleting file:', error);
    return false;
  }
}

/**
 * @function getFileInfo
 * @description Gets information about an uploaded file.
 * @param {Object} file - Multer file object
 * @param {Object} req - Express request object
 * @returns {Object} File information
 */
function getFileInfo(file, req) {
  return {
    originalName: file.originalname,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    url: getFileUrl(file.filename, req),
    uploadedAt: new Date().toISOString()
  };
}

module.exports = {
  uploadSingle,
  uploadMultiple,
  getFileUrl,
  deleteFile,
  getFileInfo,
  uploadDir
};