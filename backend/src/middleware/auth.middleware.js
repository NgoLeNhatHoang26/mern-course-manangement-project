import jwt from "jsonwebtoken"
import { User } from "../models/user.js"

const authMiddleware = async (req, res, next) => {

    // TODO 1
    // Lấy Authorization header từ request
    // Header sẽ có dạng:
    // Authorization: Bearer <token>

    const authHeader = req.headers.authorization
    // TODO 2
    // Kiểm tra header có tồn tại không
    // Nếu không có → return 401 Unauthorized

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(
            {message: "Unauthorized: No token provided"}
        )
    }

    // TODO 3
    // Tách token ra khỏi chuỗi "Bearer token"

    const token = authHeader.split(" ")[1]

    // TODO 4
    // Verify token bằng jwt.verify()
    // Nếu token invalid → return 401

    let decoded

    try {
        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error('JWT_SECRET not configured')
        decoded = jwt.verify(token, secret)

    } catch (error) {
        const reason = error.name === 'TokenExpiredError' ? 'Token expired' : 'Token invalid or malformed'
        return res.status(401).json(
            { message: `Unauthorized: ${reason}` }
        )
    }
    // TODO 5
    // Decode payload từ token
    // Payload thường chứa:
    // userId
    // role


    // TODO 6
    // Tìm user trong database bằng userId
    // User.findById()

    const user = await User.findById(decoded.sub)


    // TODO 7
    // Nếu user không tồn tại → return 401
    if (!user) {
        return res.status(401).json(
            {message: "Unauthorized: User not found"}
        )
    }
    // TODO 8
    // Attach user vào request
    // req.user = user

    req.user = user

    // TODO 9
    // gọi next() để đi tới controller

    next()
}

export default authMiddleware;