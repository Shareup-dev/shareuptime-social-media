import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import runApiTests from '../tests/runApiTests';
import colors from '../config/colors';

interface TestResult {
  endpoint: string;
  method: string;
  success: boolean;
  responseTime: number;
  error?: string;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  averageResponseTime: number;
}

const ApiTestScreen: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  const handleRunTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    try {
      const tester = new runApiTests();
      const testResult = await tester.runFullTest();

      if (testResult.backendConnected && testResult.integrationReady) {
        // Convert endpoints object to TestResult array
        const results = Object.entries(testResult.endpoints).map(([endpoint, success]) => ({
          endpoint,
          method: 'GET',
          success,
          response: success ? 'OK' : 'Failed',
          responseTime: 0,
        }));
        
        setResults(results);
        setSummary({
          total: results.length,
          passed: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          averageResponseTime: 0,
        });

        Alert.alert(
          'Test Completed',
          `${results.filter(r => r.success).length}/${results.length} endpoints passed`
        );
      } else {
        Alert.alert(
          'Tests Failed',
          testResult.backendConnected ? 'Integration not ready' : 'Backend connection failed'
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ Error',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setIsRunning(false);
    }
  }, []);

  const renderTestResult = (result: TestResult, index: number) => (
    <View key={index} style={[
      styles.resultItem,
      { backgroundColor: result.success ? testColors.lightGreen : testColors.lightRed }
    ]}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultIcon}>
          {result.success ? '✅' : '❌'}
        </Text>
        <Text style={styles.resultEndpoint}>
          {result.method} {result.endpoint}
        </Text>
        <Text style={styles.resultTime}>
          {result.responseTime}ms
        </Text>
      </View>
      {result.error && (
        <Text style={styles.errorText}>
          {result.error}
        </Text>
      )}
    </View>
  );

  const renderSummary = () => {
    if (!summary) return null;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>📊 Test Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Tests:</Text>
          <Text style={styles.summaryValue}>{summary.total}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Passed:</Text>
          <Text style={[styles.summaryValue, { color: testColors.green }]}>
            {summary.passed}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Failed:</Text>
          <Text style={[styles.summaryValue, { color: colors.red }]}>
            {summary.failed}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Avg Response:</Text>
          <Text style={styles.summaryValue}>{summary.averageResponseTime}ms</Text>
        </View>
        {lastRunTime && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Last Run:</Text>
            <Text style={styles.summaryValue}>{lastRunTime}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔗 API Integration Tests</Text>
        <Text style={styles.subtitle}>ShareUpTime Backend Connection</Text>
      </View>

      <TouchableOpacity
        style={[styles.runButton, isRunning && styles.runButtonDisabled]}
        onPress={handleRunTests}
        disabled={isRunning}
      >
        <Text style={styles.runButtonText}>
          {isRunning ? '🔄 Running Tests...' : '🚀 Run API Tests'}
        </Text>
      </TouchableOpacity>

      {renderSummary()}

      <ScrollView style={styles.resultsContainer}>
        {results.length > 0 && (
          <>
            <Text style={styles.resultsTitle}>📝 Test Results</Text>
            {results.map(renderTestResult)}
          </>
        )}
        
        {results.length === 0 && !isRunning && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Press "Run API Tests" to test backend connectivity
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.LightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mediumGray,
  },
  runButton: {
    backgroundColor: colors.iondigoDye,
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  runButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  runButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: colors.lighterGray,
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.dark,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.dimGray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.dark,
  },
  resultItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  resultEndpoint: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  resultTime: {
    fontSize: 12,
    color: colors.dimGray,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 5,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center',
  },
});

// Define additional colors locally
const testColors = {
  ...colors,
  lightGreen: '#e8f5e8',
  lightRed: '#fde8e8',
  green: '#22c55e',
};

export default ApiTestScreen;