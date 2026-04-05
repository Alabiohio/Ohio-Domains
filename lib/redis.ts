import { Redis } from 'ioredis';

// Ensure the connection string is present
const redisUrl = process.env.REDIS_URL || '';

// Singleton-ish approach to prevent multiple connections in dev
let redis: Redis | null = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 5000,
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
}

export default redis;
