import {Request, Response, NextFunction} from "express";

const roleMiddleware = (...allowedRoles: string[]) => {

    return (req:Request, res: Response, next: NextFunction) => {

        // Kiểm tra req.user có tồn tại không
        // Nếu không có → có thể authMiddleware chưa chạy
        // return 401 Unauthorized

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized: User not authenticated"
            })
        }

        // Lấy role của user từ req.user
        // const userRole = req.user.role

        const userRole = req.user.role

        // Kiểm tra role của user có nằm trong allowedRoles không
        // allowedRoles là mảng các role được phép

        const isAllowed = allowedRoles.includes(userRole)

        // Nếu role không hợp lệ → return 403 Forbidden

        if (!isAllowed) {
            return res.status(403).json({
                message: "Forbidden: User not allowed to authenticated"
            })
        }

        // Nếu role hợp lệ → gọi next()
        next()
    }

}

export default roleMiddleware;