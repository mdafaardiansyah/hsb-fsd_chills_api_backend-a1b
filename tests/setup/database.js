const db = require('../../src/config/database');

/**
 * Setup test database
 * Creates movies table if it doesn't exist
 */
const setupTestDatabase = async () => {
  try {
    await db.query('SET FOREIGN_KEY_CHECKS=0;'); // Disable foreign key checks
    // Drop tables if they exist to ensure a fresh schema
    await db.query('DROP TABLE IF EXISTS movie_genres'); // Drop dependent table first
    await db.query('DROP TABLE IF EXISTS movies');
    await db.query('DROP TABLE IF EXISTS users');
    await db.query('SET FOREIGN_KEY_CHECKS=1;'); // Re-enable foreign key checks

    // Create users table for testing
    await db.query(`
      CREATE TABLE users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        verification_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create movies table for testing
    await db.query(`
      CREATE TABLE movies (
        movie_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        overview TEXT,
        year INT,
        duration_minutes INT,
        rating DECIMAL(3,1) DEFAULT 0.0,
        director VARCHAR(255),
        cast_list TEXT,
        trailer_url VARCHAR(255),
        video_url VARCHAR(255),
        poster_landscape VARCHAR(255),
        poster_portrait VARCHAR(255),
        genre VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    // Create movie_genres table
    await db.query(`
      CREATE TABLE IF NOT EXISTS movie_genres (
        movie_id INT,
        genre_id INT,
        PRIMARY KEY (movie_id, genre_id),
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
        /* Assuming a 'genres' table exists for genre_id, or handle genre as a string in movies table */
      );
    `);
    console.log('Test database setup completed');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

/**
 * Clean test database
 * Removes all data from movies and users tables
 */
const cleanTestDatabase = async () => {
  try {
    await db.query('SET FOREIGN_KEY_CHECKS=0;');
    await db.query('DELETE FROM movie_genres');
    await db.query('DELETE FROM movies');
    await db.query('DELETE FROM users');
    await db.query('ALTER TABLE movies AUTO_INCREMENT = 1');
    await db.query('ALTER TABLE users AUTO_INCREMENT = 1');
    // If movie_genres has an auto-increment, reset it too
    // await db.query('ALTER TABLE movie_genres AUTO_INCREMENT = 1'); 
    await db.query('SET FOREIGN_KEY_CHECKS=1;');
  } catch (error) {
    console.error('Error cleaning test database:', error);
    throw error;
  }
};

/**
 * Teardown test database
 * Drops movies and users tables and closes connection
 */
const teardownTestDatabase = async () => {
  try {
    await db.query('SET FOREIGN_KEY_CHECKS=0;'); // Disable foreign key checks
    await db.query('DROP TABLE IF EXISTS movie_genres'); // Drop dependent table first if known
    await db.query('DROP TABLE IF EXISTS movies');
    await db.query('DROP TABLE IF EXISTS users');
    await db.query('SET FOREIGN_KEY_CHECKS=1;'); // Re-enable foreign key checks
    console.log('Test database teardown completed');
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  }
};

/**
 * Insert test movie data
 * @param {Object} movieData - Movie data to insert
 * @returns {Object} Inserted movie with ID
 */
const insertTestMovie = async (movieData) => {
  try {
    const {
      title,
      overview = null,
      release_year = null,
      duration_minutes = null,
      rating = 0.0, // Default rating if not provided
      director = null,
      cast_list = null,
      trailer_url = null,
      video_url = null,
      poster_landscape = null,
      poster_portrait = null,
      genre = null
    } = movieData;

    const result = await db.query(
      'INSERT INTO movies (title, overview, release_year, duration_minutes, rating, director, cast_list, trailer_url, video_url, poster_landscape, poster_portrait, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, overview, release_year, duration_minutes, rating, director, cast_list, trailer_url, video_url, poster_landscape, poster_portrait, genre]
    );
    // Return the full movie data as inserted, including the movie_id
    return { movie_id: result.insertId, title, overview, release_year, duration_minutes, rating, director, cast_list, trailer_url, video_url, poster_landscape, poster_portrait, genre };
  } catch (error) {
    console.error('Error inserting test movie:', error);
    throw error;
  }
};

module.exports = {
  setupTestDatabase,
  cleanTestDatabase,
  teardownTestDatabase,
  insertTestMovie
};