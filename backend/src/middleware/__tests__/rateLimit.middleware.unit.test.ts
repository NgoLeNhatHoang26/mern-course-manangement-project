import { describe, expect, it, vi } from 'vitest';

const rateLimitMocks = vi.hoisted(() => ({
    rateLimit: vi.fn((options) => ({ __options: options })),
    redisStore: vi.fn(function RedisStore(this: any, options: unknown) {
        this.options = options;
    }),
}));

vi.mock('express-rate-limit', () => ({
    default: rateLimitMocks.rateLimit,
}));

vi.mock('rate-limit-redis', () => ({
    RedisStore: rateLimitMocks.redisStore,
}));

vi.mock('../../lib/redis.js', () => ({
    redisClient: null,
}));

import { authRateLimiter, globalRateLimiter } from '../rateLimit.middleware.js';

describe('rateLimit.middleware unit', () => {
    it('builds global limiter with expected defaults', () => {
        const options = (globalRateLimiter as any).__options;

        expect(options.windowMs).toBe(3 * 60 * 1000);
        expect(options.max).toBe(100);
        expect(options.store).toBeUndefined();
        expect(options.passOnStoreError).toBe(true);
    });

    it('builds auth limiter with stricter max requests', () => {
        const options = (authRateLimiter as any).__options;

        expect(options.windowMs).toBe(15 * 60 * 1000);
        expect(options.max).toBe(10);
        expect(options.store).toBeUndefined();
        expect(options.passOnStoreError).toBe(true);
    });

    it('creates two independent limiters', () => {
        expect(rateLimitMocks.rateLimit).toHaveBeenCalledTimes(2);
        expect(rateLimitMocks.redisStore).not.toHaveBeenCalled();
    });
});
