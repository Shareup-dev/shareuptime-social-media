import ApiIntegrationTester from '../services/ApiIntegrationTester';

/**
 * ShareUpTime Mobile App - API Integration Test Runner
 * 
 * Bu script mobil uygulamanın ShareUptime backend API'si ile 
 * entegrasyonunu test eder.
 */

import { shareUpTimeApi } from '../redux/api';

export class ApiIntegrationTest {
  async testBackendConnection(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:4000/');
      const data = await response.json();
      console.log('✅ Backend Connection:', data.message);
      return response.ok;
    } catch (error) {
      console.error('❌ Backend Connection Failed:', error);
      return false;
    }
  }

  async testApiEndpoints(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};

    // Test main API
    try {
      const response = await fetch('http://localhost:4000/');
      results.main = response.ok;
    } catch {
      results.main = false;
    }

    // Test auth endpoints
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      results.auth = response.status !== 404;
    } catch {
      results.auth = false;
    }

    // Test users endpoints
    try {
      const response = await fetch('http://localhost:4000/api/users/search?q=test');
      results.users = response.status !== 404;
    } catch {
      results.users = false;
    }

    // Test posts endpoints
    try {
      const response = await fetch('http://localhost:4000/api/posts');
      results.posts = response.status !== 404;
    } catch {
      results.posts = false;
    }

    return results;
  }

  async runFullTest(): Promise<{
    backendConnected: boolean;
    endpoints: { [key: string]: boolean };
    integrationReady: boolean;
  }> {
    console.log('🚀 Starting ShareUpTime Mobile-Backend Integration Test...');

    const backendConnected = await this.testBackendConnection();
    const endpoints = await this.testApiEndpoints();
    
    const workingEndpoints = Object.values(endpoints).filter(Boolean).length;
    const totalEndpoints = Object.keys(endpoints).length;
    const integrationReady = backendConnected && workingEndpoints >= 2;

    console.log(`📊 Test Results:`);
    console.log(`- Backend Connected: ${backendConnected ? '✅' : '❌'}`);
    console.log(`- Working Endpoints: ${workingEndpoints}/${totalEndpoints}`);
    console.log(`- Integration Ready: ${integrationReady ? '✅' : '❌'}`);

    return {
      backendConnected,
      endpoints,
      integrationReady
    };
  }
}

export default ApiIntegrationTest;