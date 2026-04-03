import { Request, Response, NextFunction } from 'express';
import { enrollInCourse, getUserEnrollments, checkUserEnrollment } from '../services/enrollment.service.js';

export const enrollCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const { courseId } = req.body;
        const saved = await enrollInCourse(userId, courseId);
        res.status(201).json(saved);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        next(error);
    }
};

// Lấy danh sách course đã enroll
export const getMyEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const enrollments = await getUserEnrollments(userId);
        res.status(200).json(enrollments);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        next(error);
    }
};

// Kiểm tra đã enroll chưa
export const checkEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const { courseId } = req.params;
        const result = await checkUserEnrollment(userId, courseId as string);
        res.status(200).json(result);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        next(error);
    }
};
