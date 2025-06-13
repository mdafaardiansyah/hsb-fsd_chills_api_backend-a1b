const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Swagger configuration for Chills API
 * @module swaggerConfig
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chills Movie API',
      version: '1.2.0',
      description: `
        A comprehensive RESTful API for managing movie data in the Chills database.
        
        ## Features
        - Complete CRUD operations for movies
        - Input validation and error handling
        - Comprehensive logging
        - Test coverage with 86 passing tests
        
        ## Authentication
        This API uses JWT (JSON Web Token) authentication for protected endpoints.
        
        ### How to authenticate:
        1. **Register** a new user via \`/auth/register\` endpoint
        2. **Verify** your email via the verification link sent to your email
        3. **Login** via \`/auth/login\` endpoint to get your JWT token
        4. **Use the token** in the Authorization header: \`Bearer <your-jwt-token>\`
        
        ### Test Credentials (Ready to use):
        - **Email:** \`test@example.com\`
        - **Password:** \`password123\`
        
        ### Protected Endpoints:
        - All \`/movies\` endpoints (except GET /movies for listing)
        - All \`/upload\` endpoints
        - Some user management endpoints
        
        ### Public Endpoints:
        - \`GET /movies\` (listing movies with filters)
        - \`POST /auth/register\`
        - \`POST /auth/login\`
        - \`GET /auth/verify-email\`
        
        ## Error Handling
        The API uses standard HTTP status codes and returns consistent error responses:
        - 200: Success
        - 201: Created
        - 400: Bad Request (validation errors)
        - 404: Not Found
        - 500: Internal Server Error
        
        ## Data Validation
        All input data is validated before processing:
        - Required fields: title, director, year, genre
        - Optional fields: overview, duration_minutes, rating, cast_list, trailer_url, video_url, poster_landscape, poster_portrait
        - Year must be between 1900 and current year + 10
        - Rating must be between 0 and 10
        - URLs must be valid format
      `
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.chills.com/api',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization operations'
      },
      {
        name: 'Movies',
        description: 'Movie management operations (some require authentication)'
      },
      {
        name: 'Upload',
        description: 'File upload operations (requires authentication)'
      },
      {
        name: 'Health',
        description: 'API health check endpoints'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from login endpoint'
        }
      },
      schemas: {
        Movie: {
          type: 'object',
          required: ['title', 'director', 'year', 'genre'],
          properties: {
            movie_id: {
              type: 'integer',
              description: 'Unique identifier for the movie',
              example: 1,
              readOnly: true
            },
            title: {
              type: 'string',
              description: 'Title of the movie',
              example: 'The Shawshank Redemption',
              minLength: 1,
              maxLength: 255
            },
            overview: {
              type: 'string',
              description: 'Brief overview or synopsis of the movie',
              example: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
              nullable: true
            },
            year: {
              type: 'integer',
              description: 'Release year of the movie',
              example: 1994,
              minimum: 1900,
              maximum: 2035
            },
            duration_minutes: {
              type: 'integer',
              description: 'Duration of the movie in minutes',
              example: 142,
              minimum: 1,
              nullable: true
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Movie rating (0-10 scale)',
              example: 9.3,
              minimum: 0,
              maximum: 10,
              default: 0.0
            },
            director: {
              type: 'string',
              description: 'Director of the movie',
              example: 'Frank Darabont',
              minLength: 1,
              maxLength: 255
            },
            genre: {
              type: 'string',
              description: 'Genre of the movie',
              example: 'Drama',
              minLength: 1,
              maxLength: 100
            },
            cast_list: {
              type: 'string',
              description: 'Comma-separated list of main cast members',
              example: 'Tim Robbins, Morgan Freeman, Bob Gunton',
              nullable: true
            },
            trailer_url: {
              type: 'string',
              format: 'uri',
              description: 'URL to the movie trailer',
              example: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
              nullable: true
            },
            video_url: {
              type: 'string',
              format: 'uri',
              description: 'URL to the full movie video',
              example: 'https://streaming.example.com/shawshank',
              nullable: true
            },
            poster_landscape: {
              type: 'string',
              format: 'uri',
              description: 'URL to the landscape poster image',
              example: 'https://images.example.com/shawshank_landscape.jpg',
              nullable: true
            },
            poster_portrait: {
              type: 'string',
              format: 'uri',
              description: 'URL to the portrait poster image',
              example: 'https://images.example.com/shawshank_portrait.jpg',
              nullable: true
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the movie was created',
              example: '2024-01-15T10:30:00Z',
              readOnly: true
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the movie was last updated',
              example: '2024-01-15T10:30:00Z',
              readOnly: true
            }
          }
        },
        MovieInput: {
          type: 'object',
          required: ['title', 'director', 'year', 'genre'],
          properties: {
            title: {
              type: 'string',
              description: 'Title of the movie',
              example: 'The Shawshank Redemption',
              minLength: 1,
              maxLength: 255
            },
            overview: {
              type: 'string',
              description: 'Brief overview or synopsis of the movie',
              example: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
              nullable: true
            },
            year: {
              type: 'integer',
              description: 'Release year of the movie',
              example: 1994,
              minimum: 1900,
              maximum: 2035
            },
            duration_minutes: {
              type: 'integer',
              description: 'Duration of the movie in minutes',
              example: 142,
              minimum: 1,
              nullable: true
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Movie rating (0-10 scale)',
              example: 9.3,
              minimum: 0,
              maximum: 10,
              default: 0.0
            },
            director: {
              type: 'string',
              description: 'Director of the movie',
              example: 'Frank Darabont',
              minLength: 1,
              maxLength: 255
            },
            genre: {
              type: 'string',
              description: 'Genre of the movie',
              example: 'Drama',
              minLength: 1,
              maxLength: 100
            },
            cast_list: {
              type: 'string',
              description: 'Comma-separated list of main cast members',
              example: 'Tim Robbins, Morgan Freeman, Bob Gunton',
              nullable: true
            },
            trailer_url: {
              type: 'string',
              format: 'uri',
              description: 'URL to the movie trailer',
              example: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
              nullable: true
            },
            video_url: {
              type: 'string',
              format: 'uri',
              description: 'URL to the full movie video',
              example: 'https://streaming.example.com/shawshank',
              nullable: true
            },
            poster_landscape: {
              type: 'string',
              format: 'uri',
              description: 'URL to the landscape poster image',
              example: 'https://images.example.com/shawshank_landscape.jpg',
              nullable: true
            },
            poster_portrait: {
              type: 'string',
              format: 'uri',
              description: 'URL to the portrait poster image',
              example: 'https://images.example.com/shawshank_portrait.jpg',
              nullable: true
            }
          }
        },
        MovieUpdate: {
          type: 'object',
          description: 'Movie update data - all fields are optional',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the movie',
              example: 'The Shawshank Redemption - Director\'s Cut',
              minLength: 1,
              maxLength: 255
            },
            overview: {
              type: 'string',
              description: 'Brief overview or synopsis of the movie',
              example: 'Updated synopsis with director\'s commentary.',
              nullable: true
            },
            year: {
              type: 'integer',
              description: 'Release year of the movie',
              example: 1994,
              minimum: 1900,
              maximum: 2035
            },
            duration_minutes: {
              type: 'integer',
              description: 'Duration of the movie in minutes',
              example: 150,
              minimum: 1,
              nullable: true
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Movie rating (0-10 scale)',
              example: 9.5,
              minimum: 0,
              maximum: 10
            },
            director: {
              type: 'string',
              description: 'Director of the movie',
              example: 'Frank Darabont',
              minLength: 1,
              maxLength: 255
            },
            genre: {
              type: 'string',
              description: 'Genre of the movie',
              example: 'Drama, Crime',
              minLength: 1,
              maxLength: 100
            },
            cast_list: {
              type: 'string',
              description: 'Comma-separated list of main cast members',
              example: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
              nullable: true
            },
            trailer_url: {
              type: 'string',
              format: 'uri',
              description: 'URL to the movie trailer',
              example: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
              nullable: true
            },
            video_url: {
              type: 'string',
              format: 'uri',
              description: 'URL to the full movie video',
              example: 'https://streaming.example.com/shawshank-directors-cut',
              nullable: true
            },
            poster_landscape: {
              type: 'string',
              format: 'uri',
              description: 'URL to the landscape poster image',
              example: 'https://images.example.com/shawshank_landscape_new.jpg',
              nullable: true
            },
            poster_portrait: {
              type: 'string',
              format: 'uri',
              description: 'URL to the portrait poster image',
              example: 'https://images.example.com/shawshank_portrait_new.jpg',
              nullable: true
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer',
              description: 'Unique identifier for the user',
              example: 1
            },
            fullname: {
              type: 'string',
              description: 'Full name of the user',
              example: 'Test User'
            },
            username: {
              type: 'string',
              description: 'Username of the user',
              example: 'testuser'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
              example: 'test@example.com'
            },
            isVerified: {
              type: 'boolean',
              description: 'Whether the user email is verified',
              example: true
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'test@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'password123',
              minLength: 6
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['fullname', 'username', 'email', 'password'],
          properties: {
            fullname: {
               type: 'string',
               description: 'Full name of the user',
               example: 'Alice Smith',
               minLength: 1
             },
             username: {
               type: 'string',
               description: 'Unique username',
               example: 'alicesmith',
               minLength: 3
             },
            email: {
               type: 'string',
               format: 'email',
               description: 'Email address',
               example: 'alice@gmail.com'
             },
            password: {
               type: 'string',
               description: 'Password (minimum 6 characters)',
               example: 'mypassword456',
               minLength: 6
             }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT authentication token',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data (varies by endpoint)'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            error: {
              type: 'string',
              description: 'Detailed error message',
              example: 'Validation failed'
            }
          }
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: [
                'Title is required and must be a non-empty string',
                'Year must be a valid year between 1900 and 2035'
              ]
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Movie not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Internal server error',
                error: 'Database connection failed'
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './app.js'
  ]
};

module.exports = options;