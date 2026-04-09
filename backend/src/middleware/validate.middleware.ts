import { Request, Response, NextFunction } from 'express'
import { ZodType, ZodError } from 'zod'

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            console.log('Zod errors:', result.error.issues)
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