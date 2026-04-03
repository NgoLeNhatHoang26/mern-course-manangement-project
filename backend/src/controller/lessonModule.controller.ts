import { NextFunction, Request, Response } from 'express';
import { getLessonModulesByCourse, getLessonModuleById, createLessonModule, updateLessonModule, deleteLessonModule } from '../services/lessonModule.service.js';

export const getLessonModulesByCourseController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courseId = req.params.courseId;
        const lessonModules = await getLessonModulesByCourse(courseId);
        res.json(lessonModules);
    } catch (error) {
        next(error);
    }
};

export const getLessonModuleByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const module = await getLessonModuleById(req.params.moduleId);
        res.json(module);
    } catch (error) {
        if ((error as Error).message === 'Lesson module not found') {
            res.status(404).json({ message: 'Lesson module not found' });
            return;
        }
        next(error);
    }
};

export const createLessonModuleController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params;
        const savedLessonModule = await createLessonModule(courseId, req.body);
        res.status(201).json(savedLessonModule);
    } catch (error) {
        next(error);
    }
};

export const updateLessonModuleController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { moduleId } = req.params as { moduleId: string };
        const updatedModule = await updateLessonModule(moduleId, req.body);
        res.json(updatedModule);
    } catch (error) {
        if ((error as Error).message === 'Lesson module not found') {
            res.status(404).json({ message: 'Lesson module not found' });
            return;
        }
        next(error);
    }
};

export const deleteLessonModuleController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { moduleId } = req.params as { moduleId: string };
        const result = await deleteLessonModule(moduleId);
        res.json(result);
    } catch (error) {
        if ((error as Error).message === 'Lesson module not found') {
            res.status(404).json({ message: 'Lesson module not found' });
            return;
        }
        next(error);
    }
};