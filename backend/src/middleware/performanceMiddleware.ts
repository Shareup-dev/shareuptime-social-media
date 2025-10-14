import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

// Performance monitoring middleware
export interface PerformanceMetrics {
  timestamp: string;
  method: string;
  url: string;
  responseTime: number;
  statusCode: number;
  userAgent?: string;
  ip: string;
  memoryUsage: NodeJS.MemoryUsage;
  activeConnections: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics: number = 1000; // Store last 1000 requests
  private slowRequestThreshold: number = 1000; // 1 second
  private memoryAlertThreshold: number = 500 * 1024 * 1024; // 500MB

  // Add performance metric
  addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow requests
    if (metric.responseTime > this.slowRequestThreshold) {
      console.warn(`🐌 Slow request: ${metric.method} ${metric.url} - ${metric.responseTime}ms`);
    }

    // Memory usage alert
    if (metric.memoryUsage.heapUsed > this.memoryAlertThreshold) {
      console.warn(`🚨 High memory usage: ${Math.round(metric.memoryUsage.heapUsed / 1024 / 1024)}MB`);
    }
  }

  // Get performance statistics
  getStats(): {
    totalRequests: number;
    averageResponseTime: number;
    slowRequests: number;
    errorRate: number;
    memoryUsage: NodeJS.MemoryUsage;
    topEndpoints: Array<{ endpoint: string; count: number; avgTime: number }>;
    recentMetrics: PerformanceMetrics[];
  } {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowRequests: 0,
        errorRate: 0,
        memoryUsage: process.memoryUsage(),
        topEndpoints: [],
        recentMetrics: []
      };
    }

    const totalRequests = this.metrics.length;
    const averageResponseTime = this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests;
    const slowRequests = this.metrics.filter(m => m.responseTime > this.slowRequestThreshold).length;
    const errorRequests = this.metrics.filter(m => m.statusCode >= 400).length;
    const errorRate = (errorRequests / totalRequests) * 100;

    // Calculate top endpoints
    const endpointStats = new Map<string, { count: number; totalTime: number }>();
    
    this.metrics.forEach(metric => {
      const endpoint = `${metric.method} ${metric.url.split('?')[0]}`;
      const current = endpointStats.get(endpoint) || { count: 0, totalTime: 0 };
      endpointStats.set(endpoint, {
        count: current.count + 1,
        totalTime: current.totalTime + metric.responseTime
      });
    });

    const topEndpoints = Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        avgTime: Math.round(stats.totalTime / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowRequests,
      errorRate: Math.round(errorRate * 100) / 100,
      memoryUsage: process.memoryUsage(),
      topEndpoints,
      recentMetrics: this.metrics.slice(-20) // Last 20 requests
    };
  }

  // Get metrics for specific time window
  getMetricsInWindow(minutes: number): PerformanceMetrics[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.metrics.filter(m => new Date(m.timestamp) > cutoff);
  }

  // Clear old metrics
  clearOldMetrics(): void {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    this.metrics = this.metrics.filter(m => new Date(m.timestamp) > cutoffTime);
  }

  // Health check
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    uptime: number;
    memoryUsage: number;
    averageResponseTime: number;
  } {
    const stats = this.getStats();
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check memory usage
    const memoryUsageMB = stats.memoryUsage.heapUsed / 1024 / 1024;
    if (memoryUsageMB > 500) {
      issues.push(`High memory usage: ${Math.round(memoryUsageMB)}MB`);
      status = 'warning';
    }
    if (memoryUsageMB > 1000) {
      status = 'critical';
    }

    // Check response time
    if (stats.averageResponseTime > 1000) {
      issues.push(`Slow average response time: ${stats.averageResponseTime}ms`);
      if (status === 'healthy') status = 'warning';
    }
    if (stats.averageResponseTime > 5000) {
      status = 'critical';
    }

    // Check error rate
    if (stats.errorRate > 5) {
      issues.push(`High error rate: ${stats.errorRate}%`);
      if (status === 'healthy') status = 'warning';
    }
    if (stats.errorRate > 15) {
      status = 'critical';
    }

    return {
      status,
      issues,
      uptime: process.uptime(),
      memoryUsage: memoryUsageMB,
      averageResponseTime: stats.averageResponseTime
    };
  }
}

const performanceMonitor = new PerformanceMonitor();

// Performance monitoring middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();

  // Hook into response finish event
  res.on('finish', () => {
    const end = performance.now();
    const responseTime = Math.round(end - start);

        const metric: PerformanceMetrics = {
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.originalUrl,
          responseTime,
          statusCode: res.statusCode,
          userAgent: req.get('User-Agent') || '',
          ip: req.ip || req.connection.remoteAddress || '',
          memoryUsage: process.memoryUsage(),
          activeConnections: 0 // Simplified for now
        };    performanceMonitor.addMetric(metric);
  });

  next();
};

// Database query performance tracking
export class DbMonitor {
  private static queryMetrics: Array<{
    query: string;
    duration: number;
    timestamp: string;
    success: boolean;
  }> = [];

  static trackQuery(query: string, duration: number, success: boolean = true): void {
    this.queryMetrics.push({
      query: query.substring(0, 200), // Truncate long queries
      duration,
      timestamp: new Date().toISOString(),
      success
    });

    // Keep only last 100 queries
    if (this.queryMetrics.length > 100) {
      this.queryMetrics.shift();
    }

    // Log slow queries
    if (duration > 1000) {
      console.warn(`🐌 Slow database query (${duration}ms): ${query.substring(0, 100)}...`);
    }
  }

  static getQueryStats(): {
    totalQueries: number;
    averageQueryTime: number;
    slowQueries: number;
    failedQueries: number;
    recentQueries: Array<any>;
  } {
    if (this.queryMetrics.length === 0) {
      return {
        totalQueries: 0,
        averageQueryTime: 0,
        slowQueries: 0,
        failedQueries: 0,
        recentQueries: []
      };
    }

    const totalQueries = this.queryMetrics.length;
    const averageQueryTime = this.queryMetrics.reduce((sum, q) => sum + q.duration, 0) / totalQueries;
    const slowQueries = this.queryMetrics.filter(q => q.duration > 1000).length;
    const failedQueries = this.queryMetrics.filter(q => !q.success).length;

    return {
      totalQueries,
      averageQueryTime: Math.round(averageQueryTime),
      slowQueries,
      failedQueries,
      recentQueries: this.queryMetrics.slice(-10)
    };
  }
}

// Export performance monitor instance
export { performanceMonitor };

// Cleanup function for old metrics
setInterval(() => {
  performanceMonitor.clearOldMetrics();
}, 60 * 60 * 1000); // Run every hour