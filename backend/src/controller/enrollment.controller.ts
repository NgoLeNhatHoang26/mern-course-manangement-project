import {Request, Response, NextFunction} from 'express';
import {Enrollment} from '../models/enrollment.js';
export const enrollCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { courseId } = req.body;

        const enrollment = new Enrollment({ userId, courseId });
        const saved = await enrollment.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách course đã enroll
export const getMyEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const enrollments = await Enrollment
            .find({ userId })
            .populate("courseId")
            .sort({ enrollmentAt: -1 });
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
};

// Kiểm tra đã enroll chưa
export const checkEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { courseId } = req.params;
        const enrollment = await Enrollment.findOne({ userId, courseId });
        res.status(200).json({ isEnrolled: !!enrollment });
    } catch (error) {
        next(error);
    }
};
