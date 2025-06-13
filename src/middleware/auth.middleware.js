const userService = require('../services/user.service');
const response = require('../utils/response');
const logger = require('../utils/logger');

/**
 * @module authMiddleware
 * @description Middleware for handling authentication and authorization.
 */

/**
 * @function verifyToken
 * @description Middleware to verify JWT token in request headers.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 */
async function verifyToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.warn('No authorization header provided');
      return response.error(res, 'Access denied. No token provided.', 401);
    }
    
    // Check if header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      logger.warn('Invalid authorization header format');
      return response.error(res, 'Access denied. Invalid token format.', 401);
    }
    
    // Extract token from 'Bearer <token>'
    const token = authHeader.substring(7);
    
    if (!token) {
      logger.warn('No token provided in authorization header');
      return response.error(res, 'Access denied. No token provided.', 401);
    }
    
    // Verify token
    const decoded = await userService.verifyToken(token);
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username
    };
    
    logger.info(`Token verified for user: ${decoded.email}`);
    
    // Continue to next middleware/route handler
    next();
    
  } catch (error) {
    logger.error('Token verification failed:', error);
    
    if (error.message.includes('Invalid or expired token')) {
      return response.error(res, 'Access denied. Invalid or expired token.', 401);
    }
    
    return response.error(res, 'Access denied. Token verification failed.', 401);
  }
}

/**
 * @function optionalAuth
 * @description Optional authentication middleware that doesn't fail if no token is provided.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      req.user = null;
      return next();
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    // Try to verify token
    const decoded = await userService.verifyToken(token);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username
    };
    
    logger.info(`Optional auth - token verified for user: ${decoded.email}`);
    
  } catch (error) {
    // If token is invalid, continue without user info
    logger.warn('Optional auth - invalid token provided:', error.message);
    req.user = null;
  }
  
  next();
}

module.exports = {
  verifyToken,
  optionalAuth
};