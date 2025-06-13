// Load environment variables from appropriate .env file based on NODE_ENV
require('dotenv').config({ 
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' 
});

/**
 * @module dbConfig
 * @description Database configuration object.
 * It reads database connection parameters from environment variables.
 */
const dbConfig = {
  host: process.env.DB_HOST,          // Database host address
  user: process.env.DB_USER,          // Database username
  password: process.env.DB_PASSWORD,  // Database password
  database: process.env.DB_DATABASE,  // Database name
  port: parseInt(process.env.DB_PORT, 10) || 3306, // Database port, defaults to 3306
  waitForConnections: true,        // Whether the pool should wait for connections to become available if all are busy
  connectionLimit: 10,             // Maximum number of connections to create at once
  queueLimit: 0,                   // Maximum number of connection requests the pool will queue before returning an error (0 means no limit)
  acquireTimeout: 60000,           // The milliseconds before a timeout occurs during the connection acquisition
  timeout: 60000,                  // The milliseconds before a timeout occurs during the connection
  reconnect: true,                 // Reconnect when connection is lost
  idleTimeout: 300000              // Close connections after 5 minutes of inactivity
};

module.exports = dbConfig; // Export the configuration object