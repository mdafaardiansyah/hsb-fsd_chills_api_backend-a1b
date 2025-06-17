# 🎬 Chills Movie API

A comprehensive RESTful API for managing movie data built with Node.js, Express.js, and MySQL. This API provides secure endpoints for movie management, user authentication, and file uploads with **Phase 1 Best Practices Implementation** including advanced features like slug generation, smart file naming, enhanced pagination, and user-friendly error messages. This Project is part of **Harisenin Bootcamp Fullstack Developer - Backend - Mission Advanced 1B**.

## 🌟 Phase 1 Best Practices Features

### 🔗 Movie Slug Generation
- **SEO-Friendly URLs**: Automatic slug generation from movie titles
- **Dual Access Method**: Access movies by ID or slug (`/api/movies/123` or `/api/movies/the-dark-knight`)
- **Unique Slug Handling**: Automatic handling of duplicate titles with unique suffixes
- **URL-Safe Format**: Lowercase, hyphenated slugs following web standards

### 📁 Smart File Renaming
- **Context-Aware Naming**: Intelligent file naming based on upload context
- **Timestamp Integration**: Automatic timestamp inclusion for uniqueness
- **Pattern Examples**:
  - Movie poster: `movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg`
  - User avatar: `user_avatar_456_john-doe_20241201_143022.jpg`
  - Generic file: `upload_20241201_143022_abc123.jpg`

### 📊 Enhanced Pagination
- **Rich Metadata**: Comprehensive pagination information
- **Performance Tracking**: Request timing and processing metrics
- **Flexible Parameters**: Customizable page size and sorting options
- **Filter Integration**: Combined filtering, sorting, and pagination

### 🚨 User-Friendly Error Messages
- **Detailed Context**: Enhanced error messages with specific details
- **Validation Guidance**: Clear guidance on fixing validation errors
- **Structured Responses**: Consistent error response format
- **Debug Information**: Helpful debugging context for developers

## 🚀 Core Features

### 🎬 Movie Management
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for movies
- **Advanced Filtering**: Filter movies by genre, director, year
- **Search Functionality**: Search movies by title, overview, cast, and director
- **Sorting**: Sort movies by title, year, rating, duration
- **Slug-Based Access**: Access movies using SEO-friendly slugs

### 🔐 Authentication & Security
- **User Registration**: Secure user account creation with email verification
- **JWT Authentication**: Token-based authentication system
- **Password Security**: Bcrypt password hashing
- **Email Verification**: SMTP-based email verification system
- **Protected Routes**: Middleware-based route protection

### 📁 File Management
- **Smart File Upload**: Context-aware file naming and organization
- **File Validation**: Image-only uploads with size limits (5MB)
- **File Deletion**: Secure file removal functionality
- **Storage Management**: Organized file storage system

### 🛠️ Development & Testing
- **📖 Swagger Documentation**: Interactive OpenAPI 3.0 documentation with Phase 1 examples
- **🧪 Jest Testing**: Comprehensive unit and integration tests
- **📮 Postman Collection**: Ready-to-use API testing collection
- **MySQL Database**: Robust database integration with connection pooling
- **Enhanced Error Handling**: Comprehensive error handling with detailed context
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **Environment Configuration**: Secure environment variable management
- **RESTful Design**: Following REST API best practices

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18.x or higher)
- **npm** (comes with Node.js)
- **MySQL** (version 5.7 or higher)
- **Git** (for cloning the repository)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chills-movie-api.git
cd chills-movie-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Create MySQL Database

```sql
CREATE DATABASE chills_db;
USE chills_db;
```

#### Import Database Schema

```bash
mysql -u your_username -p chills_db < db/chills_db.sql
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=chills_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Email Configuration (for verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 5. Create Upload Directory

```bash
mkdir uploads
```

### 6. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Interactive Documentation
Access the Swagger UI documentation at: `http://localhost:3000/api/docs`

### Phase 1 API Examples

#### Movie Access by Slug
```bash
# Access movie by ID
GET /api/movies/123

# Access movie by slug (Phase 1 feature)
GET /api/movies/the-dark-knight
```

#### Enhanced Pagination
```bash
# Get movies with enhanced pagination
GET /api/movies?page=1&limit=10&sortBy=title&sortOrder=asc&genre=Action

# Response includes rich metadata
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "meta": {
    "requestId": "req_123",
    "processingTime": "45ms",
    "timestamp": "2024-12-01T14:30:22.123Z"
  }
}
```

#### Smart File Upload
```bash
# Upload with context for smart naming
curl -X POST \
  -H "Authorization: Bearer your_jwt_token" \
  -F "file=@poster.jpg" \
  -F "type=movie_poster" \
  -F "movieId=123" \
  -F "orientation=landscape" \
  http://localhost:3000/api/upload

# Results in filename: movie_poster_123_the-dark-knight_landscape_20241201_143022.jpg
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Integration Tests
```bash
npm run test:integration
```

### Test Categories
- **Unit Tests**: Individual function and utility testing
- **Integration Tests**: API endpoint testing
- **Phase 1 Feature Tests**: Slug generation, smart naming, pagination

## 📮 Postman Collection

Import the Postman collection from `api-test/` directory:
- `Chills API Complete Test.postman_collection.json`
- `Chills API Environment.postman_environment.json`

## 🗂️ Project Structure

```
chills-movie-api/
├── src/
│   ├── config/
│   │   ├── database.config.js     # Database configuration
│   │   ├── database.js             # Database connection
│   │   └── swagger.config.js       # API documentation config
│   ├── controllers/
│   │   ├── movie.controller.js     # Movie CRUD operations
│   │   ├── user.controller.js      # User authentication
│   │   └── upload.controller.js    # File upload handling
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT authentication
│   │   ├── errorHandler.js         # Global error handling
│   │   └── timing.middleware.js    # Request timing (Phase 1)
│   ├── routes/
│   │   ├── movie.routes.js         # Movie API routes
│   │   ├── auth.routes.js          # Authentication routes
│   │   └── upload.routes.js        # File upload routes
│   ├── services/
│   │   ├── movie.service.js        # Movie business logic
│   │   ├── user.service.js         # User business logic
│   │   └── upload.service.js       # File upload logic
│   └── utils/
│       ├── slugGenerator.js        # Slug generation (Phase 1)
│       ├── fileNaming.js           # Smart file naming (Phase 1)
│       ├── pagination.js           # Enhanced pagination (Phase 1)
│       ├── errorMessages.js        # User-friendly errors (Phase 1)
│       ├── logger.js               # Logging utility
│       ├── response.js             # Response formatting
│       └── validation.js           # Input validation
├── tests/
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── setup/                      # Test configuration
├── api-test/                       # Postman collections
├── db/                             # Database files
├── uploads/                        # File upload directory
├── PHASE1_IMPLEMENTATION.md        # Phase 1 documentation
└── README.md                       # This file
```

## 🔧 Phase 1 Implementation Details

For detailed information about Phase 1 best practices implementation, see [PHASE1_IMPLEMENTATION.md](./PHASE1_IMPLEMENTATION.md)

### Key Improvements
1. **Movie Slug Generation**: SEO-friendly URLs with automatic slug creation
2. **Smart File Renaming**: Context-aware file naming with timestamps
3. **Enhanced Pagination**: Rich metadata and performance tracking
4. **User-Friendly Error Messages**: Detailed error context and guidance

## 🐛 Bug Fixes & Improvements

### Recent Fixes (v2.0.0)
- ✅ **Database Configuration**: Removed invalid MySQL2 options (`timeout`, `reconnect`)
- ✅ **Logging Consistency**: Replaced `console.error` with `logger.error` throughout codebase
- ✅ **Error Handling**: Improved error handling consistency across controllers
- ✅ **API Versioning**: Updated to v2.0.0 to reflect Phase 1 implementation
- ✅ **Documentation**: Enhanced Swagger documentation with Phase 1 examples

## 🚀 API Endpoints

### Movies
- `GET /api/movies` - Get all movies with enhanced pagination
- `GET /api/movies/:identifier` - Get movie by ID or slug (Phase 1)
- `POST /api/movies` - Create new movie with auto-slug generation
- `PATCH /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification

### File Upload
- `POST /api/upload` - Smart single file upload (Phase 1)
- `POST /api/upload/multiple` - Smart multiple file upload
- `DELETE /api/upload/:filename` - Delete uploaded file

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

### Test Credentials
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "meta": {
    "requestId": "req_123",
    "timestamp": "2024-12-01T14:30:22.123Z",
    "processingTime": "45ms"
  }
}
```

### Error Response (Phase 1 Enhanced)
```json
{
  "success": false,
  "message": "Detailed error description",
  "error": {
    "type": "validation",
    "details": {
      "field": "title",
      "value": null,
      "requirement": "Title must be a non-empty string"
    },
    "timestamp": "2024-12-01T14:30:22.123Z"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Harisenin Bootcamp Student**
- Fullstack Developer - Backend Track
- Mission Advanced 1B: RESTful API with Best Practices

## 🙏 Acknowledgments

- **Harisenin Bootcamp** for the comprehensive curriculum
- **Node.js & Express.js** communities for excellent documentation
- **MySQL** for robust database solutions
- **Swagger/OpenAPI** for API documentation standards

---

**Version**: 2.0.0 (Phase 1 Implementation)  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready with Phase 1 Best Practices