const userService = require('../services/user.service');
const response = require('../utils/response');
const validation = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * @module userController
 * @description Controller for handling user authentication and registration requests.
 */

/**
 * @function handleRegister
 * @description Handles user registration request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleRegister(req, res) {
  try {
    const { fullname, username, email, password } = req.body;
    
    // Validate required fields
    if (!fullname || !username || !email || !password) {
      return response.validationError(res, ['All fields (fullname, username, email, password) are required']);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.validationError(res, ['Invalid email format']);
    }
    
    // Validate password strength
    if (password.length < 6) {
      return response.validationError(res, ['Password must be at least 6 characters long']);
    }
    
    // Validate username format
    if (username.length < 3) {
      return response.validationError(res, ['Username must be at least 3 characters long']);
    }
    
    logger.info(`Registering new user: ${email}`);
    
    // Create user
    const newUser = await userService.createUser({
      fullname: fullname.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password
    });
    
    // Send verification email
    await userService.sendVerificationEmail(newUser.email, newUser.verificationToken);
    
    logger.success(`User registered successfully: ${newUser.email}`);
    
    return response.created(res, {
      userId: newUser.userId,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      isVerified: newUser.isVerified
    }, 'User registered successfully. Please check your email for verification.');
    
  } catch (error) {
    logger.error('Error in handleRegister:', error);
    
    if (error.message.includes('already exists') || error.message.includes('already taken')) {
      return response.validationError(res, [error.message]);
    }
    
    return response.error(res, 'Failed to register user', 500);
  }
}

/**
 * @function handleLogin
 * @description Handles user login request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return response.validationError(res, ['Email and password are required']);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.validationError(res, ['Invalid email format']);
    }
    
    logger.info(`Login attempt for email: ${email}`);
    
    // Authenticate user
    const authResult = await userService.authenticateUser(email.trim().toLowerCase(), password);
    
    logger.success(`User logged in successfully: ${email}`);
    
    return response.success(res, authResult, 'Login successful');
    
  } catch (error) {
    logger.error('Error in handleLogin:', error);
    
    if (error.message.includes('Invalid email or password')) {
      return response.error(res, 'Invalid email or password', 401);
    }
    
    return response.error(res, 'Failed to login', 500);
  }
}

/**
 * @function handleVerifyEmail
 * @description Handles email verification request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleVerifyEmail(req, res) {
  try {
    const { token } = req.query;
    
    if (!token) {
      return response.validationError(res, ['Verification token is required']);
    }
    
    logger.info(`Email verification attempt with token: ${token.substring(0, 8)}...`);
    
    // Verify email token
    await userService.verifyEmailToken(token);
    
    logger.success('Email verified successfully');
    
    return response.success(res, null, 'Email Verified Successfully');
    
  } catch (error) {
    logger.error('Error in handleVerifyEmail:', error);
    
    if (error.message.includes('Invalid Verification Token')) {
      return response.error(res, 'Invalid Verification Token', 400);
    }
    
    return response.error(res, 'Failed to verify email', 500);
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  handleVerifyEmail
};