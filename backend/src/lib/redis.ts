import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const redisUrl = env.REDIS_URL;

export const redisClient = redisUrl
    ? new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
            return Math.min(times * 50, 1000);      
        },
      })
    : null;

export const connectRedis = async (): Promise<void> => {
    if (!redisClient) {
        logger.warn('REDIS_URL is not set. Running without Redis.');
        return;
    }

    try {
        if (redisClient.status === 'ready') {
            return;
        }
        if (redisClient.status === 'connecting' || redisClient.status === 'connect') {
            return;
        }
        await redisClient.connect();
        logger.info('Redis connected successfully');
    } catch (error) {
        logger.warn({ error }, 'Failed to connect to Redis. Falling back to in-memory store.');
    }
};
