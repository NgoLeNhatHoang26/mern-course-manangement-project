import {NextFunction, Request, Response} from 'express'
import { LessonModule } from '../models/lessonModule.js'

export const getLessonModulesByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courseId = req.params.courseId
        const lessonModules = await LessonModule.find({ courseId }).sort({ order: 1 })
        res.json(lessonModules)
    } catch (error) {
        next(error)
    }
}

export const getLessonModuleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lessonModule = await LessonModule.findById(req.params.moduleId)
        if (!lessonModule) {
            res.status(404).json({ message: 'Lesson module not found' })
            return
        }
        res.json(lessonModule)
    } catch (error) {
        next(error)
    }
}

export const createLessonModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params
        const lastModule = await LessonModule.findOne({ courseId }).sort({ order: -1 })
        const newOrder = lastModule ? lastModule.order + 1 : 1
        const newLessonModule = new LessonModule({
            ...req.body,
            courseId,
            order: newOrder,
        })
        const savedLessonModule = await newLessonModule.save()
        res.status(201).json(savedLessonModule)
    } catch (error) {
        next(error)
    }
}

export const updateLessonModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { moduleId } = req.params
        const updatedModule = await LessonModule.findByIdAndUpdate(moduleId, req.body, { new: true })
        if (!updatedModule) {
            res.status(404).json({ message: 'Lesson module not found' })
            return
        }
        res.json(updatedModule)
    } catch (error) {
        next(error)
    }
}

export const deleteLessonModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { moduleId } = req.params
        const deletedModule = await LessonModule.findByIdAndDelete(moduleId)
        if (!deletedModule) {
            res.status(404).json({ message: 'Lesson module not found' })
            return
        }
        res.json({ message: 'Lesson module deleted successfully' })
    } catch (error) {
        next(error)
    }
}