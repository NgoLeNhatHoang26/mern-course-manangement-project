import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../models/user.js'
import mongoose from "mongoose";
import { env } from '../config/env.js';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json(
            {message: "Unauthorized: No token provided"}
        )
        return
    }

    const token = authHeader.split(" ")[1]

    const secret = env.JWT_SECRET
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
    const user = await User.findById(decoded.sub)
    if (!user) {
        res.status(401).json(
            {message: "Unauthorized: User not found"}

        )
        return
    }
    req.user = {
        _id: new mongoose.Types.ObjectId(user._id as string),
        id: user.id,
        role: user.role,
    }
    next()
}
export default authMiddleware;