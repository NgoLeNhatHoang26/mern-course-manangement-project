import {User} from '../models/user.ts'
import {Course} from '../models/course.ts'
import {Enrollment} from '../models/enrollment.ts'
import { Review } from '../models/review.ts'
export const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password')
    res.json(users)
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: 'Invalid user ID' })
    }
}
export const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select("-password");
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
}
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalCourses = await Course.countDocuments()
        const totalEnrollments = await Enrollment.countDocuments()
        const totalReviews = await Review.countDocuments()
        res.json({
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalReviews
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}