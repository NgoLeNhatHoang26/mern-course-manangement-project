import {NextFunction, Request, Response} from 'express'
import {getLessonById, getLessonsByModule, createLesson, updateLesson, deleteLesson} from '../services/lessons.service.js'
import { CreateLessonInput, UpdateLessonInput } from '../schemas/lesson.schema.js';

export const getLessonByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lessonId = req.params.lessonId as string
        const lesson = await getLessonById(lessonId)
        if (!lesson) {
            res.status(404).json({ message: 'Lesson is not found' })
            return
        }
        res.status(200).json(lesson)
    } catch (error) {
        next(error)
    }
}

export const getLessonsByModuleController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.moduleId.toString()
        const lessons = await getLessonsByModule(id)
        res.json(lessons)
    } catch (error) {
        next(error)
    }
}

export const createLessonController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { moduleId } = req.params as { moduleId: string }
        const videoUrl = req.file?.path
        const lessonData = req.body as CreateLessonInput
        const savedLesson = await createLesson(moduleId, videoUrl, lessonData)
        res.status(201).json(savedLesson)
    } catch (error) {
        next(error)
    }
}

export const updateLessonController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { lessonId } = req.params as { lessonId: string }
        const updateData = req.body as UpdateLessonInput
        const updatedLesson = await updateLesson(lessonId, updateData)
        if (!updatedLesson) {
            res.status(404).json({ message: 'Lesson not found' })
            return
        }
        res.json(updatedLesson)
    } catch (error) {
        next(error)
    }
}

export const deleteLessonController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { lessonId } = req.params as { lessonId: string }
        const deletedLesson = await deleteLesson(lessonId)
        res.json(deletedLesson)
    } catch (error) {
        next(error)
    }
}