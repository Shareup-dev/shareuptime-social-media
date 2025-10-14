// Mock dependencies first (hoisted)
const mockDatabaseClient = {
  query: jest.fn(),
  release: jest.fn()
};

const mockDatabasePool = {
  connect: jest.fn().mockResolvedValue(mockDatabaseClient)
};

jest.mock('../../src/config/database', () => ({
  pgPool: mockDatabasePool
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

import { loginUser, verifyTokenEndpoint } from '../../src/controllers/authController';
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

const createMockRequest = (body: any = {}, headers: any = {}) => ({
  body,
  headers,
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
const mockJwt = require('jsonwebtoken') as jest.Mocked<typeof import('jsonwebtoken')>;

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should return 400 for missing email', async () => {
      const req = createMockRequest({ password: 'password123' });
      const res = createMockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ve şifre gereklidir'
      });
    });

    it('should return 400 for missing password', async () => {
      const req = createMockRequest({ email: 'test@example.com' });
      const res = createMockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ve şifre gereklidir'
      });
    });

    it('should return 400 for invalid email format', async () => {
      const req = createMockRequest({ 
        email: 'invalid-email', 
        password: 'password123' 
      });
      const res = createMockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email format'
      });
    });

    it('should return 401 for user not found', async () => {
      const req = createMockRequest({ 
        email: 'test@example.com', 
        password: 'password123' 
      });
      const res = createMockResponse();

      mockDatabaseClient.query.mockResolvedValueOnce({ rows: [] });

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    });

    it('should return 401 for invalid password', async () => {
      const req = createMockRequest({ 
        email: 'test@example.com', 
        password: 'wrongpassword' 
      });
      const res = createMockResponse();

      mockDatabaseClient.query.mockResolvedValueOnce({ 
        rows: [{ 
          id: testUser.id, 
          email: testUser.email, 
          password_hash: 'hashedpassword' 
        }] 
      });
      
      (mockBcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    });

    it('should return 200 and token for valid credentials', async () => {
      const req = createMockRequest({ 
        email: 'test@example.com', 
        password: 'password123' 
      });
      const res = createMockResponse();

      mockDatabaseClient.query.mockResolvedValueOnce({ 
        rows: [{ 
          id: testUser.id, 
          email: testUser.email, 
          password_hash: 'hashedpassword',
          username: testUser.username,
          first_name: testUser.first_name,
          last_name: testUser.last_name
        }] 
      });
      
      (mockBcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (mockJwt.sign as jest.Mock).mockReturnValueOnce('mocked-token');

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Giriş başarılı',
        data: {
          token: 'mocked-token',
          user: {
            id: testUser.id,
            username: testUser.username,
            email: testUser.email,
            first_name: testUser.first_name,
            last_name: testUser.last_name
          }
        }
      });
    });

    it('should handle database errors', async () => {
      const req = createMockRequest({ 
        email: 'test@example.com', 
        password: 'password123' 
      });
      const res = createMockResponse();

      mockDatabaseClient.query.mockRejectedValueOnce(new Error('Database error'));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Sunucu hatası',
        error: 'Giriş sırasında hata oluştu'
      });
    });
  });

  describe('verifyTokenEndpoint', () => {
    it('should return 401 for missing token', async () => {
      const req = createMockRequest({}, {});
      const res = createMockResponse();

      await verifyTokenEndpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Geçersiz token'
      });
    });

    it('should return 401 for invalid token format', async () => {
      const req = createMockRequest({}, { authorization: 'InvalidFormat' });
      const res = createMockResponse();

      await verifyTokenEndpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Geçersiz token'
      });
    });

    it('should return 401 for invalid token', async () => {
      const req = createMockRequest({}, { authorization: 'Bearer invalid-token' });
      const res = createMockResponse();

      (mockJwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Geçersiz token');
      });

      await verifyTokenEndpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Geçersiz token'
      });
    });

    it('should return 200 for valid token', async () => {
      const req = createMockRequest({}, { authorization: 'Bearer valid-token' });
      const res = createMockResponse();

      mockDatabaseClient.query.mockResolvedValueOnce({ 
        rows: [{ 
          id: testUser.id, 
          username: testUser.username,
          email: testUser.email 
        }] 
      });

      (mockJwt.verify as jest.Mock).mockReturnValueOnce({ userId: testUser.id });

      await verifyTokenEndpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token geçerli',
        data: {
          user: {
            id: testUser.id,
            username: testUser.username,
            email: testUser.email
          }
        }
      });
    });
  });
});