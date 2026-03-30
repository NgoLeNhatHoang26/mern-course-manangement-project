import {Request, Response, NextFunction} from 'express';
import { Course } from "../models/course.js";
import { LessonModule } from '../models/lessonModule.js'
import { Lesson } from '../models/lesson.js'
import { CreateCourseInput, UpdateCourseInput } from '../schemas/course.schema.js'
import { deleteFile} from "../config/cloudinary.config.js";

interface UpdateCourseBody extends UpdateCourseInput {
    thumbnail?: string
}

export const getAllCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { search, level } = req.query

        const filter: Record<string, any> = {}

        if (search) {
            filter.title = { $regex: search, $options: 'i' }  // i = không phân biệt hoa thường
        }

        if (level) {
            filter.level = level
        }
        const courses = await Course.find(filter);
        res.status(200).json(courses)
    } catch (error) {
        next(error)
    }
}
export const getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        next(error)
    }
}

export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('req.body:', req.body)
        console.log('req.file:', req.file)
        const { title, description, level, instructor } = req.body as CreateCourseInput;
        const thumbnail = req.file?.path
        const newCourse = new Course({
            title,
            description,
            level,
            instructor,
            ...(thumbnail && { thumbnail }),
        })

        const savedCourse = await newCourse.save()
        res.status(201).json(savedCourse)
    } catch (error) {
        if ((error as any).name === 'ValidationError') {
            res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                errors: Object.values((error as any).errors).map((e: any) => e.message),
            })
            return
        }
        next(error)
    }
}

export const updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {courseId} = req.params
        const body = req.body as UpdateCourseBody
        if (req.file) {
            const oldCourse = await Course.findById(courseId)
            if (oldCourse?.thumbnail) {
                await deleteFile(oldCourse.thumbnail)
            }
            body.thumbnail = req.file.path
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, body, {
            new: true,
            runValidators: true,
        })
        if (!updatedCourse) {
            res.status(404).json({message: 'Course not found'})
            return
        }
        res.json(updatedCourse)
    } catch (error) {
        next(error)
    }
}
export const deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params

        const deletedCourse = await Course.findByIdAndDelete(courseId)
        if (!deletedCourse) {
            res.status(404).json({ message: 'Course not found' })
            return
        }

        const modules = await LessonModule.find({ courseId })
        const moduleIds = modules.map((m) => m._id)

        await Lesson.deleteMany({ moduleId: { $in: moduleIds } })


        await LessonModule.deleteMany({ courseId })

        res.json({ message: 'Course deleted successfully' })
    } catch (error) {
        next(error)
    }
}
