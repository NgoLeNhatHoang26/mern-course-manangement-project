import { User } from '../models/user.js';
import { Course } from '../models/course.js';
import { Enrollment } from '../models/enrollment.js';
import { Review } from '../models/review.js';

export const getAllUsers = async () => {
    const users = await User.find().select('-password');

    const usersWithStats = await Promise.all(
        users.map(async (user) => {
            const enrollmentCount = await Enrollment.countDocuments({ userId: user._id });
            return {
                ...user.toObject(),
                enrollmentCount,
            };
        })
    );

    return usersWithStats;
};

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

export const updateUserRole = async (userId: string, role: string) => {
    if (!['user', 'admin'].includes(role)) {
        throw new Error('Role không hợp lệ');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    ).select('-password');

    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
};

export const toggleUserStatus = async (userId: string, currentUserId: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user._id.toString() === currentUserId) {
        throw new Error('Không thể khóa tài khoản của chính mình');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: !user.isActive },
        { new: true }
    ).select('-password');

    return updatedUser;
};

export const deleteUser = async (userId: string) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new Error('User not found');
    return { message: 'User deleted successfully' };
};

export const getDashboard = async () => {
    const [totalUsers, totalCourses, totalEnrollments, totalReviews] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Enrollment.countDocuments(),
        Review.countDocuments(),
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

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
    ]);

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
    ]);

    const recentUsers = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5);

    return {
        stats: { totalUsers, totalCourses, totalEnrollments, totalReviews },
        enrollmentsByMonth,
        topCourses,
        recentUsers,
    };
};