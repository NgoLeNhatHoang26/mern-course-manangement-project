import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions, JwtPayload} from 'jsonwebtoken'
import { User } from '../models/user.js'
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js'
const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userName, email, password } = req.body as RegisterInput

        const exist = await User.findOne({ email })
        if (exist) {
            res.status(400).json({ message: 'Email already exists' })
            return
        }

        const hashPassword = await bcrypt.hash(password, 10)
        await User.create({ userName, email, password: hashPassword, role: 'user' })
        res.status(201).json({ message: 'Register successfully' })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as LoginInput

        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' })
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' })
            return
        }

        const secret = process.env.JWT_SECRET

        const refreshSecret = process.env.JWT_REFRESH_SECRET

        if (!secret || !refreshSecret) {
            res.status(500).json({ message: 'Server error: JWT_SECRET is not set in .env' })
            return
        }

        const expiresIn = (process.env.JWT_EXPIRES || '15m') as SignOptions['expiresIn']

        const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn })

        // Lưu refreshToken vào DB
        const refreshToken = jwt.sign({ sub: user.id}, refreshSecret,{ expiresIn: '7d' })

        await User.findByIdAndUpdate(user.id, {refreshToken})

        // Gửi refreshToken qua httpOnly Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // JS không đọc được
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000

        })

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.userName,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json(user)
}


const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken
        if (!token) {
            res.status(401).json({ message: 'No refresh token' })
            return
        }

        const refreshSecret = process.env.JWT_REFRESH_SECRET
        if (!refreshSecret) {
            res.status(500).json({ message: 'Server error' })
            return
        }

        // Verify refresh token
        let decoded: JwtPayload

        try {
            decoded = jwt.verify(token, refreshSecret) as JwtPayload
        } catch {
            res.status(401).json({ message: 'Refresh token invalid or expired' })
            return
        }

        // Tìm user và kiểm tra refreshToken khớp không
        const user = await User.findById(decoded.sub).select('+refreshToken')
        if (!user || user.refreshToken !== token) {
            res.status(401).json({ message: 'Refresh token not recognized' })
            return
        }

        const secret = process.env.JWT_SECRET!
        const accessToken = jwt.sign(
            { sub: user.id, role: user.role },
            secret,
            { expiresIn: '15m' }
        )

        res.status(200).json({ accessToken })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken
        if (token) {
            // Xóa refreshToken trong DB
            await User.findOneAndUpdate({refreshToken: token}, {refreshToken: null})
        }

        // Xóa cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        res.status(200).json({message: 'Logged out successfully'})
    } catch (error) {
        res.status(500).json({message: (error as Error).message})
    }
}
export default { register, login,refresh, logout, getMe }