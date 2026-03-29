import {NextFunction, Request, Response} from 'express'
import { Lesson } from '../models/lesson.js'

export const getLessonById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId)
        if (!lesson) {
            res.status(404).json({ message: 'Lesson is not found' })
            return
        }
        res.status(200).json(lesson)
    } catch (error) {
        next(error)
    }
}

export const getLessonsByModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.moduleId
        const lessons = await Lesson.find({ moduleId: id }).sort({ order: 1 })
        res.json(lessons)
    } catch (error) {
        next(error)
    }
}

export const createLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { moduleId } = req.params
        const videoUrl = req.file?.path
        const lastLesson = await Lesson.findOne({ moduleId }).sort({ order: -1 })
        const newOrder = lastLesson ? lastLesson.order + 1 : 1
        const newLesson = new Lesson({
            ...req.body,
            moduleId,
            order: newOrder,
            ...(videoUrl && { videoUrl })
        })
        const savedLesson = await newLesson.save()
        res.status(201).json(savedLesson)
    } catch (error) {
        next(error)
    }
}

export const updateLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { lessonId } = req.params
        const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, req.body, { new: true })
        if (!updatedLesson) {
            res.status(404).json({ message: 'Lesson not found' })
            return
        }
        res.json(updatedLesson)
    } catch (error) {
        next(error)
    }
}

export const deleteLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { lessonId } = req.params
        const deletedLesson = await Lesson.findByIdAndDelete(lessonId)
        if (!deletedLesson) {
            res.status(404).json({ message: 'Lesson not found' })
            return
        }
        res.json({ message: 'Lesson deleted successfully' })
    } catch (error) {
        next(error)
    }
}