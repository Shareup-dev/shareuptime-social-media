import { redisClient } from '../config/database';

// Cache servisi - Redis operations with in-memory fallback
export class CacheService {
  private static inMemoryCache = new Map<string, { value: string; expiry: number }>();
  private static isRedisAvailable = false;

  // Check Redis availability
  static async checkRedisConnection(): Promise<void> {
    try {
      if (redisClient && redisClient.isOpen) {
        await redisClient.ping();
        this.isRedisAvailable = true;
        console.log('✅ Redis cache available');
      } else {
        this.isRedisAvailable = false;
        console.log('⚠️  Redis unavailable, using in-memory cache');
      }
    } catch (_error) {
      this.isRedisAvailable = false;
      console.log('⚠️  Redis unavailable, using in-memory cache');
    }
  }

  static async get(key: string): Promise<string | null> {
    try {
      // Try Redis first if available
      if (this.isRedisAvailable && redisClient) {
        const value = await redisClient.get(key);
        if (value) return value;
      }

      // Fallback to in-memory cache
      const cached = this.inMemoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      } else if (cached) {
        this.inMemoryCache.delete(key);
      }
      return null;
    } catch (_error) {
      console.warn('Cache get error:', _error);
      return null;
    }
  }

  static async set(key: string, value: string, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      // Try Redis first if available
      if (this.isRedisAvailable && redisClient) {
        await redisClient.setEx(key, ttlSeconds, value);
      }

      // Always set in-memory as fallback
      const expiry = Date.now() + ttlSeconds * 1000;
      this.inMemoryCache.set(key, { value, expiry });
      return true;
    } catch (_error) {
      console.warn('Cache set error:', _error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      let success = true;

      // Try Redis first if available
      if (this.isRedisAvailable && redisClient) {
        await redisClient.del(key);
      }

      // Delete from in-memory cache
      const memDeleted = this.inMemoryCache.delete(key);
      return success && memDeleted;
    } catch (_error) {
      console.warn('Cache delete error:', _error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      // Try Redis first if available
      if (this.isRedisAvailable && redisClient) {
        const exists = await redisClient.exists(key);
        if (exists === 1) return true;
      }

      // Check in-memory cache
      const cached = this.inMemoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return true;
      } else if (cached) {
        this.inMemoryCache.delete(key);
      }
      return false;
    } catch (_error) {
      console.warn('Cache exists error:', _error);
      return false;
    }
  }

  // Pattern-based operations (Redis only)
  static async deletePattern(pattern: string): Promise<number> {
    try {
      if (this.isRedisAvailable && redisClient) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          return await redisClient.del(keys);
        }
      }
      return 0;
    } catch (_error) {
      console.warn('Cache pattern delete error:', _error);
      return 0;
    }
  }

  // Helper methods for common use cases
  static async cacheUserProfile(userId: string, userData: any, ttl: number = 1800): Promise<void> {
    await this.set(`user:profile:${userId}`, JSON.stringify(userData), ttl);
  }

  static async getUserProfile(userId: string): Promise<any | null> {
    const cached = await this.get(`user:profile:${userId}`);
    return cached ? JSON.parse(cached) : null;
  }

  static async invalidateUserProfile(userId: string): Promise<void> {
    await this.del(`user:profile:${userId}`);
  }

  // Post caching
  static async cachePost(postId: string, postData: any, ttl: number = 900): Promise<void> {
    await this.set(`post:${postId}`, JSON.stringify(postData), ttl);
  }

  static async getPost(postId: string): Promise<any | null> {
    const cached = await this.get(`post:${postId}`);
    return cached ? JSON.parse(cached) : null;
  }

  static async invalidatePost(postId: string): Promise<void> {
    await this.del(`post:${postId}`);
  }

  // Feed caching
  static async cacheFeed(userId: string, feedData: any, ttl: number = 600): Promise<void> {
    await this.set(`feed:${userId}`, JSON.stringify(feedData), ttl);
  }

  static async getFeed(userId: string): Promise<any | null> {
    const cached = await this.get(`feed:${userId}`);
    return cached ? JSON.parse(cached) : null;
  }

  static async invalidateFeed(userId: string): Promise<void> {
    await this.del(`feed:${userId}`);
  }

  // Search results caching
  static async cacheSearchResults(query: string, results: any, ttl: number = 1200): Promise<void> {
    const searchKey = `search:${Buffer.from(query).toString('base64')}`;
    await this.set(searchKey, JSON.stringify(results), ttl);
  }

  static async getSearchResults(query: string): Promise<any | null> {
    const searchKey = `search:${Buffer.from(query).toString('base64')}`;
    const cached = await this.get(searchKey);
    return cached ? JSON.parse(cached) : null;
  }

  // Session caching
  static async cacheSession(
    sessionId: string,
    sessionData: any,
    ttl: number = 3600,
  ): Promise<void> {
    await this.set(`session:${sessionId}`, JSON.stringify(sessionData), ttl);
  }

  static async getSession(sessionId: string): Promise<any | null> {
    const cached = await this.get(`session:${sessionId}`);
    return cached ? JSON.parse(cached) : null;
  }

  // Rate limiting helper
  static async incrementCounter(key: string, ttl: number = 3600): Promise<number> {
    try {
      if (this.isRedisAvailable && redisClient) {
        const count = await redisClient.incr(key);
        if (count === 1) {
          await redisClient.expire(key, ttl);
        }
        return count;
      }

      // In-memory fallback for rate limiting
      const current = this.inMemoryCache.get(key);
      const newCount = current ? parseInt(current.value) + 1 : 1;
      const expiry = current ? current.expiry : Date.now() + ttl * 1000;

      this.inMemoryCache.set(key, {
        value: newCount.toString(),
        expiry,
      });

      return newCount;
    } catch (_error) {
      console.warn('Counter increment error:', _error);
      return 1;
    }
  }

  // Cleanup expired in-memory cache entries
  static cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.inMemoryCache.entries()) {
      if (entry.expiry <= now) {
        this.inMemoryCache.delete(key);
      }
    }
  }

  // Initialize cache service
  static async initialize(): Promise<void> {
    await this.checkRedisConnection();

    // Setup periodic cleanup of in-memory cache
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 60000); // Clean up every minute
  }

  // Get cache statistics
  static getStats(): {
    redisAvailable: boolean;
    inMemorySize: number;
    redisConnected: boolean;
  } {
    return {
      redisAvailable: this.isRedisAvailable,
      inMemorySize: this.inMemoryCache.size,
      redisConnected: redisClient ? redisClient.isOpen : false,
    };
  }
}
