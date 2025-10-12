
import { Pool } from 'pg';
import mongoose from 'mongoose';
import { createClient as createRedisClient } from 'redis';
import neo4j from 'neo4j-driver';

import dotenv from 'dotenv';
dotenv.config();

// PostgreSQL
export const pgPool = new Pool({
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
});

pgPool.on('error', (err) => {
	console.error('PostgreSQL pool error:', err);
});

// MongoDB
export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB bağlantısı başarılı');
  } catch (err) {
    console.warn('MongoDB bağlantısı başarısız, devam ediliyor:', err instanceof Error ? err.message : err);
  }
};// Redis
export const redisClient = createRedisClient({
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on('error', (err) => {
	console.error('Redis bağlantı hatası:', err);
});

// Neo4j
export const neo4jDriver = neo4j.driver(
  process.env.NEO4J_URI as string,
  neo4j.auth.basic(
    process.env.NEO4J_USER as string,
    process.env.NEO4J_PASSWORD as string
  )
);

// Neo4j bağlantısını opsiyonel olarak test et
neo4jDriver.verifyConnectivity()
  .then(() => console.log('Neo4j bağlantısı başarılı'))
  .catch((err) => console.warn('Neo4j bağlantısı başarısız, devam ediliyor:', err.message));