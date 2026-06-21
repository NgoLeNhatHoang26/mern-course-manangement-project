import { Enrollment } from '../models/enrollment.js';
import { AppError } from '../utils/AppError.js';

const isDuplicateKeyError = (error: unknown): boolean =>
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: number }).code === 11000;

export const enrollInCourse = async (userId: string | undefined, courseId: string) => {
    if (!userId) throw new AppError('Unauthorized', 401);

    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
        throw new AppError('Already enrolled in this course', 409);
    }

    try {
        const enrollment = new Enrollment({ userId, courseId });
        return await enrollment.save();
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new AppError('Already enrolled in this course', 409);
        }
        throw error;
    }
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
