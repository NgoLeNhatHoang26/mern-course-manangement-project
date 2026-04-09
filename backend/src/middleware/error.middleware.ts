import { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Mongoose ValidationError
    if (error.name === 'ValidationError') {
        res.status(400).json({
            message: 'Dữ liệu không hợp lệ',
            errors: Object.values(error.errors).map((e: any) => e.message),
        })
        return
    }

    // Duplicate key (unique index)
    if (error.code === 11000) {
        res.status(409).json({ message: 'Dữ liệu đã tồn tại' })
        return
    }

    // JWT lỗi
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Token không hợp lệ' })
        return
    }

    // Mặc định
    res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
    })
}