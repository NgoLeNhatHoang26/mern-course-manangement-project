import rateLimit from "express-rate-limit";
import type { Options } from "express-rate-limit";
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

const sharedOptions: Pick<Options, 'standardHeaders' | 'legacyHeaders' | 'skip' | 'validate' | 'passOnStoreError'> = {
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    // Render/Cloudflare gửi X-Forwarded-For — tắt validation để tránh 500 khi login
    validate: { xForwardedForHeader: false },
    passOnStoreError: true,
};

export const globalRateLimiter = rateLimit({
    ...sharedOptions,
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút",
    store: createRedisStore('rl:global:'),
});

export const authRateLimiter = rateLimit({
    ...sharedOptions,
    windowMs: 30 * 60 * 1000,
    max: 10,
    message: "Quá nhiều yêu cầu đăng nhập từ IP này, vui lòng thử lại sau 30 phút",
    store: createRedisStore('rl:auth:'),
});