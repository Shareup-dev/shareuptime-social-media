import apiConfig from '../config/api';

interface ApiTestResult {
  endpoint: string;
  method: string;
  success: boolean;
  responseTime: number;
  error?: string;
  data?: unknown;
}

class ApiIntegrationTester {
  private baseUrl: string;
  private results: ApiTestResult[] = [];

  constructor() {
    this.baseUrl = apiConfig.baseUrl;
  }

  private async testEndpoint(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<ApiTestResult> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const requestOptions: {
        method: string;
        headers?: Record<string, string>;
        body?: string;
      } = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        requestOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, requestOptions);
      const responseTime = Date.now() - startTime;

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      const result: ApiTestResult = {
        endpoint,
        method,
        success: response.ok,
        responseTime,
        data: responseData,
      };

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
      }

      this.results.push(result);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: ApiTestResult = {
        endpoint,
        method,
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.results.push(result);
      return result;
    }
  }

  async testHealthCheck() {
    console.log('🔍 Testing API Health Check...');
    const result = await this.testEndpoint('/health');

    if (result.success) {
      console.log('✅ API Health Check: PASSED');
    } else {
      console.log('❌ API Health Check: FAILED', result.error);
    }

    return result;
  }

  async testAuthEndpoints() {
    console.log('🔐 Testing Authentication Endpoints...');

    // Test registration endpoint structure
    const registerResult = await this.testEndpoint(apiConfig.endpoints.auth.register, 'POST', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
    });

    // Test login endpoint structure
    const loginResult = await this.testEndpoint(apiConfig.endpoints.auth.login, 'POST', {
      email: 'test@example.com',
      password: 'testpassword123',
    });

    console.log(
      registerResult.success ? '✅ Register Endpoint: ACCESSIBLE' : '❌ Register Endpoint: FAILED',
    );

    console.log(
      loginResult.success ? '✅ Login Endpoint: ACCESSIBLE' : '❌ Login Endpoint: FAILED',
    );

    return { registerResult, loginResult };
  }

  async testPostsEndpoints() {
    console.log('📝 Testing Posts Endpoints...');

    // Test feed endpoint
    const feedResult = await this.testEndpoint(`${apiConfig.endpoints.posts.feed}?page=1&limit=10`);

    // Test create post endpoint structure
    const createPostResult = await this.testEndpoint(apiConfig.endpoints.posts.create, 'POST', {
      content: 'Test post content',
      location: 'Test Location',
    });

    console.log(feedResult.success ? '✅ Feed Endpoint: ACCESSIBLE' : '❌ Feed Endpoint: FAILED');

    console.log(
      createPostResult.success
        ? '✅ Create Post Endpoint: ACCESSIBLE'
        : '❌ Create Post Endpoint: FAILED',
    );

    return { feedResult, createPostResult };
  }

  async testUsersEndpoints() {
    console.log('👤 Testing Users Endpoints...');

    // Test users endpoint
    const usersResult = await this.testEndpoint(apiConfig.endpoints.users.profile);

    console.log(
      usersResult.success ? '✅ Users Endpoint: ACCESSIBLE' : '❌ Users Endpoint: FAILED',
    );

    return { usersResult };
  }

  async runFullTest() {
    console.log('🚀 Starting ShareUpTime API Integration Test...\n');

    const startTime = Date.now();
    this.results = [];

    // Run all tests
    await this.testHealthCheck();
    await this.testAuthEndpoints();
    await this.testPostsEndpoints();
    await this.testUsersEndpoints();

    const totalTime = Date.now() - startTime;

    // Generate report
    this.generateReport(totalTime);

    return this.results;
  }

  private generateReport(totalTime: number) {
    const successCount = this.results.filter((r) => r.success).length;
    const failCount = this.results.length - successCount;

    console.log('\n📊 API Integration Test Report');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log(
      `Average Response Time: ${Math.round(
        this.results.reduce((sum, r) => sum + r.responseTime, 0) / this.results.length,
      )}ms`,
    );

    console.log('\n📝 Detailed Results:');
    this.results.forEach((result) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.method} ${result.endpoint} - ${result.responseTime}ms`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    if (failCount === 0) {
      console.log('\n🎉 All API endpoints are ready for integration!');
    } else {
      console.log('\n⚠️  Some endpoints need attention before full integration.');
    }
  }

  getResults() {
    return this.results;
  }
}

export default ApiIntegrationTester;
