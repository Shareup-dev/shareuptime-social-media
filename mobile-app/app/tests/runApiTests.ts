import ApiIntegrationTester from '../services/ApiIntegrationTester';

/**
 * ShareUpTime Mobile App - API Integration Test Runner
 * 
 * Bu script mobil uygulamanın ShareUptime backend API'si ile 
 * entegrasyonunu test eder.
 */

const runApiTests = async () => {
  const tester = new ApiIntegrationTester();
  
  try {
    console.log('📱 ShareUpTime Mobile App - API Integration Test');
    console.log('Backend: ShareUptime Social Media API');
    console.log('Date:', new Date().toLocaleString());
    console.log('\n');

    const results = await tester.runFullTest();
    
    // Return results for further processing
    return {
      success: results.every(r => r.success),
      results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        averageResponseTime: Math.round(
          results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
        ),
      },
    };

  } catch (error) {
    console.error('❌ API Integration Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Export for use in components/screens
export { runApiTests };

// Export for React Native usage
export default runApiTests;