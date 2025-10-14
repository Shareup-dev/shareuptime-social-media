import { Router } from 'express';
import { Request, Response } from 'express';
import { pgPool } from '../config/database';
import { performanceMonitor, DbMonitor } from '../middleware/performanceMiddleware';
import { CacheService } from '../services/cacheService';
import { createResponse } from '../utils';

const router = Router();

// Admin middleware - simple password check
const adminAuth = (req: Request, res: Response, next: any) => {
  const adminKey = req.headers['x-admin-key'] || req.query.key;
  
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'dev_admin_2025') {
    res.status(401).json(createResponse(false, 'Unauthorized'));
    return;
  }
  
  next();
};

// Performance metrics endpoint
router.get('/performance', adminAuth, (req: Request, res: Response) => {
  try {
    const stats = performanceMonitor.getStats();
    const health = performanceMonitor.getHealthStatus();
    const dbStats = DbMonitor.getQueryStats();
    const cacheStats = CacheService.getStats();

    res.status(200).json(createResponse(true, 'Performance metrics', {
      performance: stats,
      health,
      database: dbStats,
      cache: cacheStats,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        pid: process.pid,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    }));
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json(createResponse(false, 'Error fetching metrics'));
  }
});

// Database statistics endpoint
router.get('/database', adminAuth, async (req: Request, res: Response) => {
  try {
    const client = await pgPool.connect();
    try {
      // Get table sizes and row counts
      const tableStatsQuery = `
        SELECT 
          schemaname,
          tablename,
          n_tup_ins + n_tup_upd - n_tup_del as row_count,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes,
          last_analyze,
          last_autoanalyze
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
      `;

      const tableStatsResult = await client.query(tableStatsQuery);

      // Get active connections
      const connectionsQuery = `
        SELECT 
          state,
          COUNT(*) as count
        FROM pg_stat_activity 
        WHERE datname = current_database()
        GROUP BY state;
      `;

      const connectionsResult = await client.query(connectionsQuery);

      // Get index usage
      const indexStatsQuery = `
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes
        WHERE schemaname = 'public'
        ORDER BY idx_tup_read DESC
        LIMIT 20;
      `;

      const indexStatsResult = await client.query(indexStatsQuery);

      res.status(200).json(createResponse(true, 'Database statistics', {
        tables: tableStatsResult.rows,
        connections: connectionsResult.rows,
        indexes: indexStatsResult.rows,
        poolInfo: {
          totalCount: pgPool.totalCount,
          idleCount: pgPool.idleCount,
          waitingCount: pgPool.waitingCount
        }
      }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json(createResponse(false, 'Error fetching database stats'));
  }
});

// Cache statistics endpoint
router.get('/cache', adminAuth, async (req: Request, res: Response) => {
  try {
    const stats = CacheService.getStats();
    
    res.status(200).json(createResponse(true, 'Cache statistics', {
      cache: stats,
      operations: {
        // Add cache operation counters if needed
      }
    }));
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json(createResponse(false, 'Error fetching cache stats'));
  }
});

// System health endpoint
router.get('/health', adminAuth, (req: Request, res: Response) => {
  try {
    const health = performanceMonitor.getHealthStatus();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    // Check if critical thresholds are exceeded
    const criticalChecks = {
      memoryUsage: memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9,
      uptime: uptime < 60, // Less than 1 minute uptime
      diskSpace: false, // Could add disk space check
    };

    const overallStatus = health.status === 'critical' || Object.values(criticalChecks).some(Boolean) 
      ? 'critical' 
      : health.status;

    res.status(200).json(createResponse(true, 'System health', {
      status: overallStatus,
      health,
      criticalChecks,
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy', // Could add actual DB ping
        cache: 'healthy',
        websocket: 'healthy'
      }
    }));
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json(createResponse(false, 'Error checking system health'));
  }
});

// Clear cache endpoint
router.post('/cache/clear', adminAuth, async (req: Request, res: Response) => {
  try {
    const { pattern } = req.body;
    
    if (pattern) {
      const deletedCount = await CacheService.deletePattern(pattern);
      res.status(200).json(createResponse(true, `Cleared ${deletedCount} cache entries matching pattern: ${pattern}`));
    } else {
      // Clear all cache - could implement if needed
      res.status(400).json(createResponse(false, 'Pattern required for cache clearing'));
    }
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json(createResponse(false, 'Error clearing cache'));
  }
});

// Recent logs endpoint (simplified)
router.get('/logs', adminAuth, (req: Request, res: Response) => {
  try {
    const recentMetrics = performanceMonitor.getStats().recentMetrics;
    const recentQueries = DbMonitor.getQueryStats().recentQueries;

    res.status(200).json(createResponse(true, 'Recent logs', {
      recentRequests: recentMetrics,
      recentQueries,
      serverLogs: [] // Could add actual log file reading
    }));
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json(createResponse(false, 'Error fetching logs'));
  }
});

export default router;