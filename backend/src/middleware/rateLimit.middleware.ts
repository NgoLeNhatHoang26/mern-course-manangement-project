import rateLimit from "express-rate-limit";
import { RedisStore } from 'rate-limit-redis';
import type { RedisReply } from 'rate-limit-redis';
import { redisClient } from '../lib/redis.js';

const redisStore = redisClient
    ? new RedisStore({
          // rate-limit-redis yêu cầu signature (...args: string[]) => Promise<unknown>
          sendCommand: (...args: string[]): Promise<RedisReply> =>
              redisClient!.call(args[0], ...args.slice(1)) as Promise<RedisReply>,
      })
    : undefined;

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // giới hạn mỗi IP chỉ được gửi tối đa 100 request trong 15 phút
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút",
    standardHeaders: true, // gửi thông tin rate limit trong header `RateLimit-*`
    legacyHeaders: false, // không gửi header `X-RateLimit-*`
    skip: (req, res) => req.method === 'OPTIONS',
    store: redisStore,
    passOnStoreError: true,
});

export const authRateLimiter = rateLimit({
    windowMs:  30 * 60 * 1000, // 30 phút
    max: 10, // giới hạn mỗi IP chỉ được gửi tối đa 10 request trong 30 phút
    message: "Quá nhiều yêu cầu đăng nhập từ IP này, vui lòng thử lại sau 30 phút",
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStore,
    passOnStoreError: true,
});