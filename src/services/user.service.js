const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * @module userService
 * @description Service layer for user-related database operations and authentication.
 */

// JWT Secret Key - In production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const SALT_ROUNDS = 12;

/**
 * @function createUser
 * @description Creates a new user with encrypted password and verification token.
 * @param {Object} userData - User data object
 * @param {string} userData.fullname - User's full name
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's plain text password
 * @returns {Promise<Object>} Created user data with verification token
 */
async function createUser(userData) {
  const { fullname, username, email, password } = userData;
  
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    throw new Error('Username already taken');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Generate verification token
  const verificationToken = uuidv4();
  
  // Insert user into database
  const result = await db.query(
    `INSERT INTO users (full_name, username, email, password_hash, verification_token, is_verified) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [fullname, username, email, passwordHash, verificationToken, 0]
  );
  
  return {
    userId: result.insertId,
    fullname,
    username,
    email,
    verificationToken,
    isVerified: false
  };
}

/**
 * @function authenticateUser
 * @description Authenticates user with email and password.
 * @param {string} email - User's email
 * @param {string} password - User's plain text password
 * @returns {Promise<Object>} User data with JWT token
 */
async function authenticateUser(email, password) {
  // Get user by email
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.user_id, 
      email: user.email, 
      username: user.username 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    user: {
      userId: user.user_id,
      fullname: user.full_name,
      username: user.username,
      email: user.email,
      isVerified: user.is_verified
    },
    token
  };
}

/**
 * @function getUserByEmail
 * @description Retrieves user by email.
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function getUserByEmail(email) {
  const rows = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

/**
 * @function getUserByUsername
 * @description Retrieves user by username.
 * @param {string} username - User's username
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function getUserByUsername(username) {
  const rows = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0] || null;
}

/**
 * @function verifyEmailToken
 * @description Verifies email using verification token.
 * @param {string} token - Verification token
 * @returns {Promise<boolean>} True if verification successful
 */
async function verifyEmailToken(token) {
  // Find user by verification token
  const rows = await db.query(
    'SELECT * FROM users WHERE verification_token = ?',
    [token]
  );
  
  const user = rows[0];
  if (!user) {
    throw new Error('Invalid Verification Token');
  }
  
  // Update user as verified
  await db.query(
    'UPDATE users SET is_verified = 1, verification_token = NULL WHERE user_id = ?',
    [user.user_id]
  );
  
  return true;
}

/**
 * @function sendVerificationEmail
 * @description Sends verification email to user.
 * @param {string} email - User's email
 * @param {string} verificationToken - Verification token
 * @returns {Promise<boolean>} True if email sent successfully
 */
async function sendVerificationEmail(email, verificationToken) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Chills Movie App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Chills Movie App!</h2>
        <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
        <p style="color: #666; font-size: 14px;">If you didn't create an account with us, please ignore this email.</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    logger.success(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * @function verifyToken
 * @description Verifies JWT token and returns user data.
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Decoded token data
 */
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = {
  createUser,
  authenticateUser,
  getUserByEmail,
  getUserByUsername,
  verifyEmailToken,
  sendVerificationEmail,
  verifyToken
};