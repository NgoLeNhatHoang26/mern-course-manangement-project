import {Request, Response, NextFunction} from "express";

const roleMiddleware = (...allowedRoles: string[]) => {

    return (req:Request, res: Response, next: NextFunction) => {


        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized: User not authenticated"
            })
        }

        const userRole = req.user.role

        const isAllowed = allowedRoles.includes(userRole)

        if (!isAllowed) {
            return res.status(403).json({
                message: "Forbidden: User not allowed to authenticated"
            })
        }

        next()
    }

}

export default roleMiddleware;