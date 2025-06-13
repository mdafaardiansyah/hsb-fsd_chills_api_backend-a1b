const request = require('supertest');
const app = require('../../app');
const { setupTestDatabase, cleanTestDatabase, teardownTestDatabase } = require('../setup/database');
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

describe('Movie API Advanced Features Tests', () => {
  let authToken;
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    full_name: 'Test User'
  };

  const sampleMovies = [
    {
      title: 'The Shawshank Redemption',
      overview: 'Two imprisoned men bond over a number of years',
      year: 1994,
      duration_minutes: 142,
      rating: 9.3,
      director: 'Frank Darabont',
      genre: 'Drama',
      cast_list: 'Tim Robbins, Morgan Freeman'
    },
    {
      title: 'The Godfather',
      overview: 'The aging patriarch of an organized crime dynasty',
      year: 1972,
      duration_minutes: 175,
      rating: 9.2,
      director: 'Francis Ford Coppola',
      genre: 'Crime, Drama',
      cast_list: 'Marlon Brando, Al Pacino'
    },
    {
      title: 'The Dark Knight',
      overview: 'Batman faces the Joker in Gotham City',
      year: 2008,
      duration_minutes: 152,
      rating: 9.0,
      director: 'Christopher Nolan',
      genre: 'Action, Crime, Drama',
      cast_list: 'Christian Bale, Heath Ledger'
    }
  ];

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

    // Insert sample movies
    for (const movie of sampleMovies) {
      await query(
        'INSERT INTO movies (title, overview, year, duration_minutes, rating, director, genre, cast_list) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [movie.title, movie.overview, movie.year, movie.duration_minutes, movie.rating, movie.director, movie.genre, movie.cast_list]
      );
    }
  });

  describe('Filtering Tests', () => {
    test('should filter movies by genre', async () => {
      const response = await request(app)
        .get('/api/movies?genre=Drama')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach(movie => {
        expect(movie.genre).toContain('Drama');
      });
    });

    test('should filter movies by director', async () => {
      const response = await request(app)
        .get('/api/movies?director=Christopher Nolan')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].director).toBe('Christopher Nolan');
    });

    test('should filter movies by year', async () => {
      const response = await request(app)
        .get('/api/movies?year=2008')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].year).toBe(2008);
    });

    test('should combine multiple filters', async () => {
      const response = await request(app)
        .get('/api/movies?genre=Drama&year=1994')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('The Shawshank Redemption');
    });
  });

  describe('Search Tests', () => {
    test('should search movies by title', async () => {
      const response = await request(app)
        .get('/api/movies?search=Godfather')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toContain('Godfather');
    });

    test('should search movies by director', async () => {
      const response = await request(app)
        .get('/api/movies?search=Nolan')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].director).toContain('Nolan');
    });

    test('should search movies by overview', async () => {
      const response = await request(app)
        .get('/api/movies?search=Batman')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].overview).toContain('Batman');
    });

    test('should return empty array for non-matching search', async () => {
      const response = await request(app)
        .get('/api/movies?search=NonExistentMovie')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe('Sorting Tests', () => {
    test('should sort movies by title ascending', async () => {
      const response = await request(app)
        .get('/api/movies?sortBy=title&sortOrder=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(response.body.data[0].title).toBe('The Dark Knight');
      expect(response.body.data[1].title).toBe('The Godfather');
      expect(response.body.data[2].title).toBe('The Shawshank Redemption');
    });

    test('should sort movies by rating descending', async () => {
      const response = await request(app)
        .get('/api/movies?sortBy=rating&sortOrder=desc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(parseFloat(response.body.data[0].rating)).toBe(9.3);
      expect(parseFloat(response.body.data[1].rating)).toBe(9.2);
      expect(parseFloat(response.body.data[2].rating)).toBe(9.0);
    });

    test('should sort movies by year ascending', async () => {
      const response = await request(app)
        .get('/api/movies?sortBy=year&sortOrder=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(response.body.data[0].year).toBe(1972);
      expect(response.body.data[1].year).toBe(1994);
      expect(response.body.data[2].year).toBe(2008);
    });
  });

  describe('Pagination Tests', () => {
    test('should paginate results with limit', async () => {
      const response = await request(app)
        .get('/api/movies?limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.total).toBe(3);
    });

    test('should paginate results with offset', async () => {
      const response = await request(app)
        .get('/api/movies?limit=2&offset=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.offset).toBe(1);
      expect(response.body.pagination.total).toBe(3);
    });

    test('should paginate results with page number', async () => {
      const response = await request(app)
        .get('/api/movies?limit=2&page=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1); // Last page with 1 item
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.totalPages).toBe(2);
    });
  });

  describe('Combined Features Tests', () => {
    test('should combine search, filter, sort, and pagination', async () => {
      const response = await request(app)
        .get('/api/movies?search=The&genre=Drama&sortBy=year&sortOrder=desc&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toContain('The');
      expect(response.body.data[0].genre).toContain('Drama');
      expect(response.body.pagination.limit).toBe(1);
    });

    test('should return metadata about applied filters', async () => {
      const response = await request(app)
        .get('/api/movies?genre=Drama&director=Frank Darabont&sortBy=rating')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.filters.genre).toBe('Drama');
      expect(response.body.filters.director).toBe('Frank Darabont');
      expect(response.body.sorting.sortBy).toBe('rating');
      expect(response.body.sorting.sortOrder).toBe('desc'); // default
    });
  });

  describe('Authentication Tests', () => {
    test('should return error without authentication token', async () => {
      const response = await request(app)
        .get('/api/movies')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token is required');
    });

    test('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });
});