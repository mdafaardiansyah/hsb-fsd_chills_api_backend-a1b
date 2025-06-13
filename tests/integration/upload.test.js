const request = require('supertest');
const app = require('../../app');
const { setupTestDatabase, cleanTestDatabase, teardownTestDatabase } = require('../setup/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query } = require('../../src/config/database');
const fs = require('fs');
const path = require('path');

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

describe('Upload API Integration Tests', () => {
  let authToken;
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    full_name: 'Test User'
  };

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

  // Create a test image buffer
  const createTestImageBuffer = () => {
    // Create a simple 1x1 pixel PNG image
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x90, 0x77, 0x53, 0xDE, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, // compressed data
      0x02, 0x00, 0x01, // CRC
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    return pngHeader;
  };

  describe('POST /api/upload', () => {
    test('should upload single image successfully', async () => {
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', createTestImageBuffer(), 'test.png')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File uploaded successfully');
      expect(response.body.data.filename).toBeDefined();
      expect(response.body.data.originalName).toBe('test.png');
      expect(response.body.data.size).toBeDefined();
      expect(response.body.data.url).toBeDefined();
    });

    test('should return error when no file provided', async () => {
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No file uploaded');
    });

    test('should return error for non-image file', async () => {
      const textBuffer = Buffer.from('This is a text file');
      
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', textBuffer, 'test.txt')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContain('Only image files are allowed');
    });

    test('should return error without authentication', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', createTestImageBuffer(), 'test.png')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('POST /api/upload/multiple', () => {
    test('should upload multiple images successfully', async () => {
      const response = await request(app)
        .post('/api/upload/multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('files', createTestImageBuffer(), 'test1.png')
        .attach('files', createTestImageBuffer(), 'test2.png')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Files uploaded successfully');
      expect(response.body.data.files).toHaveLength(2);
      expect(response.body.data.files[0].filename).toBeDefined();
      expect(response.body.data.files[1].filename).toBeDefined();
    });

    test('should return error when no files provided', async () => {
      const response = await request(app)
        .post('/api/upload/multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContain('No files uploaded');
    });

    test('should return error without authentication', async () => {
      const response = await request(app)
        .post('/api/upload/multiple')
        .attach('files', createTestImageBuffer(), 'test.png')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('DELETE /api/upload/:filename', () => {
    let uploadedFilename;

    beforeEach(async () => {
      // Upload a file first
      const uploadResponse = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', createTestImageBuffer(), 'test.png');
      
      uploadedFilename = uploadResponse.body.data.filename;
    });

    test('should delete uploaded file successfully', async () => {
      const response = await request(app)
        .delete(`/api/upload/${uploadedFilename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File deleted successfully');
    });

    test('should return error for non-existent file', async () => {
      const response = await request(app)
        .delete('/api/upload/non-existent-file.png')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('File not found');
    });

    test('should return error without authentication', async () => {
      const response = await request(app)
        .delete(`/api/upload/${uploadedFilename}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });

  // Cleanup uploaded test files
  afterEach(async () => {
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
          if (file !== '.gitkeep') {
            fs.unlinkSync(path.join(uploadsDir, file));
          }
        }
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });
});