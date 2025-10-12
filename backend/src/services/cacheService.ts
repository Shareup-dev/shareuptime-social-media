// Cache servisi - Redis operations
import { redisClient } from '../config/database';

export class CacheService {
  static async get(key: string): Promise<string | null> {
    try {
      const { redisClient: client } = await import('../config/database');
      if (!client.isOpen) return null;
      return await client.get(key);
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: string, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      const { redisClient: client } = await import('../config/database');
      if (!client.isOpen) return false;
      await client.setEx(key, ttlSeconds, value);
      return true;
    } catch (error) {
      console.warn('Cache set error:', error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      const { redisClient: client } = await import('../config/database');
      if (!client.isOpen) return false;
      await client.del(key);
      return true;
    } catch (error) {
      console.warn('Cache delete error:', error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const { redisClient: client } = await import('../config/database');
      if (!client.isOpen) return false;
      const result = await client.exists(key);
      return result > 0;
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