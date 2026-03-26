import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userName, email, password } = req.body

        if (!email || !password || !userName) {
            res.status(400).json({ message: 'Missing required fields' })
            return
        }

        const exist = await User.findOne({ email })
        if (exist) {
            res.status(400).json({ message: 'Email already exists' })
            return
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await User.create({
            userName,
            email,
            password: hashPassword,
            role: 'user',
        })

        res.status(201).json({ message: 'Register successfully' })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body || {}

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password required' })
            return
        }

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
        if (!secret) {
            res.status(500).json({ message: 'Server error: JWT_SECRET is not set in .env' })
            return
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            secret,
            { expiresIn: process.env.JWT_EXPIRES || '7d' }
        )

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

export default { register, login, getMe }