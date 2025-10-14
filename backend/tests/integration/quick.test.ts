import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/authRoutes';
import userRoutes from '../../src/routes/userRoutes';

// Simplified mock
jest.mock('../../src/config/database', () => ({
  pgPool: {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn()
    })
  }
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

// Create simple test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  return app;
};

describe('Quick Integration Test', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  it('should respond to health check routes', async () => {
    // Test auth login route exists
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({});
    
    expect(loginResponse.status).toBeDefined();
    expect([400, 500]).toContain(loginResponse.status); // Either validation error or server error
  });

  it('should respond to user routes', async () => {
    // Test user registration route exists
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({});
    
    expect(registerResponse.status).toBeDefined();
    expect([400, 500]).toContain(registerResponse.status); // Either validation error or server error
  });
});