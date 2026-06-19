import { beforeEach, describe, expect, it, vi } from 'vitest';

const redisState = vi.hoisted(() => ({
    current: {
        status: 'end',
        connect: vi.fn(async () => undefined),
    },
}));

const redisCtorMock = vi.hoisted(() => vi.fn());

vi.mock('ioredis', () => ({
    Redis: function RedisMock(...args: unknown[]) {
        redisCtorMock(...args);
        return redisState.current;
    },
}));

describe('redis lib unit', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        delete process.env.REDIS_URL;
    });

    it('exports null client when REDIS_URL is not set', async () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        const { redisClient, connectRedis } = await import('../redis.js');

        expect(redisClient).toBeNull();
        await expect(connectRedis()).resolves.toBeUndefined();
        expect(logSpy).toHaveBeenCalledWith('REDIS_URL is not set. Running without Redis.');
    });

    it('connects redis when client is initialized and not ready', async () => {
        process.env.REDIS_URL = 'redis://localhost:6379';
        const connectMock = vi.fn().mockResolvedValue(undefined);
        redisState.current = {
            status: 'end',
            connect: connectMock,
        };
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const { connectRedis } = await import('../redis.js');
        await connectRedis();

        expect(redisCtorMock).toHaveBeenCalledTimes(1);
        expect(connectMock).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith('Redis connected successfully');
    });

    it('does not call connect when client is already ready', async () => {
        process.env.REDIS_URL = 'redis://localhost:6379';
        const connectMock = vi.fn();
        redisState.current = {
            status: 'ready',
            connect: connectMock,
        };

        const { connectRedis } = await import('../redis.js');
        await connectRedis();

        expect(connectMock).not.toHaveBeenCalled();
    });
});
