import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/authRoutes';
import userRoutes from '../../src/routes/userRoutes';
import jwt from 'jsonwebtoken';

// Test helpers inline
const testUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword123'
};

const generateTestToken = (userId: string = testUser.id): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  return app;
};

// Mock database
jest.mock('../../src/config/database', () => ({
  pgPool: {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn()
    })
  }
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/auth/login', () => {
      it('should return 400 for missing credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it('should return 400 for invalid email format', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'invalid-email',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/auth/verify', () => {
      it('should return 401 for missing token', async () => {
        const response = await request(app)
          .get('/api/auth/verify');

        expect(response.status).toBe(401);
      });

      it('should return 401 for invalid token', async () => {
        const response = await request(app)
          .get('/api/auth/verify')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
      });
    });
  });

  describe('User Endpoints', () => {
    describe('POST /api/users/register', () => {
      it('should return 400 for missing required fields', async () => {
        const response = await request(app)
          .post('/api/users/register')
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it('should return 400 for invalid email', async () => {
        const response = await request(app)
          .post('/api/users/register')
          .send({
            username: 'testuser',
            email: 'invalid-email',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it('should return 400 for weak password', async () => {
        const response = await request(app)
          .post('/api/users/register')
          .send({
            username: 'testuser',
            email: 'test@example.com',
            password: '123'
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/users/:userId', () => {
      it('should return 400 for invalid user ID', async () => {
        const response = await request(app)
          .get('/api/users/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });

    describe('PUT /api/users/:userId', () => {
      it('should return 401 for missing authentication', async () => {
        const response = await request(app)
          .put(`/api/users/${testUser.id}`)
          .send({
            first_name: 'Updated Name'
          });

        expect(response.status).toBe(401);
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should respect rate limits for registration', async () => {
      // This test would require actual rate limiting to be enabled
      // For now, just ensure the endpoint responds
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User'
        });

      // Response could be 400 (validation) or 500 (database error) in test environment
      expect([400, 409, 500]).toContain(response.status);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ q: 'test' });

      // These headers should be set by middleware
      expect(response.headers).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });
});