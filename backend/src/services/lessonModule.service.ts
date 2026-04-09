import { LessonModule } from '../models/lessonModule.js';
import { deleteLesson } from './lessons.service.js';
import { Lesson } from '../models/lesson.js';
export const getLessonModulesByCourse = async (courseId: string) => {
    return await LessonModule.find({ courseId }).sort({ order: 1 });
};

export const getLessonModuleById = async (moduleId: string) => {
    const module = await LessonModule.findById(moduleId);
    if (!module) throw new Error('Lesson module not found');
    return module;
};

export const createLessonModule = async (courseId: string, data: any) => {
    const lastModule = await LessonModule.findOne({ courseId }).sort({ order: -1 });
    const newOrder = lastModule ? lastModule.order + 1 : 1;
    const newLessonModule = new LessonModule({
        ...data,
        courseId,
        order: newOrder,
    });
    return await newLessonModule.save();
};

export const updateLessonModule = async (moduleId: string, data: any) => {
    const updatedModule = await LessonModule.findByIdAndUpdate(moduleId, data, { new: true });
    if (!updatedModule) throw new Error('Lesson module not found');
    return updatedModule;
};

export const deleteLessonModule = async (moduleId: string) => {
    const module = await LessonModule.findById(moduleId);
    if (!module) throw new Error('Lesson module not found');

    // Xóa tất cả lessons trong module
    const lessons = await Lesson.find({ lessonModule: moduleId });
    for (const lesson of lessons) {
        const lessonId = lesson._id as string;
        await deleteLesson(lessonId);
    }

    await module.deleteOne();
    return { message: 'Lesson module deleted successfully' };
};