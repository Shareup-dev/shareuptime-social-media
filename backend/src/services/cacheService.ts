// Cache servisi - Redis operations
export class CacheService {
  private static inMemoryCache = new Map<string, { value: string; expiry: number }>();

  static async get(key: string): Promise<string | null> {
    try {
      // In-memory fallback when Redis is not available
      const cached = this.inMemoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      } else if (cached) {
        this.inMemoryCache.delete(key);
      }
      return null;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: string, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      // In-memory fallback when Redis is not available
      const expiry = Date.now() + (ttlSeconds * 1000);
      this.inMemoryCache.set(key, { value, expiry });
      return true;
    } catch (error) {
      console.warn('Cache set error:', error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      // In-memory fallback when Redis is not available
      return this.inMemoryCache.delete(key);
    } catch (error) {
      console.warn('Cache delete error:', error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      // In-memory fallback when Redis is not available
      const cached = this.inMemoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return true;
      } else if (cached) {
        this.inMemoryCache.delete(key);
      }
      return false;
    } catch (error) {
      console.warn('Cache exists error:', error);
      return false;
    }
  }

  // Helper methods for common use cases
  static async cacheUserProfile(userId: string, userData: any, ttl: number = 1800): Promise<void> {
    await this.set(`user:${userId}`, JSON.stringify(userData), ttl);
  }

  static async getUserProfile(userId: string): Promise<any | null> {
    const cached = await this.get(`user:${userId}`);
    return cached ? JSON.parse(cached) : null;
  }

  static async invalidateUserProfile(userId: string): Promise<void> {
    await this.del(`user:${userId}`);
  }
}