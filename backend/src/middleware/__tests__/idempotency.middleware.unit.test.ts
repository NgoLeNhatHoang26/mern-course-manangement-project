import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError.js';

const storeMocks = vi.hoisted(() => ({
    getIdempotencyRecord: vi.fn(),
    acquireIdempotencyLock: vi.fn(),
    completeIdempotency: vi.fn(),
    releaseIdempotencyLock: vi.fn(),
    parseIdempotencyRecord: vi.fn(),
}));

vi.mock('../../lib/idempotencyStore.js', () => storeMocks);

const createMockResponse = () => {
    const res = {
        statusCode: 200,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json: vi.fn(function json(this: { statusCode: number }, body?: unknown) {
            return body;
        }),
    } as unknown as Response;

    return res;
};

describe('idempotency.middleware unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        storeMocks.parseIdempotencyRecord.mockImplementation((raw: string) => {
            if (raw === '__processing__') return 'processing';
            try {
                return JSON.parse(raw);
            } catch {
                return null;
            }
        });
    });

    it('skips middleware when Idempotency-Key header is missing', async () => {
        const { idempotencyMiddleware } = await import('../idempotency.middleware.js');
        const req = { headers: {}, user: { id: 'u1' } } as Request;
        const res = createMockResponse();
        const next = vi.fn() as NextFunction;

        await idempotencyMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(storeMocks.getIdempotencyRecord).not.toHaveBeenCalled();
    });

    it('returns 400 when Idempotency-Key format is invalid', async () => {
        const { idempotencyMiddleware } = await import('../idempotency.middleware.js');
        const req = { headers: { 'idempotency-key': 'short' }, user: { id: 'u1' } } as Request;
        const res = createMockResponse();
        const next = vi.fn() as NextFunction;

        await idempotencyMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
    });

    it('replays cached successful response for duplicate key', async () => {
        const { idempotencyMiddleware } = await import('../idempotency.middleware.js');
        const cached = { statusCode: 201, body: { _id: 'c1', title: 'Node.js' } };
        storeMocks.getIdempotencyRecord.mockResolvedValue(JSON.stringify(cached));

        const req = {
            headers: { 'idempotency-key': 'key-12345678' },
            user: { id: 'u1' },
        } as Request;
        const res = createMockResponse();
        const next = vi.fn() as NextFunction;

        await idempotencyMiddleware(req, res, next);

        expect(res.statusCode).toBe(201);
        expect(res.json).toHaveBeenCalledWith(cached.body);
        expect(next).not.toHaveBeenCalled();
        expect(storeMocks.acquireIdempotencyLock).not.toHaveBeenCalled();
    });

    it('returns 409 when the same key is still processing', async () => {
        const { idempotencyMiddleware } = await import('../idempotency.middleware.js');
        storeMocks.getIdempotencyRecord.mockResolvedValue('__processing__');

        const req = {
            headers: { 'idempotency-key': 'key-12345678' },
            user: { id: 'u1' },
        } as Request;
        const res = createMockResponse();
        const next = vi.fn() as NextFunction;

        await idempotencyMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect((next.mock.calls[0][0] as AppError).statusCode).toBe(409);
    });

    it('acquires lock and caches response on success', async () => {
        const { idempotencyMiddleware } = await import('../idempotency.middleware.js');
        storeMocks.getIdempotencyRecord.mockResolvedValue(null);
        storeMocks.acquireIdempotencyLock.mockResolvedValue(true);
        storeMocks.completeIdempotency.mockResolvedValue(undefined);

        const req = {
            headers: { 'idempotency-key': 'key-12345678' },
            user: { id: 'u1' },
        } as Request;
        const res = createMockResponse();
        const next = vi.fn() as NextFunction;

        await idempotencyMiddleware(req, res, next);
        expect(next).toHaveBeenCalledWith();

        res.status(201);
        res.json({ _id: 'c1', title: 'Node.js' });

        expect(storeMocks.completeIdempotency).toHaveBeenCalledWith(
            'idempotency:u1:key-12345678',
            201,
            { _id: 'c1', title: 'Node.js' },
        );
    });

    it('releases lock when response status is not successful', async () => {
        const { idempotencyMiddleware } = await import('../idempotency.middleware.js');
        storeMocks.getIdempotencyRecord.mockResolvedValue(null);
        storeMocks.acquireIdempotencyLock.mockResolvedValue(true);
        storeMocks.releaseIdempotencyLock.mockResolvedValue(undefined);

        const req = {
            headers: { 'idempotency-key': 'key-12345678' },
            user: { id: 'u1' },
        } as Request;
        const res = createMockResponse();
        const next = vi.fn() as NextFunction;

        await idempotencyMiddleware(req, res, next);

        res.status(500);
        res.json({ message: 'failed' });

        expect(storeMocks.releaseIdempotencyLock).toHaveBeenCalledWith('idempotency:u1:key-12345678');
        expect(storeMocks.completeIdempotency).not.toHaveBeenCalled();
    });
});
