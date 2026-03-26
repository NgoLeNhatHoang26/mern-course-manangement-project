import { Request, Response } from 'express'
import { User } from '../models/user.js'
import { Course } from '../models/course.js'
import { Enrollment } from '../models/enrollment.js'
import { Review } from '../models/review.js'

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: 'Invalid user ID' })
    }
}

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const [totalUsers, totalCourses, totalEnrollments, totalReviews] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments(),
            Review.countDocuments(),
        ])

        res.json({ totalUsers, totalCourses, totalEnrollments, totalReviews })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}