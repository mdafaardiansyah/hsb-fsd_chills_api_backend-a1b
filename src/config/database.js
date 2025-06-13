const mysql = require('mysql2/promise'); // Import the mysql2 library with promise support
const dbConfig = require('./database.config');   // Import the database configuration

/**
 * @module db
 * @description Manages the MySQL database connection pool.
 */

/**
 * Database connection pool.
 * Using mysql2/promise allows us to use async/await with database queries.
 * @type {mysql.Pool}
 */
const pool = mysql.createPool(dbConfig);

/**
 * @function query
 * @description Executes a SQL query using a connection from the pool.
 * @param {string} sql - The SQL query string.
 * @param {Array} [params] - Optional array of parameters to be used with prepared statements.
 * @returns {Promise<Array>} A promise that resolves with the query results.
 * @throws {Error} If the query fails.
 */
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params); // Get a connection from the pool and execute the query
    return results; // Return the results of the query
  } catch (error) {
    console.error('Database Query Error:', error); // Log the full error object
    // In a real application, you might want to throw a custom error or handle it differently
    throw error; // Re-throw the original error to preserve stack trace and details
  }
}

module.exports = {
  query, // Export the query function
  pool // Export the pool itself to allow closing it
};