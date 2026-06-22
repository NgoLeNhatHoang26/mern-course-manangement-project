import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError.js'

type AnyError = {
    name?: string;
    message?: string;
    code?: number | string;
    status?: number;
    statusCode?: number;
    errors?: Record<string, { message?: string }>;
    isOperational?: boolean;
};

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

export const errorMiddleware = (
    error: AnyError,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const statusCode = getStatusCode(error);

    const responseErrors =
        error instanceof AppError && error.errors !== undefined
            ? error.errors
            : error.name === 'ValidationError' && error.errors
              ? Object.values(error.errors).map((item) => item.message ?? 'Invalid value')
              : undefined;

    res.status(statusCode).json({
        success: false,
        message: getErrorMessage(error, statusCode),
        errors: responseErrors,
        code: getErrorCode(statusCode),
    });
};
