import { Enrollment } from '../models/enrollment.js';
import { AppError } from '../utils/AppError.js';

export const enrollInCourse = async (userId: string | undefined, courseId: string) => {
    if (!userId) throw new AppError('Unauthorized', 401);
    const enrollment = new Enrollment({ userId, courseId });
    return await enrollment.save();
};

export const getUserEnrollments = async (userId: string | undefined) => {
    if (!userId) throw new AppError('Unauthorized', 401);
    return await Enrollment
        .find({ userId })
        .populate('courseId')
        .sort({ enrollmentAt: -1 });
};

export const checkUserEnrollment = async (userId: string | undefined, courseId: string) => {
    if (!userId) throw new AppError('Unauthorized', 401);
    const enrollment = await Enrollment.findOne({ userId, courseId });
    return { isEnrolled: !!enrollment };
};