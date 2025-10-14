// Mock dependencies first (hoisted)
const mockDatabaseClient = {
  query: jest.fn(),
  release: jest.fn()
};

const mockDatabasePool = {
  connect: jest.fn().mockResolvedValue(mockDatabaseClient),
  query: jest.fn()
};

jest.mock('../../src/config/database', () => ({
  pgPool: mockDatabasePool
}));

jest.mock('bcrypt');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

import { registerUser, getUserProfile } from '../../src/controllers/userController';
import bcrypt from 'bcrypt';

// Test helpers
const testUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword123',
  first_name: 'Test',
  last_name: 'User'
};

const mockUserResponse = {
  id: testUser.id,
  username: testUser.username,
  email: testUser.email,
  first_name: testUser.first_name,
  last_name: testUser.last_name,
  profile_picture_url: null,
  cover_photo_url: null,
  bio: null,
  location: null,
  website: null,
  is_verified: false,
  is_private: false,
  created_at: new Date().toISOString()
};

const createMockRequest = (body: any = {}, headers: any = {}, params: any = {}) => ({
  body,
  headers,
  params,
  userId: testUser.id,
  ip: '127.0.0.1',
  method: 'POST',
  url: '/test',
  originalUrl: '/test'
} as any);

const createMockResponse = () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    statusCode: 200
  };
  return res;
};

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 for missing required fields', async () => {
      const req = createMockRequest({});
      const res = createMockResponse();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Kullanıcı adı, email ve şifre gereklidir'
      });
    });

    it('should return 400 for invalid email', async () => {
      const req = createMockRequest({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      });
      const res = createMockResponse();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Geçersiz email formatı'
      });
    });

    it('should return 400 for invalid username', async () => {
      const req = createMockRequest({
        username: 'us',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      });
      const res = createMockResponse();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Kullanıcı adı 3-20 karakter arası olmalı ve sadece harf, rakam ve _ içerebilir'
      });
    });

    it('should return 400 for weak password', async () => {
      const req = createMockRequest({
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
        first_name: 'Test',
        last_name: 'User'
      });
      const res = createMockResponse();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      });
    });

    it('should return 409 for existing email', async () => {
      const req = createMockRequest({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      });
      const res = createMockResponse();

      mockDatabaseClient.query.mockResolvedValueOnce({ rows: [{ id: 'existing-user' }] });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bu email veya kullanıcı adı zaten kullanılıyor'
      });
    });

    it('should return 201 for successful registration', async () => {
      const req = createMockRequest({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      });
      const res = createMockResponse();

      // Check existing user - none found
      mockDatabaseClient.query.mockResolvedValueOnce({ rows: [] });
      
      // Hash password
      (mockBcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword');
      
      // Insert new user
      mockDatabaseClient.query.mockResolvedValueOnce({ 
        rows: [mockUserResponse] 
      });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Kullanıcı başarıyla oluşturuldu',
        data: mockUserResponse
      });
    });

    it('should handle database errors', async () => {
      const req = createMockRequest({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      });
      const res = createMockResponse();

      // Mock database connection failure for registration
      mockDatabasePool.connect.mockRejectedValueOnce(new Error('Database connection failed'));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Sunucu hatası',
        data: undefined,
        error: 'Kullanıcı kaydı sırasında hata oluştu'
      });
    });
  });

  describe('getUserProfile', () => {
    it('should return 400 for invalid user ID', async () => {
      const req = createMockRequest({}, {}, { userId: 'invalid-id' }); // Invalid UUID format
      const res = createMockResponse();

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Geçersiz kullanıcı ID formatı'
      });
    });

    it('should return 404 for user not found', async () => {
      const req = createMockRequest({}, {}, { userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }); // Valid UUID format
      const res = createMockResponse();

      mockDatabaseClient.query.mockResolvedValueOnce({ rows: [] });

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    });

    it('should return 200 with user profile', async () => {
      const req = createMockRequest({}, {}, { userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }); // Valid UUID format
      const res = createMockResponse();

      mockDatabaseClient.query.mockResolvedValueOnce({ 
        rows: [mockUserResponse] 
      });

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Kullanıcı profili getirildi',
        data: mockUserResponse
      });
    });

    it('should handle database errors', async () => {
      const req = createMockRequest({}, {}, { userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }); // Valid UUID format
      const res = createMockResponse();

      // Properly mock the database connection and query failure
      mockDatabasePool.connect.mockRejectedValueOnce(new Error('Database connection failed'));

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Sunucu hatası',
        data: undefined,
        error: 'Kullanıcı profili getirilirken hata oluştu'
      });
    });
  });
});