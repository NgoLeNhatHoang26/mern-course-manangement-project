import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

const mockLogger = vi.hoisted(() => ({
    warn: vi.fn(),
    error: vi.fn(),
}));

vi.mock('../../config/logger.js', () => ({ logger: mockLogger }));

import { errorMiddleware } from '../error.middleware.js';

const makeReq = (overrides: Partial<Request> = {}): Request =>
    ({
        method: 'GET',
        path: '/api/courses',
        requestId: 'test-req-id',
        ...overrides,
    }) as unknown as Request;

const makeRes = () => {
    const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
    (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
    return res;
};

const next = vi.fn() as NextFunction;

describe('error.middleware unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ─── Response shape ────────────────────────────────────────────────────

    it('retorna JSON { success:false, message, code } para AppError 404', () => {
        const res = makeRes();
        errorMiddleware(new AppError('Course not found', 404), makeReq(), res, next);

        expect((res.status as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(404);
        expect((res.json as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: 'Course not found', code: 'NOT_FOUND' }),
        );
    });

    it('trả 409 và message cho lỗi duplicate key (code 11000)', () => {
        const res = makeRes();
        const dupError = Object.assign(new Error('dup'), { code: 11000 });
        errorMiddleware(dupError, makeReq(), res, next);

        expect((res.status as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(409);
        expect((res.json as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Dữ liệu đã tồn tại', code: 'CONFLICT' }),
        );
    });

    it('trả 500 cho lỗi không xác định', () => {
        const res = makeRes();
        errorMiddleware(new Error('boom'), makeReq(), res, next);

        expect((res.status as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(500);
        expect((res.json as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(
            expect.objectContaining({ code: 'INTERNAL_SERVER_ERROR' }),
        );
    });

    // ─── Logging level ─────────────────────────────────────────────────────

    it('gọi logger.warn cho lỗi 4xx', () => {
        errorMiddleware(new AppError('Not found', 404), makeReq(), makeRes(), next);

        expect(mockLogger.warn).toHaveBeenCalledOnce();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('gọi logger.error cho lỗi 5xx', () => {
        errorMiddleware(new Error('crash'), makeReq(), makeRes(), next);

        expect(mockLogger.error).toHaveBeenCalledOnce();
        expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('log kèm requestId và path', () => {
        errorMiddleware(
            new AppError('Forbidden', 403),
            makeReq({ path: '/api/admin', requestId: 'abc-123' } as Partial<Request>),
            makeRes(),
            next,
        );

        expect(mockLogger.warn).toHaveBeenCalledWith(
            expect.objectContaining({ requestId: 'abc-123', path: '/api/admin', statusCode: 403 }),
            expect.any(String),
        );
    });

    // ─── Sensitive path ─────────────────────────────────────────────────────

    it('không log stack trên path nhạy cảm /api/auth/login (5xx)', () => {
        const err = Object.assign(new Error('db crash'), { stack: 'sensitive-stack' });
        errorMiddleware(
            err,
            makeReq({ path: '/api/auth/login' } as Partial<Request>),
            makeRes(),
            next,
        );

        const logCall = mockLogger.error.mock.calls[0][0] as Record<string, unknown>;
        expect(logCall.stack).toBeUndefined();
    });

    it('log stack trên path không nhạy cảm (5xx)', () => {
        const err = Object.assign(new Error('db crash'), { stack: 'Error: db crash\n  at ...' });
        errorMiddleware(err, makeReq({ path: '/api/courses' } as Partial<Request>), makeRes(), next);

        const logCall = mockLogger.error.mock.calls[0][0] as Record<string, unknown>;
        expect(logCall.stack).toBe('Error: db crash\n  at ...');
    });
});
