import { Request, Response, NextFunction } from 'express'
import { ZodType, ZodError } from 'zod'
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            logger.debug({ issues: result.error.issues }, 'Validation failed')
            const errors = (result.error as ZodError).issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }))
            return next(new AppError('Dữ liệu không hợp lệ', 400, errors));
        }
        req.body = result.data
        next()
    }
}
