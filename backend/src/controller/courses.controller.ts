import { Request, Response, NextFunction } from 'express';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../services/courses.service.js';
import { CreateCourseInput, UpdateCourseInput } from '../schemas/course.schema.js';
import { parsePaginationQuery } from '../utils/pagination.js';

interface UpdateCourseBody extends UpdateCourseInput {
    thumbnail?: string;
}

export const getAllCoursesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { search, level } = req.query as { search?: string; level?: string };
        const { page, limit } = parsePaginationQuery(req.query, 12);
        const result = await getAllCourses({ search, level, page, limit });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getCourseByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await getCourseById(req.params.courseId as string);
        res.json(course);
    } catch (error) {
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
        next(error);
    }
};

export const deleteCourseController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params;
        const result = await deleteCourse(courseId as string);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
