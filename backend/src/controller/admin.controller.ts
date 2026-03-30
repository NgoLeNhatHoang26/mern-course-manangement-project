import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.js'
import { Course } from '../models/course.js'
import { Enrollment } from '../models/enrollment.js'
import { Review } from '../models/review.js'
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find().select('-password')

        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const enrollmentCount = await Enrollment.countDocuments({ userId: user._id })
                return {
                    ...user.toObject(),
                    enrollmentCount,
                }
            })
        )

        res.json(usersWithStats)
    } catch (error) {
        next(error)
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

export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params
        const { role } = req.body

        if (!['user', 'admin'].includes(role)) {
            res.status(400).json({ message: 'Role không hợp lệ' })
            return
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
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

export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params

        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({message: 'User not found'})
            return
        }

        if (user._id.toString() === req.user?.id) {
            res.status(400).json({message: 'Không thể khóa tài khoản của chính mình'})
            return
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {isActive: !user.isActive},
            {new: true}
        ).select('-password')

        res.json(updatedUser)
    } catch (error) {
        next(error)
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

export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const [totalUsers, totalCourses, totalEnrollments, totalReviews] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments(),
            Review.countDocuments(),
        ])

        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const enrollmentsByMonth = await Enrollment.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ])

        const topCourses = await Enrollment.aggregate([
            { $group: { _id: '$courseId', enrollmentCount: { $sum: 1 } } },
            { $sort: { enrollmentCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'course',
                },
            },
            { $unwind: '$course' },
            {
                $project: {
                    _id: 0,
                    enrollmentCount: 1,
                    title: '$course.title',
                    instructor: '$course.instructor',
                    level: '$course.level',
                    ratingAverage: '$course.ratingAverage',
                },
            },
        ])

        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5)

        res.json({
            stats: { totalUsers, totalCourses, totalEnrollments, totalReviews },
            enrollmentsByMonth,
            topCourses,
            recentUsers,
        })
    } catch (error) {
        next(error)
    }
}