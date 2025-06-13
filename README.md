# Chills Movie API

A comprehensive RESTful API for managing movie data built with Node.js, Express.js, and MySQL. This API provides secure endpoints for movie management, user authentication, and file uploads with advanced features like filtering, searching, and pagination. This Project is part of **Harisenin Bootcamp Fullstack Developer - Backend - Mission Advaced 1B**.

## 🚀 Features

### 🎬 Movie Management
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for movies
- **Advanced Filtering**: Filter movies by genre, director, year
- **Search Functionality**: Search movies by title, overview, cast, and director
- **Sorting**: Sort movies by title, year, rating, duration
- **Pagination**: Efficient pagination with customizable page size

### 🔐 Authentication & Security
- **User Registration**: Secure user account creation with email verification
- **JWT Authentication**: Token-based authentication system
- **Password Security**: Bcrypt password hashing
- **Email Verification**: SMTP-based email verification system
- **Protected Routes**: Middleware-based route protection

### 📁 File Management
- **File Upload**: Single and multiple image file uploads
- **File Validation**: Image-only uploads with size limits (5MB)
- **File Deletion**: Secure file removal functionality
- **Storage Management**: Organized file storage system

### 🛠️ Development & Testing
- **📖 Swagger Documentation**: Interactive OpenAPI 3.0 documentation with Swagger UI
- **🧪 Jest Testing**: Comprehensive unit and integration tests
- **📮 Postman Collection**: Ready-to-use API testing collection
- **MySQL Database**: Robust database integration with connection pooling
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **Environment Configuration**: Secure environment variable management
- **RESTful Design**: Following REST API best practices

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 14.x or higher)
- **npm** (comes with Node.js)
- **MySQL** (version 5.7 or higher)
- **Git** (for cloning the repository)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chills_api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Create MySQL Database

1. Login to your MySQL server:
   ```bash
   mysql -u root -p
   ```

2. Create the database:
   ```sql
   CREATE DATABASE chills_db;
   ```

3. Import the database schema and data:
   ```bash
   mysql -u root -p chills_db < db/chills_db.sql
   ```




### 4. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_DATABASE=chills_db
   DB_PORT=3306
   
   # API Configuration
   API_PORT=3000
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h
   
   # Email Configuration (Gmail SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   
   # Application URL
   APP_URL=http://localhost:3000
   ```

   **Important Notes:**
   - Replace `your_super_secret_jwt_key_here` with a strong, random secret key
   - For Gmail SMTP, use an App Password instead of your regular password
   - Enable 2-factor authentication and generate an App Password in your Google Account settings

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Verify Installation

1. Open your browser or API client (like Postman)
2. Navigate to: `http://localhost:3000`
3. You should see: `{"message": "Welcome to Chills DB Movie API!"}`

## 📚 API Documentation

### 📖 Interactive Swagger Documentation

This API now includes **comprehensive Swagger/OpenAPI 3.0 documentation** with interactive testing capabilities!

#### 🌟 Swagger Features
- **Interactive API Explorer**: Test endpoints directly from the browser
- **Complete API Specification**: Detailed request/response schemas
- **Authentication Documentation**: Security requirements and examples
- **Error Response Examples**: Comprehensive error handling documentation
- **Data Validation**: Input validation rules and constraints
- **Professional UI**: Clean, modern interface powered by Swagger UI

#### 🚀 Access Swagger Documentation

**Live Documentation URL:**
```
http://localhost:3000/api/docs
```

**Features Available:**
- 🔍 **Try It Out**: Execute API calls directly from the documentation
- 📋 **Request Examples**: Pre-filled example requests for all endpoints
- 📊 **Response Schemas**: Detailed response structure documentation
- 🛡️ **Security**: Authentication and authorization documentation
- ⚡ **Real-time Testing**: Instant API testing without external tools

#### 📱 Quick Start with Swagger

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:3000/api/docs
   ```

3. **Explore and test endpoints directly in your browser!**

#### 🎯 Swagger Configuration

The Swagger documentation includes:
- **API Information**: Title, version, description, and contact details
- **Server Configuration**: Development and production server URLs
- **Authentication**: Security schemes and requirements
- **Comprehensive Schemas**: Movie model with all field validations
- **Error Handling**: Standardized error response formats
- **Examples**: Real-world request and response examples

**Traditional Documentation** (Still Available):
> [**API Documentation**](docs/API_DOCUMENTATION.md)
 

### Base URL
```
http://localhost:3000/api
```

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| GET | `/auth/verify-email` | Verify email address | ❌ |

### 🎬 Movie Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/movies` | Get all movies with filtering/search | ✅ |
| GET | `/movies/:id` | Get movie by ID | ✅ |
| POST | `/movies` | Create new movie | ✅ |
| PATCH | `/movies/:id` | Update movie by ID | ✅ |
| DELETE | `/movies/:id` | Delete movie by ID | ✅ |

### 📁 File Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload single image file | ✅ |
| POST | `/upload/multiple` | Upload multiple image files | ✅ |
| DELETE | `/upload/:filename` | Delete uploaded file | ✅ |

### 🔍 Advanced Movie Query Parameters

The `GET /movies` endpoint supports advanced filtering, searching, sorting, and pagination:

**Filtering:**
- `genre` - Filter by movie genre
- `director` - Filter by director name
- `year` - Filter by release year

**Searching:**
- `search` - Search in title, overview, cast, and director

**Sorting:**
- `sortBy` - Sort by: `title`, `year`, `rating`, `duration_minutes`
- `sortOrder` - Sort order: `asc` or `desc`

**Pagination:**
- `limit` - Number of results per page (default: 10)
- `offset` - Number of results to skip
- `page` - Page number (alternative to offset)

**Example:**
```
GET /movies?genre=Action&director=Christopher Nolan&search=Batman&sortBy=rating&sortOrder=desc&limit=5&page=1
```

### Example Requests

#### 🔐 Authentication Examples

**Register User:**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**Login User:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Verify Email:**
```bash
GET http://localhost:3000/api/auth/verify-email?token=your_verification_token
```

#### 🎬 Movie Examples

**Get All Movies (with authentication):**
```bash
GET http://localhost:3000/api/movies
Authorization: Bearer your_jwt_token_here
```

**Get Movies with Filters:**
```bash
GET http://localhost:3000/api/movies?genre=Action&director=Christopher Nolan&search=Batman&sortBy=rating&sortOrder=desc&limit=5&page=1
Authorization: Bearer your_jwt_token_here
```

**Create New Movie:**
```bash
POST http://localhost:3000/api/movies
Content-Type: application/json
Authorization: Bearer your_jwt_token_here

{
  "title": "The Matrix",
  "overview": "A computer hacker learns from mysterious rebels about the true nature of his reality.",
  "year": 1999,
  "duration_minutes": 136,
  "rating": 8.7,
  "director": "The Wachowskis",
  "cast_list": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
  "genre": "Action, Sci-Fi",
  "trailer_url": "https://www.youtube.com/watch?v=vKQi3bBA1y8",
  "poster_landscape": "https://example.com/matrix-landscape.jpg",
  "poster_portrait": "https://example.com/matrix-portrait.jpg"
}
```

**Update Movie:**
```bash
PATCH http://localhost:3000/api/movies/1
Content-Type: application/json
Authorization: Bearer your_jwt_token_here

{
  "rating": 9.0,
  "view_count": 1500
}
```

#### 📁 File Upload Examples

**Upload Single File:**
```bash
POST http://localhost:3000/api/upload
Authorization: Bearer your_jwt_token_here
Content-Type: multipart/form-data

# Form data:
# file: [select image file]
```

**Upload Multiple Files:**
```bash
POST http://localhost:3000/api/upload/multiple
Authorization: Bearer your_jwt_token_here
Content-Type: multipart/form-data

# Form data:
# files: [select multiple image files]
```

**Delete File:**
```bash
DELETE http://localhost:3000/api/upload/filename.jpg
Authorization: Bearer your_jwt_token_here
```

## 🧪 Testing

**Open** for more Testing Docs Information
 
> [**Testing Documentation**](docs/TESTING_DOCUMENTATION.md)

### Testing Environment

- **All Tests Passing**: 86/86 tests across 5 test suites
- **Test Coverage**: Unit tests, integration tests, and validation tests
- **Database Isolation**: Proper test database setup and teardown
- **Clean Exit**: No hanging connections or open handles

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: `tests/unit/` - Testing individual functions and utilities
- **Integration Tests**: `tests/integration/` - Testing API endpoints
- **Test Setup**: `tests/setup/` - Database setup and test helpers

### Test Database Behavior

⚠️ **Important**: Running `npm test` will temporarily create and then **drop** test tables. This is **expected behavior** for test isolation:

1. `beforeAll`: Creates `movies` and `movie_genres` tables
2. `beforeEach`: Cleans data before each test
3. `afterAll`: **Drops tables** after all tests complete

This ensures:
- ✅ Clean test environment
- ✅ No interference between test runs
- ✅ Proper test isolation

### Troubleshooting Tests

**Problem**: Tables disappear after running tests
**Solution**: This is normal behavior. Use separate development/production databases.

**Problem**: Jest hangs or shows "open handle" warnings
**Solution**: Already fixed in current version. Database connections are properly managed.

**Problem**: Tests fail with field validation errors
**Solution**: Ensure you're using the correct field names (`year` not `release_year`, etc.) 

### 📮 Using Postman

**Complete Postman Testing Suite Available!**

1. **Import the Collections:**
   - Main Collection: `api-test/Chills API Complete Test.postman_collection.json`
   - Environment: `api-test/Chills API Environment.postman_environment.json`

2. **Features Included:**
   - ✅ **Authentication Flow**: Register → Login → Get Token
   - ✅ **Movie CRUD Operations**: All movie endpoints with auth
   - ✅ **File Upload Testing**: Single and multiple file uploads
   - ✅ **Advanced Filtering**: Search, sort, and pagination tests
   - ✅ **Automated Testing**: Pre/post-request scripts for token management
   - ✅ **Error Handling**: Tests for various error scenarios

3. **Quick Start:**
   - Import both files into Postman
   - Select "Chills API Environment" as active environment
   - Run "Register User" → "Login User" to get authentication token
   - Token will be automatically saved for subsequent requests
   - Test all endpoints with proper authentication

4. **Environment Variables:**
   - `baseUrl`: API base URL
   - `authToken`: JWT token (auto-populated after login)
   - `testEmail`, `testPassword`, `testUsername`: Test user credentials

### Manual Testing

You can test the API using curl commands:

```bash
# Test server status
curl http://localhost:3000

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all movies (with authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/movies

# Create a movie (with authentication)
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Movie","year":2023,"director":"Test Director"}'
```

## 📁 Project Structure

```
chills_api/
├── src/
│   ├── config/
│   │   ├── database.config.js    # Database configuration
│   │   ├── database.js           # Database connection
│   │   ├── email.config.js       # Email/SMTP configuration
│   │   └── swagger.config.js     # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication route handlers
│   │   ├── movie.controller.js   # Movie route handlers
│   │   └── upload.controller.js  # File upload route handlers
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT authentication middleware
│   │   ├── errorHandler.js       # Global error handling
│   │   └── upload.middleware.js  # File upload middleware
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication API routes
│   │   ├── movie.routes.js       # Movie API routes (with Swagger docs)
│   │   └── upload.routes.js      # File upload API routes
│   ├── services/
│   │   ├── auth.service.js       # Authentication business logic
│   │   ├── email.service.js      # Email service (verification, etc.)
│   │   ├── movie.service.js      # Movie business logic
│   │   ├── upload.service.js     # File upload business logic
│   │   └── user.service.js       # User management business logic
│   └── utils/
│       ├── logger.js             # Logging utility
│       ├── response.js           # Response formatting
│       └── validation.js         # Input validation
├── tests/
│   ├── integration/
│   │   ├── auth.test.js          # Authentication API tests
│   │   ├── movie.test.js         # Movie API integration tests
│   │   ├── movie-features.test.js # Movie filtering/search tests
│   │   └── upload.test.js        # File upload API tests
│   ├── unit/
│   │   ├── logger.test.js        # Logger unit tests
│   │   ├── response.test.js      # Response utility tests
│   │   └── validation.test.js    # Validation unit tests
│   ├── setup/
│   │   ├── database.js           # Test database setup
│   │   ├── helpers.js            # Test helper functions
│   │   └── jest.setup.js         # Jest configuration
│   └── movie.test.js             # Legacy movie tests
├── api-test/
│   ├── Chills API Complete Test.postman_collection.json  # Complete API testing
│   └── Chills API Environment.postman_environment.json   # Postman environment
├── uploads/
│   └── .gitkeep                  # Uploaded files directory
├── db/
│   └── dump-chills_db-202505301405.sql  # Database dump
├── .env.example                  # Environment variables template
├── .env.test                     # Test environment variables
├── .gitignore                    # Git ignore rules
├── jest.config.js                # Jest testing configuration
├── app.js                        # Express application setup
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
**Problem**: `ER_ACCESS_DENIED_ERROR` or connection refused
**Solutions:**
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `.env` file
- Ensure database `chills_db` exists
- For development, try using `root` user with empty password

#### Authentication Issues
**Problem**: "Access denied. No token provided" or "Invalid token"
**Solutions:**
- Ensure you're logged in and have a valid JWT token
- Include Authorization header: `Bearer <your-jwt-token>` (note: single "Bearer" prefix)
- Check token expiration (24 hours by default)
- Verify JWT_SECRET in .env file
- Use Swagger UI "Authorize" button for testing
- **Important**: Avoid duplicate "Bearer" prefix in Authorization header
- All movie endpoints now require authentication (including POST /movies)

#### Email Verification Issues
**Problem**: Email verification not working
**Solutions:**
- Check Gmail SMTP settings in `.env`
- Use App Password instead of regular password
- Enable 2-factor authentication in Google Account
- Verify EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS

#### File Upload Issues
**Problem**: File upload fails or files not found
**Solutions:**
- Ensure `uploads/` directory exists
- Check file size (max 5MB for images)
- Verify file type (only images allowed)
- Check disk space and permissions

#### Test Issues
**Problem**: Tests failing or hanging
**Solutions:**
- Run `npm test` to execute all tests
- Ensure test database is properly configured
- Check that no other processes are using test database
- Clear Jest cache: `npx jest --clearCache`

### Performance Tips
- Use connection pooling for database (already implemented)
- Implement caching for frequently accessed data
- Optimize database queries with proper indexing
- Use pagination for large datasets
- Compress images before uploading

## 📋 Changelog

### Version 2.0.0 (Latest) - Complete Authentication & Upload System

#### 🔐 Authentication System
- **User Registration**: Secure account creation with email verification
- **JWT Authentication**: Token-based authentication system
- **Password Security**: Bcrypt password hashing
- **Email Verification**: SMTP-based email verification
- **Protected Routes**: Middleware-based route protection

#### 📁 File Upload System
- **Single & Multiple Uploads**: Image file upload capabilities
- **File Validation**: Size limits (5MB) and type restrictions
- **File Management**: Upload, retrieve, and delete operations
- **Secure Storage**: Organized file storage with proper permissions

#### 🎬 Enhanced Movie API
- **Advanced Filtering**: Filter by genre, director, year
- **Search Functionality**: Full-text search across multiple fields
- **Sorting Options**: Sort by title, year, rating, duration
- **Pagination**: Efficient data pagination
- **Protected Endpoints**: All movie operations require authentication

#### 🧪 Comprehensive Testing
- **Jest Integration**: Complete unit and integration test suite
- **Authentication Tests**: User registration, login, verification tests
- **Movie Feature Tests**: Filtering, searching, sorting, pagination tests
- **Upload Tests**: File upload and management tests
- **Postman Collection**: Complete API testing collection with environment

#### 🛠️ Technical Improvements
- **Email Service**: SMTP integration for verification emails
- **Middleware Enhancement**: Authentication and upload middleware
- **Error Handling**: Comprehensive error handling across all endpoints
- **Database Schema**: Added users table with proper relationships
- **Environment Configuration**: Extended .env configuration

### Version 1.3.0

#### 🆕 Swagger Documentation
- **📖 Interactive Documentation**: Comprehensive OpenAPI 3.0 documentation
- **🎯 API Testing Interface**: Swagger UI integration at `/api/docs`
- **📋 Complete Specification**: Detailed request/response schemas
- **🛡️ Security Documentation**: Authentication guides and examples
- **⚡ Real-time Testing**: Direct API testing from browser

### Version 1.2.0

#### 🐛 Bug Fixes
- Fixed database field inconsistencies (`year` vs `release_year`)
- Resolved test database connection issues
- Fixed Jest "open handle" warnings
- Corrected validation error messages
- Fixed genre field handling in tests

#### ✨ Improvements
- Enhanced test suite with 86 passing tests
- Improved database connection management
- Better error handling and validation
- Cleaner test environment setup
- Updated documentation with troubleshooting guides

#### 🧪 Testing
- Added comprehensive unit and integration tests
- Implemented proper test database isolation
- Fixed test data consistency issues
- Improved Jest configuration for clean exits

### Version 1.1.0
- Initial API implementation
- Basic CRUD operations
- MySQL database integration
- Postman collection for testing

### Version 1.0.0
- Project initialization
- Basic Express.js setup
- Database configuration

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `DB_HOST` | MySQL host address | localhost |
| `DB_USER` | MySQL username | - |
| `DB_PASSWORD` | MySQL password | - |
| `DB_DATABASE` | MySQL database name | - |
| `DB_PORT` | MySQL port | 3306 |
| `API_PORT` | API server port | 3000 |

### Database Configuration

The database connection uses connection pooling with the following settings:
- **Connection Limit**: 10 concurrent connections
- **Queue Limit**: Unlimited (0)
- **Wait for Connections**: Enabled

---

**Made By Dapuk 🎬**