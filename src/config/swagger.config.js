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
      version: '2.0.0',
      description: `
        A comprehensive RESTful API for managing movie data in the Chills database with Phase 1 Best Practices implemented.
        
        ## 🚀 Phase 1 Features (NEW!)
        - **Movie Slug Generation**: URL-friendly identifiers for SEO optimization
        - **Smart File Renaming**: Context-aware file naming with metadata
        - **Enhanced Pagination**: Comprehensive pagination with navigation links
        - **User-Friendly Error Messages**: Clear, actionable error responses
        
        ## 🎯 Core Features
        - Complete CRUD operations for movies
        - Dual access: ID and slug-based routing
        - Input validation and error handling
        - Smart file upload with context
        - Comprehensive logging and performance tracking
        - Test coverage with 86 passing tests
        
        ## 🔗 Movie Access Methods
        
        ### Traditional ID Access:
        \`GET /api/movies/123\`
        
        ### New Slug Access (SEO-friendly):
        \`GET /api/movies/the-dark-knight\`
        
        ### Enhanced Pagination:
        \`GET /api/movies?page=2&limit=10&genre=action\`
        
        ## 📁 Smart File Upload
        Upload files with context for automatic smart naming:
        - Movie posters: \`movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg\`
        - User avatars: \`user_avatar_456_john-doe_20241201_143022.jpg\`
        
        ## 🔐 Authentication
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
        - \`GET /movies\` (listing movies with filters and pagination)
        - \`GET /movies/:identifier\` (access by ID or slug)
        - \`POST /auth/register\`
        - \`POST /auth/login\`
        - \`GET /auth/verify-email\`
        
        ## ❌ Enhanced Error Handling
        The API provides user-friendly error messages with detailed context:
        - **Validation errors**: Field-specific validation messages
        - **Not found errors**: Clear resource identification
        - **Database errors**: User-friendly database error translation
        - **File upload errors**: Detailed upload error context
        
        ### Error Response Structure:
        \`\`\`json
        {
          "success": false,
          "message": "Movie not found with slug: the-dark-knight-2",
          "error": {
            "type": "notFound",
            "details": {
              "identifier": "the-dark-knight-2",
              "type": "slug"
            },
            "timestamp": "2024-12-01T14:30:22.123Z"
          }
        }
        \`\`\`
        
        ## 📄 Enhanced Pagination
        All list endpoints now include comprehensive pagination metadata:
        - Navigation links (first, previous, next, last)
        - User-friendly summary text
        - Performance metrics
        - Total items and page information
        
        ## 🔧 Data Validation
        All input data is validated before processing:
        - Required fields: title, director, year, genre
        - Optional fields: overview, duration_minutes, rating, cast_list, trailer_url, video_url, poster_landscape, poster_portrait
        - Auto-generated: slug (from title), timestamps
        - Year must be between 1900 and current year + 10
        - Rating must be between 0 and 10
        - URLs must be valid format
        - Slugs are automatically generated and validated for uniqueness
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
            slug: {
              type: 'string',
              description: 'URL-friendly identifier for the movie',
              example: 'the-shawshank-redemption',
              pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
              readOnly: true
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
        },
        EnhancedErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Movie not found with slug: the-dark-knight-2'
            },
            error: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  example: 'notFound'
                },
                details: {
                  type: 'object',
                  example: {
                    identifier: 'the-dark-knight-2',
                    type: 'slug'
                  }
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-12-01T14:30:22.123Z'
                }
              }
            }
          }
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              example: 2
            },
            totalPages: {
              type: 'integer',
              example: 10
            },
            totalItems: {
              type: 'integer',
              example: 95
            },
            limit: {
              type: 'integer',
              example: 10
            },
            hasNextPage: {
              type: 'boolean',
              example: true
            },
            hasPreviousPage: {
              type: 'boolean',
              example: true
            },
            startItem: {
              type: 'integer',
              example: 11
            },
            endItem: {
              type: 'integer',
              example: 20
            },
            links: {
              type: 'object',
              properties: {
                first: {
                  type: 'string',
                  example: '/api/movies?page=1&limit=10'
                },
                previous: {
                  type: 'string',
                  example: '/api/movies?page=1&limit=10'
                },
                next: {
                  type: 'string',
                  example: '/api/movies?page=3&limit=10'
                },
                last: {
                  type: 'string',
                  example: '/api/movies?page=10&limit=10'
                }
              }
            }
          }
        },
        MovieListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Movies retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                movies: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Movie'
                  }
                },
                pagination: {
                  $ref: '#/components/schemas/PaginationMeta'
                },
                summary: {
                  type: 'string',
                  example: 'Showing 11-20 of 95 movies (page 2 of 10)'
                },
                filters: {
                  type: 'object',
                  example: {
                    genre: 'action',
                    year: null,
                    director: null
                  }
                },
                sorting: {
                  type: 'object',
                  example: {
                    field: 'title',
                    order: 'asc'
                  }
                },
                meta: {
                  type: 'object',
                  properties: {
                    totalItems: {
                      type: 'integer',
                      example: 95
                    },
                    requestedAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-12-01T14:30:22.123Z'
                    },
                    processingTime: {
                      type: 'string',
                      example: '45ms'
                    }
                  }
                }
              }
            }
          }
        },
        MovieResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Movie retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                movie: {
                  $ref: '#/components/schemas/Movie'
                },
                meta: {
                  type: 'object',
                  properties: {
                    accessedBy: {
                      type: 'string',
                      example: 'slug'
                    },
                    identifier: {
                      type: 'string',
                      example: 'the-dark-knight'
                    },
                    retrievedAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-12-01T14:30:22.123Z'
                    }
                  }
                }
              }
            }
          }
        },
        FileUploadResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'File uploaded successfully'
            },
            data: {
              type: 'object',
              properties: {
                file: {
                  type: 'object',
                  properties: {
                    originalName: {
                      type: 'string',
                      example: 'poster.jpg'
                    },
                    smartFilename: {
                      type: 'string',
                      example: 'movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg'
                    },
                    size: {
                      type: 'integer',
                      example: 1024576
                    },
                    mimetype: {
                      type: 'string',
                      example: 'image/jpeg'
                    },
                    path: {
                      type: 'string',
                      example: '/uploads/movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg'
                    }
                  }
                },
                context: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      example: 'movie_poster'
                    },
                    movieId: {
                      type: 'string',
                      example: '123'
                    },
                    movieTitle: {
                      type: 'string',
                      example: 'The Dark Knight'
                    },
                    category: {
                      type: 'string',
                      example: 'landscape'
                    }
                  }
                },
                uploadedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-12-01T14:30:22.123Z'
                }
              }
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