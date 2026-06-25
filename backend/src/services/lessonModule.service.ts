import { LessonModule } from '../models/lessonModule.js';
import { deleteLesson } from './lessons.service.js';
import { Lesson } from '../models/lesson.js';
import { AppError } from '../utils/AppError.js';
import { getNextOrder, moduleOrderScope } from '../utils/orderSequence.js';
export const getLessonModulesByCourse = async (courseId: string) => {
    return await LessonModule.find({ courseId }).sort({ order: 1 });
};

export const getLessonModuleById = async (moduleId: string) => {
    const module = await LessonModule.findById(moduleId);
    if (!module) throw new AppError('Lesson module not found', 404);
    return module;
};

export const createLessonModule = async (courseId: string, data: any) => {
    const lastModule = await LessonModule.findOne({ courseId }).sort({ order: -1 });
    const floor = lastModule?.order ?? 0;
    const newOrder = await getNextOrder(moduleOrderScope(courseId), floor);
    const newLessonModule = new LessonModule({
        ...data,
        courseId,
        order: newOrder,
    });
    return await newLessonModule.save();
};

export const updateLessonModule = async (moduleId: string, data: any) => {
    const updatedModule = await LessonModule.findByIdAndUpdate(moduleId, data, { new: true });
    if (!updatedModule) throw new AppError('Lesson module not found', 404);
    return updatedModule;
};

export const deleteLessonModule = async (moduleId: string) => {
    const module = await LessonModule.findById(moduleId);
    if (!module) throw new AppError('Lesson module not found', 404);

    // Xóa tất cả lessons trong module
    const lessons = await Lesson.find({ moduleId });
    for (const lesson of lessons) {
        const lessonId = lesson._id.toString();
        await deleteLesson(lessonId);
    }

    await module.deleteOne();
    return { message: 'Lesson module deleted successfully' };
};