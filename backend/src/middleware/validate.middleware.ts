import { Request, Response, NextFunction } from 'express'
import { ZodType, ZodError } from 'zod'
import { logger } from '../config/logger.js';

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            logger.debug({ issues: result.error.issues }, 'Validation failed')
            res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                errors: (result.error as ZodError).issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            })
            return
        }
        req.body = result.data
        next()
    }
}