import { Request, Response, NextFunction } from 'express';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../services/courses.service.js';
import { CreateCourseInput, UpdateCourseInput } from '../schemas/course.schema.js';

interface UpdateCourseBody extends UpdateCourseInput {
    thumbnail?: string;
}

export const getAllCoursesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { search, level } = req.query as { search?: string; level?: string };
        const courses = await getAllCourses(search, level);
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

export const getCourseByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await getCourseById(req.params.courseId as string);
        res.json(course);
    } catch (error) {
        if ((error as Error).message === 'Course not found') {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        next(error);
    }
};

export const createCourseController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, description, level, instructor } = req.body as CreateCourseInput;
        const thumbnail = req.file?.path;
        const newCourse = await createCourse({ title, description, level, instructor }, thumbnail);
        res.status(201).json(newCourse);
    } catch (error) {
        if ((error as any).name === 'ValidationError') {
            res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                errors: Object.values((error as any).errors).map((e: any) => e.message),
            });
            return;
        }
        next(error);
    }
};

export const updateCourseController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params;
        const body = req.body as UpdateCourseBody;
        if (req.file) {
            body.thumbnail = req.file.path;
        }
        const updatedCourse = await updateCourse(courseId as string, body);
        res.json(updatedCourse);
    } catch (error) {
        if ((error as Error).message === 'Course not found') {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        next(error);
    }
};

export const deleteCourseController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params;
        const result = await deleteCourse(courseId as string);
        res.json(result);
    } catch (error) {
        if ((error as Error).message === 'Course not found') {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        next(error);
    }
};
