const request = require('supertest');
const app = require('../../app');
const { setupTestDatabase, cleanTestDatabase, teardownTestDatabase, insertTestMovie } = require('../setup/database');
const { sampleMovies, validateResponseStructure, createMultipleMovies } = require('../setup/helpers');
const db = require('../../src/config/database'); // Import db to close pool after tests
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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



describe('Movie API Integration Tests', () => {
  let authToken;
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    full_name: 'Test User'
  };

  beforeEach(async () => {
    // Create verified user and get token for authentication
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
  describe('GET /api/movies', () => {
    test('should return empty array when no movies exist', async () => {
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(validateResponseStructure(response.body, true)).toBe(true);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.message).toBe('Movies retrieved successfully');
    });

    test('should return all movies when movies exist', async () => {
      // Insert test data
      const testMovie = await insertTestMovie(sampleMovies.valid);

      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(validateResponseStructure(response.body, true)).toBe(true);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe(testMovie.title);
      expect(response.body.data[0].director).toBe(testMovie.director);
      expect(response.body.data[0].release_year).toBe(testMovie.release_year);
      // expect(response.body.data[0].genre).toBe(testMovie.genre); // Genre is no longer a direct field
      expect(parseFloat(response.body.data[0].rating)).toBe(testMovie.rating);
    });

    test('should return multiple movies in correct format', async () => {
      // Insert multiple test movies
      const testMovies = createMultipleMovies(3);
      for (const movie of testMovies) {
        await insertTestMovie(movie);
      }

      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(validateResponseStructure(response.body, true)).toBe(true);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      
      // Verify each movie has required fields
      response.body.data.forEach(movie => {
        expect(movie).toHaveProperty('movie_id');
        expect(movie).toHaveProperty('title');
        expect(movie).toHaveProperty('director');
        expect(movie).toHaveProperty('release_year');
        // expect(movie).toHaveProperty('genre'); // Genre is no longer a direct field
        expect(movie).toHaveProperty('created_at');
        expect(movie).toHaveProperty('updated_at');
      });
    });
  });

  describe('GET /api/movies/:id', () => {
    test('should return movie by valid ID', async () => {
      // Insert test data
      const testMovie = await insertTestMovie(sampleMovies.valid);

      const response = await request(app)
        .get(`/api/movies/${testMovie.movie_id}`)
        .expect(200);

      expect(validateResponseStructure(response.body, true)).toBe(true);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movie_id).toBe(testMovie.movie_id);
      expect(response.body.data.title).toBe(testMovie.title);
      expect(response.body.data.director).toBe(testMovie.director);
      expect(response.body.message).toBe('Movie retrieved successfully');
    });

    test('should return 404 for non-existent movie', async () => {
      const response = await request(app)
        .get('/api/movies/999')
        .expect(404);

      expect(validateResponseStructure(response.body, false)).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Movie not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/movies/invalid')
        .expect(400);

      expect(validateResponseStructure(response.body, false)).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed'); // Updated expected message
    });

    test('should return 400 for negative ID', async () => {
      const response = await request(app)
        .get('/api/movies/-1')
        .expect(400);

      expect(validateResponseStructure(response.body, false)).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed'); // Updated expected message
    });
  });

  describe('POST /api/movies', () => {
    test('should create new movie with valid data', async () => {
      const movieData = sampleMovies.valid;

      const response = await request(app)
        .post('/api/movies')
        .send(movieData)
        .expect(201);

      expect(validateResponseStructure(response.body, true)).toBe(true);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(movieData.title);
      expect(response.body.data.director).toBe(movieData.director);
      expect(response.body.data.release_year).toBe(movieData.year === undefined ? null : movieData.year); // Changed to movieData.year
      // expect(response.body.data.genre).toBe(movieData.genre); // Genre is no longer a direct field
      expect(parseFloat(response.body.data.rating)).toBe(movieData.rating);
      expect(response.body.data).toHaveProperty('movie_id');
      expect(response.body.message).toBe('Movie created successfully');
    });

    test('should create movie without rating', async () => {
      const movieData = sampleMovies.validWithoutRating;

      const response = await request(app)
        .post('/api/movies')
        .send(movieData)
        .expect(201);

      expect(validateResponseStructure(response.body, true)).toBe(true);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(movieData.title);
      expect(response.body.data.rating).toBe("0.0"); // Updated expectation for default rating
    });

    test('should return 400 for missing required fields', async () => {
      const invalidData = sampleMovies.missingFields;

      const response = await request(app)
        .post('/api/movies')
        .send(invalidData)
        .expect(400);

      expect(validateResponseStructure(response.body, false)).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed'); // Updated expectation
    });

    test('should return 400 for invalid year', async () => {
      const invalidData = sampleMovies.invalidYear;

      const response = await request(app)
        .post('/api/movies')
        .send(invalidData)
        .expect(400);

      expect(validateResponseStructure(response.body, false)).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed'); // Updated expectation
    });

    test('should return 400 for invalid rating', async () => {
      const invalidData = sampleMovies.invalidRating;

      const response = await request(app)
        .post('/api/movies')
        .send(invalidData)
        .expect(400);

      expect(validateResponseStructure(response.body, false)).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed'); // Updated expectation
    });

    test('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/movies')
        .send({})
        .expect(400);

      expect(validateResponseStructure(response.body, false)).toBe(true);
      expect(response.body.success).toBe(false);
    });

    test('should trim whitespace from string fields', async () => {
      const movieData = {
        title: '  Trimmed Movie  ',
        director: '  Trimmed Director  ',
        year: 2023,
        genre: '  Action  ',
        rating: 8.5
      };

      const response = await request(app)
        .post('/api/movies')
        .send(movieData)
        .expect(201);

      expect(response.body.data.title).toBe('Trimmed Movie');
      expect(response.body.data.director).toBe('Trimmed Director');
      // expect(response.body.data.genre).toBe('Action'); // Genre is no longer a direct field
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/movies')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should handle unsupported HTTP methods', async () => {
      await request(app)
        .patch('/api/movies')
        .expect(404);
    });
  });

  describe('Response Headers', () => {
    test('should return correct content-type for JSON responses', async () => {
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});