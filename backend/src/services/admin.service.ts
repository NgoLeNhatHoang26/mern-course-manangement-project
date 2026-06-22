import { User } from '../models/user.js';
import { Course } from '../models/course.js';
import { Enrollment } from '../models/enrollment.js';
import { Review } from '../models/review.js';
import { AppError } from '../utils/AppError.js';
import { buildPaginatedResult, IPaginatedResult } from '../utils/pagination.js';

export interface GetAllUsersOptions {
    page?: number;
    limit?: number;
}

export const getAllUsers = async ({ page = 1, limit = 20 }: GetAllUsersOptions = {}): Promise<IPaginatedResult<any>> => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(),
    ]);

    const userIds = users.map((u) => u._id);
    const enrollmentCounts = await Enrollment.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', enrollmentCount: { $sum: 1 } } },
    ]);
    const enrollmentMap = new Map(enrollmentCounts.map((item) => [item._id.toString(), item.enrollmentCount]));

    const items = users.map((user) => ({
        ...user.toObject(),
        enrollmentCount: enrollmentMap.get(user._id.toString()) || 0,
    }));

    return buildPaginatedResult(items, total, page, limit);
};

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new AppError('User not found', 404);
    return user;
};

export const updateUserRole = async (userId: string, role: string) => {
    if (!['user', 'admin'].includes(role)) {
        throw new AppError('Invalid role', 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    ).select('-password');

    if (!updatedUser) throw new AppError('User not found', 404);
    return updatedUser;
};

export const toggleUserStatus = async (userId: string, currentUserId: string) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    if (user._id.toString() === currentUserId) {
        throw new AppError('Cannot deactivate your own account', 400);
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
    if (!deletedUser) throw new AppError('User not found', 404);
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