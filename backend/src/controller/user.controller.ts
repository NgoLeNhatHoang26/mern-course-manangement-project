import {NextFunction, Request, Response} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id).select('-password')
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.json(user)
    } catch (error) {
        next(error)
    }
}

export const createNewAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, userName } = req.body

        if (!email || !password || !userName) {
            res.status(400).json({ message: 'Missing required fields' })
            return
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' })
            return
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).json({ message: 'Email already exists' })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            email,
            password: hashedPassword,
            userName,
        })

        const secret = process.env.JWT_SECRET
        if (!secret) {
            res.status(500).json({ message: 'Server error: JWT_SECRET is not set in .env' })
            return
        }

        const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: '7d' })

        // _doc không có type trong Mongoose, dùng toObject() thay thế
        const { password: _, ...userData } = newUser.toObject()

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: userData,
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.json(updatedUser)
    } catch (error) {
        next(error)
    }
}