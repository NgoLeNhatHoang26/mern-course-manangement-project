import rateLimit from "express-rate-limit";
import { RedisStore } from 'rate-limit-redis';
import type { RedisReply } from 'rate-limit-redis';
import { redisClient } from '../lib/redis.js';

const createRedisStore = (prefix: string) =>
    redisClient
        ? new RedisStore({
              sendCommand: (...args: string[]): Promise<RedisReply> =>
                  redisClient!.call(args[0], ...args.slice(1)) as Promise<RedisReply>,
              prefix,
          })
        : undefined;

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút",
    standardHeaders: true, 
    legacyHeaders: false, 
    skip: (req, res) => req.method === 'OPTIONS',
    store: createRedisStore('rl:global:'),
    passOnStoreError: true,
});

export const authRateLimiter = rateLimit({
    windowMs:  30 * 60 * 1000, 
    max: 10,
    message: "Quá nhiều yêu cầu đăng nhập từ IP này, vui lòng thử lại sau 30 phút",
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('rl:auth:'),
    passOnStoreError: true,
});