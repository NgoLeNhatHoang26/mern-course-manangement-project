import {Request, Response, NextFunction} from "express";
import { AppError } from '../utils/AppError.js';

const roleMiddleware = (...allowedRoles: string[]) => {

    return (req:Request, res: Response, next: NextFunction) => {

        if (!req.user) {
            return next(new AppError('Unauthorized: User not authenticated', 401));
        }

        const userRole = req.user.role

        const isAllowed = allowedRoles.includes(userRole)

        if (!isAllowed) {
            return next(new AppError('Forbidden: User not allowed to authenticated', 403));
        }

        next()
    }

}

export default roleMiddleware;
