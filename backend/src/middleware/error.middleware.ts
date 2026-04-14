import { Request, Response, NextFunction } from 'express'

type AppError = {
    name?: string;
    message?: string;
    code?: number | string;
    status?: number;
    statusCode?: number;
    errors?: Record<string, { message?: string }>;
};

const getStatusCode = (error: AppError): number => {
    if (error.name === 'ValidationError' || error.name === 'CastError') return 400;
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') return 401;
    if (error.code === 11000) return 409;

    // Cho phép service/controller tự set status nếu có
    const explicitStatus = error.statusCode || error.status;
    if (typeof explicitStatus === 'number') return explicitStatus;

    return 500;
};

const getErrorCode = (statusCode: number): string => {
    switch (statusCode) {
        case 400:
            return 'BAD_REQUEST';
        case 401:
            return 'UNAUTHORIZED';
        case 403:
            return 'FORBIDDEN';
        case 404:
            return 'NOT_FOUND';
        case 409:
            return 'CONFLICT';
        default:
            return 'INTERNAL_SERVER_ERROR';
    }
};

const getErrorMessage = (error: AppError, statusCode: number): string => {
    if (error.name === 'ValidationError') return 'Dữ liệu không hợp lệ';
    if (error.code === 11000) return 'Dữ liệu đã tồn tại';
    if (error.name === 'JsonWebTokenError') return 'Token không hợp lệ';
    if (error.name === 'TokenExpiredError') return 'Token đã hết hạn';
    if (statusCode === 500) return 'Internal Server Error';
    return error.message || 'Request failed';
};

export const errorMiddleware = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = getStatusCode(error);

    const validationErrors =
        error.name === 'ValidationError' && error.errors
            ? Object.values(error.errors).map((item) => item.message || 'Invalid value')
            : undefined;

    res.status(statusCode).json({
        success: false,
        message: getErrorMessage(error, statusCode),
        errors: validationErrors,
        code: getErrorCode(statusCode),
    });
}