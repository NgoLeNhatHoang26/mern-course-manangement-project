import { NextFunction, Request, Response } from 'express';
import {
    acquireIdempotencyLock,
    completeIdempotency,
    getIdempotencyRecord,
    parseIdempotencyRecord,
    releaseIdempotencyLock,
} from '../lib/idempotencyStore.js';
import { AppError } from '../utils/AppError.js';

const IDEMPOTENCY_HEADER = 'idempotency-key';
const KEY_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

const getScopedKey = (req: Request, key: string): string => {
    const userId = req.user?.id || req.user?._id?.toString() || 'anonymous';
    return `idempotency:${userId}:${key}`;
};

const replayCachedResponse = (res: Response, cached: { statusCode: number; body: unknown }): void => {
    res.status(cached.statusCode);
    res.json(cached.body);
};

export const idempotencyMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const rawKey = req.headers[IDEMPOTENCY_HEADER];
    if (!rawKey || typeof rawKey !== 'string') {
        return next();
    }

    const key = rawKey.trim();
    if (!KEY_PATTERN.test(key)) {
        return next(new AppError('Idempotency-Key không hợp lệ', 400));
    }

    const scopedKey = getScopedKey(req, key);
    const existing = await getIdempotencyRecord(scopedKey);

    if (existing) {
        const parsed = parseIdempotencyRecord(existing);
        if (parsed === 'processing') {
            return next(new AppError('Yêu cầu đang được xử lý, vui lòng thử lại sau', 409));
        }
        if (parsed) {
            replayCachedResponse(res, parsed);
            return;
        }
    }

    const acquired = await acquireIdempotencyLock(scopedKey);
    if (!acquired) {
        const retry = await getIdempotencyRecord(scopedKey);
        const parsed = retry ? parseIdempotencyRecord(retry) : null;
        if (parsed === 'processing') {
            return next(new AppError('Yêu cầu đang được xử lý, vui lòng thử lại sau', 409));
        }
        if (parsed) {
            replayCachedResponse(res, parsed);
            return;
        }
        return next(new AppError('Yêu cầu trùng lặp', 409));
    }

    const originalJson = res.json.bind(res);

    res.json = ((body?: unknown) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            void completeIdempotency(scopedKey, res.statusCode, body);
        } else {
            void releaseIdempotencyLock(scopedKey);
        }
        return originalJson(body);
    }) as Response['json'];

    next();
};
