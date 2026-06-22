import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../models/user.js'
import mongoose from "mongoose";
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError('Unauthorized: No token provided', 401));
    }

    const token = authHeader.split(" ")[1]

    const secret = env.JWT_SECRET
    if (!secret) {
        return next(new AppError('JWT_SECRET not configured', 500));
    }
    
    let decoded: JwtPayload

    try {
        decoded = jwt.verify(token, secret) as JwtPayload
    } catch (error) {
        const reason = (error as any).name === 'TokenExpiredError' ? 'Token expired' : 'Token invalid or malformed'
        return next(new AppError(`Unauthorized: ${reason}`, 401));
    }
    const user = await User.findById(decoded.sub)
    if (!user) {
        return next(new AppError('Unauthorized: User not found', 401));
    }
    if (user.isActive === false) {
        return next(new AppError('Account is deactivated', 403));
    }
    req.user = {
        _id: new mongoose.Types.ObjectId(user._id as string),
        id: user.id,
        role: user.role,
    }
    next()
}
export default authMiddleware;
