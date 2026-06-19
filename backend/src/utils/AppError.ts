/**
 * AppError — typed domain error với HTTP statusCode.
 *
 * Dùng thay cho `throw new Error(message)` ở mọi service/controller
 * để error.middleware có thể map đúng status code.
 *
 * @example
 *   throw new AppError('Course not found', 404);
 *   throw new AppError('Forbidden', 403);
 *   throw new AppError('Email already exists', 409);
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.isOperational = true;

        // Preserve stack trace in V8
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
