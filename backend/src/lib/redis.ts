import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL;

export const redisClient = redisUrl
    ? new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
      })
    : null;

export const connectRedis = async (): Promise<void> => {
    if (!redisClient) {
        console.log('REDIS_URL is not set. Running without Redis.');
        return;
    }

    try {
        await redisClient.connect();
        console.log('Redis connected successfully');
    } catch (error) {
        console.warn('Failed to connect to Redis. Falling back to in-memory store.', error);
    }
};
