require('dotenv').config(); // Load environment variables at the very beginning

const express = require('express'); // Import Express framework
const cors = require('cors');       // Import CORS middleware
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerConfig = require('./src/config/swagger.config');
const movieRoutes = require('./src/routes/movie.routes'); // Import movie routes
const authRoutes = require('./src/routes/auth.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const { query } = require('./src/config/database'); // Import database query function
const errorHandler = require('./src/middleware/errorHandler'); // Import error handler middleware
const timingMiddleware = require('./src/middleware/timing.middleware');
const logger = require('./src/utils/logger'); // Import logger utility

const app = express(); // Create an Express application instance
const PORT = process.env.PORT || 3000; // Define the port from .env or default to 3000

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerConfig);

// Middleware
app.use(cors());  // Enable CORS for all routes and origins
app.use(timingMiddleware.addRequestTiming); // Add request timing for performance tracking
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse incoming requests with URL-encoded payloads

// Swagger Documentation Route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Chills API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
    }
}));

// Basic Route for checking if the server is up
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Chills API',
        version: '2.0.0',
        description: 'A comprehensive movie management API with Phase 1 best practices',
        documentation: '/api/docs',
        endpoints: {
            movies: '/api/movies',
            upload: '/api/upload',
            auth: '/api/auth',
            documentation: '/api/docs'
        },
        phase1Features: [
            'Movie Slug Generation (SEO-friendly URLs)',
            'Smart File Renaming (context-aware naming)',
            'Enhanced Pagination (with metadata)',
            'User-Friendly Error Messages (detailed context)'
        ],
        coreFeatures: [
            'CRUD operations for movies',
            'Dual access (ID and slug)',
            'File upload with smart naming',
            'Input validation with detailed errors',
            'Comprehensive error handling',
            'API documentation with examples',
            'Test coverage'
        ]
    });
});

// Mount the movie routes
// All routes defined in movie.routes.js will be prefixed with /api/movies
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes); // Use auth routes with prefix '/api/auth'
app.use('/api/upload', uploadRoutes); // Use upload routes with prefix '/api/upload'

// Global Error Handler - This should be the last middleware
app.use(errorHandler);



// Only start the server if not in test mode and not being imported
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  // Start the server
  app.listen(PORT, async () => {
    logger.info(`Server is starting on port ${PORT}`);
    try {
      await query('SELECT 1');
      logger.success('✅ Database connection successful');
    } catch (error) {
      logger.error('❌ Database connection failed:', error.message);
    }
    logger.success(`🚀 Chills Movie API is running on http://localhost:${PORT}`);
    logger.info(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
  });
}

// Export app for testing
module.exports = app;