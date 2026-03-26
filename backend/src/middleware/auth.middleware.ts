import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../models/user.js'
import mongoose from "mongoose";

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    // Lấy Authorization header từ request
    // Header sẽ có dạng: Authorization: Bearer <token>

    const authHeader = req.headers.authorization;

    // Kiểm tra header có tồn tại không
    // Nếu không có → return 401 Unauthorized

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json(
            {message: "Unauthorized: No token provided"}
        )
        return
    }

    // Tách token ra khỏi chuỗi "Bearer token"

    const token = authHeader.split(" ")[1]

    // Verify token bằng jwt.verify()
    // Nếu token invalid → return 401
    const secret = process.env.JWT_SECRET
    if (!secret) {
        res.status(500).json({ message: 'JWT_SECRET not configured' })
        return
    }
    let decoded: JwtPayload

    try {
        decoded = jwt.verify(token, secret) as JwtPayload

    } catch (error) {
        const reason = (error as any).name === 'TokenExpiredError' ? 'Token expired' : 'Token invalid or malformed'
        res.status(401).json(
            { message: `Unauthorized: ${reason}` }
        )
        return
    }
    // Decode payload từ token
    // Payload thường chứa:
    // userId
    // role


    // Tìm user trong database bằng userId
    // User.findById()

    const user = await User.findById(decoded.sub)


    // Nếu user không tồn tại → return 401
    if (!user) {
        res.status(401).json(
            {message: "Unauthorized: User not found"}

        )
        return
    }
    // Attach user vào request
    // req.user = user

    req.user = {
        _id: user._id as mongoose.Types.ObjectId,
        id: user.id,
        role: user.role,
    }

    // TODO 9
    // gọi next() để đi tới controller

    next()
}

export default authMiddleware;