import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError.js'
import { logger } from '../config/logger.js'

type AnyError = {
    name?: string;
    message?: string;
    code?: number | string;
    status?: number;
    statusCode?: number;
    stack?: string;
    errors?: unknown;
    isOperational?: boolean;
};

/** Type guard cho Mongoose ValidationError.errors */
const isMongooseErrors = (v: unknown): v is Record<string, { message?: string }> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

const SENSITIVE_PATHS = new Set([
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
]);

const getStatusCode = (error: AnyError): number => {
    if (error instanceof AppError) return error.statusCode;

    if (error.name === 'ValidationError' || error.name === 'CastError') return 400;
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') return 401;

    if (error.code === 11000) return 409;

    const explicit = error.statusCode ?? error.status;
    if (typeof explicit === 'number') return explicit;

    return 500;
};

const getErrorCode = (statusCode: number): string => {
    const map: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        422: 'UNPROCESSABLE_ENTITY',
        429: 'TOO_MANY_REQUESTS',
        503: 'SERVICE_UNAVAILABLE',
    };
    return map[statusCode] ?? 'INTERNAL_SERVER_ERROR';
};

const getErrorMessage = (error: AnyError, statusCode: number): string => {
    if (error.name === 'ValidationError') return 'Dữ liệu không hợp lệ';
    if (error.code === 11000) return 'Dữ liệu đã tồn tại';
    if (error.name === 'JsonWebTokenError') return 'Token không hợp lệ';
    if (error.name === 'TokenExpiredError') return 'Token đã hết hạn';
    if (statusCode === 500) return 'Internal Server Error';
    return error.message || 'Request failed';
};

const logError = (error: AnyError, req: Request, statusCode: number, message: string): void => {
    const isSensitive = SENSITIVE_PATHS.has(req.path);

    const base = {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode,
        errName: error.name,
        message,
    };

    if (statusCode >= 500) {
        logger.error({
            ...base,
            stack: isSensitive ? undefined : error.stack,
        }, message);
        return;
    }

    if (statusCode >= 400) {
        logger.warn(base, message);
    }
};

export const errorMiddleware = (
    error: AnyError,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const statusCode = getStatusCode(error);
    const message = getErrorMessage(error, statusCode);

    logError(error, req, statusCode, message);

    const responseErrors =
        error instanceof AppError && error.errors !== undefined
            ? error.errors
            : error.name === 'ValidationError' && isMongooseErrors(error.errors)
              ? Object.values(error.errors).map((item) => item.message ?? 'Invalid value')
              : undefined;

    res.status(statusCode).json({
        success: false,
        message,
        errors: responseErrors,
        code: getErrorCode(statusCode),
    });
};
