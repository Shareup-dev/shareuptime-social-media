
import { Pool } from 'pg';
import mongoose from 'mongoose';
import { createClient as createRedisClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL - Ana veritabanı
export const pgPool = new Pool({
	host: process.env.POSTGRES_HOST || 'localhost',
	port: Number(process.env.POSTGRES_PORT) || 5432,
	database: process.env.POSTGRES_DB || 'shareuptime_db',
	user: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || 'password',
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

pgPool.on('error', (err) => {
	console.error('PostgreSQL pool error:', err);
});

pgPool.on('connect', () => {
	console.log('PostgreSQL bağlantısı başarılı');
});

// PostgreSQL bağlantısını test et
export const testPostgreSQLConnection = async () => {
  try {
    const client = await pgPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('PostgreSQL bağlantı testi başarılı:', result.rows[0].now);
    return true;
  } catch (err) {
    console.warn('PostgreSQL bağlantısı başarısız:', err instanceof Error ? err.message : err);
    return false;
  }
};

// MongoDB - Yedek/alternatif
export const connectMongo = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log('MongoDB bağlantısı başarılı');
    }
  } catch (err) {
    console.warn('MongoDB bağlantısı başarısız, devam ediliyor:', err instanceof Error ? err.message : err);
  }
};

// Redis - Cache (disabled for development)
export const redisClient = {
  isOpen: false,
  connect: async () => { console.log('Redis disabled for development'); },
  on: () => {},
  quit: async () => {},
  ping: async () => { throw new Error('Redis disabled'); },
  get: async (key: string) => null,
  setEx: async (key: string, seconds: number, value: string) => {},
  del: async (key: string | string[]) => 0,
  exists: async (key: string) => 0,
  keys: async (pattern: string) => [],
  incr: async (key: string) => 1,
  expire: async (key: string, seconds: number) => false
};

// ShareUpTime için özel database initialization
export const initializeDatabase = async () => {
  console.log('🔄 ShareUpTime Database başlatılıyor...');
  
  // PostgreSQL öncelikli bağlantı
  const pgConnected = await testPostgreSQLConnection();
  
  if (pgConnected) {
    console.log('✅ PostgreSQL aktif - Ana veritabanı olarak kullanılacak');
  } else {
    console.log('⚠️ PostgreSQL bağlantısı yok - MongoDB geçiliyor');
    await connectMongo();
  }

  // Redis cache
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (redisError) {
    console.warn('⚠️ Redis bağlantısı başarısız, cache özelliği kullanılamayacak');
    // Redis retry disabled to prevent spam
  }
  
  console.log('🚀 Database initialization tamamlandı');
};