const request = require('supertest');
const app = require('../../app');
const { setupTestDatabase, cleanTestDatabase, teardownTestDatabase } = require('../setup/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../../src/config/database');

// Setup dan cleanup database untuk testing
beforeAll(async () => {
  await setupTestDatabase();
});

beforeEach(async () => {
  await cleanTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});

describe('Authentication API Integration Tests', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    full_name: 'Test User'
  };

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully. Please check your email for verification.');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.user.password_hash).toBeUndefined();
    });

    test('should return error for duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    test('should return error for invalid email format', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email format');
    });

    test('should return error for missing required fields', async () => {
      const incompleteUser = { email: testUser.email };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a verified user for login tests
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      await query(
        'INSERT INTO users (username, email, password_hash, full_name, is_verified) VALUES (?, ?, ?, ?, ?)',
        [testUser.username, testUser.email, hashedPassword, testUser.full_name, 1]
      );
    });

    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.password_hash).toBeUndefined();
    });

    test('should return error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should return error for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should return error for unverified user', async () => {
      // Create unverified user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await query(
        'INSERT INTO users (username, email, password_hash, full_name, is_verified) VALUES (?, ?, ?, ?, ?)',
        ['unverified', 'unverified@example.com', hashedPassword, 'Unverified User', 0]
      );

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unverified@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please verify your email before logging in');
    });
  });

  describe('GET /api/auth/verify-email', () => {
    test('should verify email with valid token', async () => {
      // Create user with verification token
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      const verificationToken = 'test-verification-token';
      
      await query(
        'INSERT INTO users (username, email, password_hash, full_name, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
        [testUser.username, testUser.email, hashedPassword, testUser.full_name, verificationToken, 0]
      );

      const response = await request(app)
        .get(`/api/auth/verify-email?token=${verificationToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Email verified successfully');
    });

    test('should return error for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email?token=invalid-token')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired verification token');
    });

    test('should return error for missing token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Verification token is required');
    });
  });

  describe('Protected Routes', () => {
    let authToken;

    beforeEach(async () => {
      // Create verified user and get token
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      const result = await query(
        'INSERT INTO users (username, email, password_hash, full_name, is_verified) VALUES (?, ?, ?, ?, ?)',
        [testUser.username, testUser.email, hashedPassword, testUser.full_name, 1]
      );

      authToken = jwt.sign(
        { userId: result.insertId, email: testUser.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
    });

    test('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should return error for missing token', async () => {
      const response = await request(app)
        .get('/api/movies')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token is required');
    });

    test('should return error for invalid token', async () => {
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });
});