import { Lesson } from '../models/lesson.js'
import { CreateLessonInput, UpdateLessonInput } from '../schemas/lesson.schema.js';
import { deleteFile } from '../config/cloudinary.config.js';


interface UpdateLessonBody extends UpdateLessonInput {
    videoUrl?: string;
}

export const getLessonById = async (lessonId: string) => {
    const lessson =  await Lesson.findById(lessonId);
    if (!lessson) {
        throw new Error('Lesson not found');
    }
    return lessson;
};

export const getLessonsByModule = async (moduleId : string) => {
    const lessons = await Lesson.find({ moduleId }).sort({ order: 1 });
    if (!lessons) {
        throw new Error('Lessons not found');
    }
    return lessons;
}

export const createLesson = async (moduleId: string, videoUrl: string | undefined, lessonData: CreateLessonInput) => {
    
    const lastLesson = await Lesson.findOne({ moduleId }).sort({ order: -1 })
    const newOrder = lastLesson ? lastLesson.order + 1 : 1
    const newLesson = new Lesson({
        ...lessonData,
        moduleId,
        order: newOrder,
        ...(videoUrl && { videoUrl })
    })
    await newLesson.save()
    return newLesson;
}

export const updateLesson = async (lessonId: string, updateData: UpdateLessonBody)=> {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
        throw new Error('Lesson not found')
    }
    if ( lesson?.videoUrl && updateData.videoUrl && lesson.videoUrl !== updateData.videoUrl) {
        await deleteFile(lesson.videoUrl)
    }

    Object.assign(lesson, updateData);
    await lesson.save();
    return lesson;
}

export const deleteLesson = async (lessonId: string) => {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
        throw new Error('Lesson not found')
    }
    if (lesson.videoUrl) {
        await deleteFile(lesson.videoUrl)
    }

    await lesson.deleteOne()
    return { message: 'Lesson deleted successfully' }
}