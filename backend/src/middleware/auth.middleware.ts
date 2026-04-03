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
        _id: new mongoose.Types.ObjectId(user._id as string),
        id: user.id,
        role: user.role,
    }

    next()
}

export default authMiddleware;