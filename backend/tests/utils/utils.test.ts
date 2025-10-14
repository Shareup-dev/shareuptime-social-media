import { 
  isValidEmail, 
  isValidUsername, 
  sanitizeInput, 
  createResponse,
  createPaginatedResponse 
} from '../../src/utils';

describe('Utility Functions', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@example.com',
        'email@123.123.123.123',
        '1234567890@example.com'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@.com',
        '',
        'test@example',
        'test @example.com'
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidUsername', () => {
    it('should validate correct usernames', () => {
      const validUsernames = [
        'username',
        'user123',
        'user_name',
        'testuser',
        'a'.repeat(20), // 20 characters
        'user1'
      ];

      validUsernames.forEach(username => {
        expect(isValidUsername(username)).toBe(true);
      });
    });

    it('should reject invalid usernames', () => {
      const invalidUsernames = [
        'us', // too short
        'a'.repeat(31), // too long
        'user name', // contains space
        'user@name', // contains @
        'user#name', // contains #
        'user-name', // contains dash
        '', // empty
        'user.name' // contains dot
      ];

      invalidUsernames.forEach(username => {
        expect(isValidUsername(username)).toBe(false);
      });
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const testCases = [
        { input: '<script>alert("xss")</script>', expected: 'scriptalert("xss")/script' },
        { input: 'Hello > World', expected: 'Hello  World' },
        { input: 'Normal text', expected: 'Normal text' },
        { input: '  spaced text  ', expected: 'spaced text' },
        { input: '<>><><', expected: '' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(sanitizeInput(input)).toBe(expected);
      });
    });

    it('should handle empty and null inputs', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  describe('createResponse', () => {
    it('should create success response', () => {
      const response = createResponse(true, 'Success message', { id: 1 });

      expect(response).toEqual({
        success: true,
        message: 'Success message',
        data: { id: 1 }
      });
    });

    it('should create error response', () => {
      const response = createResponse(false, 'Error message', undefined, 'Detailed error');

      expect(response).toEqual({
        success: false,
        message: 'Error message',
        error: 'Detailed error'
      });
    });

    it('should handle response without data', () => {
      const response = createResponse(true, 'Success message');

      expect(response).toEqual({
        success: true,
        message: 'Success message'
      });
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const response = createPaginatedResponse(data, 1, 10, 25, 'Items retrieved');

      expect(response).toEqual({
        success: true,
        message: 'Items retrieved',
        data: data,
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3
        }
      });
    });

    it('should calculate total pages correctly', () => {
      const data = [{ id: 1 }];
      const response = createPaginatedResponse(data, 1, 5, 12, 'Items retrieved');

      expect(response.pagination.totalPages).toBe(3); // Math.ceil(12/5) = 3
    });

    it('should handle zero total', () => {
      const response = createPaginatedResponse([], 1, 10, 0, 'No items');

      expect(response.pagination.totalPages).toBe(0);
    });
  });
});