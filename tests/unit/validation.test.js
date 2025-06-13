const validation = require('../../src/utils/validation');

describe('Validation Utils Unit Tests', () => {
  describe('isNonEmptyString', () => {
    it('should return true for valid non-empty strings', () => {
      expect(validation.isNonEmptyString('hello')).toBe(true);
      expect(validation.isNonEmptyString('test string')).toBe(true);
      expect(validation.isNonEmptyString('123')).toBe(true);
    });

    it('should return false for empty or invalid strings', () => {
      expect(validation.isNonEmptyString('')).toBe(false);
      expect(validation.isNonEmptyString('   ')).toBe(false);
      expect(validation.isNonEmptyString(null)).toBe(false);
      expect(validation.isNonEmptyString(undefined)).toBe(false);
      expect(validation.isNonEmptyString(123)).toBe(false);
      expect(validation.isNonEmptyString({})).toBe(false);
    });
  });

  describe('isPositiveInteger', () => {
    it('should return true for positive integers', () => {
      expect(validation.isPositiveInteger(1)).toBe(true);
      expect(validation.isPositiveInteger(100)).toBe(true);
      expect(validation.isPositiveInteger(999999)).toBe(true);
    });

    it('should return false for invalid inputs', () => {
      expect(validation.isPositiveInteger(0)).toBe(false);
      expect(validation.isPositiveInteger(-1)).toBe(false);
      expect(validation.isPositiveInteger(1.5)).toBe(false);
      expect(validation.isPositiveInteger('1')).toBe(false);
      expect(validation.isPositiveInteger(null)).toBe(false);
      expect(validation.isPositiveInteger(undefined)).toBe(false);
      expect(validation.isPositiveInteger({})).toBe(false);
    });
  });

  describe('isValidYear', () => {
    it('should return true for valid years', () => {
      const currentYear = new Date().getFullYear();
      expect(validation.isValidYear(2000)).toBe(true);
      expect(validation.isValidYear(currentYear)).toBe(true);
      expect(validation.isValidYear(1900)).toBe(true);
    });

    it('should return false for invalid years', () => {
      const currentYear = new Date().getFullYear();
      expect(validation.isValidYear(1899)).toBe(false);
      expect(validation.isValidYear(currentYear + 11)).toBe(false);
      expect(validation.isValidYear('2000')).toBe(false);
      expect(validation.isValidYear(null)).toBe(false);
      expect(validation.isValidYear(undefined)).toBe(false);
    });
  });

  describe('isValidRating', () => {
    it('should return true for valid ratings', () => {
      expect(validation.isValidRating(0)).toBe(true);
      expect(validation.isValidRating(5.5)).toBe(true);
      expect(validation.isValidRating(10)).toBe(true);
    });

    it('should return false for invalid ratings', () => {
      expect(validation.isValidRating(-1)).toBe(false);
      expect(validation.isValidRating(11)).toBe(false);
      expect(validation.isValidRating('5')).toBe(false);
      expect(validation.isValidRating(null)).toBe(false);
      expect(validation.isValidRating(undefined)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(validation.isValidUrl('https://example.com')).toBe(true);
      expect(validation.isValidUrl('http://test.org')).toBe(true);
      expect(validation.isValidUrl('https://www.google.com/search?q=test')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(validation.isValidUrl('not-a-url')).toBe(false);
      expect(validation.isValidUrl('invalid-url')).toBe(false);
      expect(validation.isValidUrl('')).toBe(false);
      expect(validation.isValidUrl(null)).toBe(false);
      expect(validation.isValidUrl(undefined)).toBe(false);
      expect(validation.isValidUrl(123)).toBe(false);
    });
  });

  describe('validateMovieData', () => {
    it('should return valid for correct movie data', () => {
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        year: 2023,
        genre: 'Test Genre',
        release_year: 2023,
        duration_minutes: 120,
        rating: 8.5
      };
      const result = validation.validateMovieData(movieData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for missing title', () => {
      const movieData = {};
      const result = validation.validateMovieData(movieData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required and must be a non-empty string');
    });

    it('should return invalid for invalid year', () => {
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        year: 1800, // Invalid year
        genre: 'Test Genre'
      };
      const result = validation.validateMovieData(movieData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Year must be a valid year between 1900 and ' + (new Date().getFullYear() + 10)))).toBe(true);
    });

    it('should return invalid for invalid duration', () => {
      const movieData = {
        title: 'Test Movie',
        duration_minutes: -10
      };
      const result = validation.validateMovieData(movieData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Duration must be a positive integer');
    });

    it('should return invalid for invalid rating', () => {
      const movieData = {
        title: 'Test Movie',
        rating: 15
      };
      const result = validation.validateMovieData(movieData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Rating must be a number between 0 and 10');
    });

    it('should return invalid for invalid URLs', () => {
      const movieData = {
        title: 'Test Movie',
        trailer_url: 'invalid-url'
      };
      const result = validation.validateMovieData(movieData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Trailer URL must be a valid URL');
    });
  });

  describe('validateMovieId', () => {
    it('should return valid for positive integer IDs', () => {
      const result = validation.validateMovieId('123');
      expect(result.isValid).toBe(true);
      expect(result.id).toBe(123);
    });

    it('should return valid for numeric IDs', () => {
      const result = validation.validateMovieId(456);
      expect(result.isValid).toBe(true);
      expect(result.id).toBe(456);
    });

    it('should return invalid for non-numeric IDs', () => {
      const result = validation.validateMovieId('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Movie ID must be a positive integer');
    });

    it('should return invalid for negative IDs', () => {
      const result = validation.validateMovieId('-1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Movie ID must be a positive integer');
    });

    it('should return invalid for zero ID', () => {
      const result = validation.validateMovieId('0');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Movie ID must be a positive integer');
    });
  });
});