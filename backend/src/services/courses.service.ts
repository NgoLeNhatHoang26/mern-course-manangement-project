import { Course } from '../models/course.js';
import { LessonModule } from '../models/lessonModule.js';
import { Lesson } from '../models/lesson.js';
import { CreateCourseInput, UpdateCourseInput } from '../schemas/course.schema.js';
import { deleteFile } from '../config/cloudinary.config.js';
import { deleteLessonModule } from './lessonModule.service.js';

interface UpdateCourseBody extends UpdateCourseInput {
    thumbnail?: string;
}

export const getAllCourses = async (search?: string, level?: string) => {
    const filter: Record<string, any> = {};

    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    if (level) {
        filter.level = level;
    }

    const courses = await Course.find(filter);
    return courses;
};

export const getCourseById = async (courseId: string) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }
    return course;
};

export const createCourse = async (courseData: CreateCourseInput, thumbnail?: string) => {
    const newCourse = new Course({
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        instructor: courseData.instructor,
        thumbnail,
    });

    await newCourse.save();
    return newCourse;
};

export const updateCourse = async (courseId: string, updateData: UpdateCourseBody) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }

    // Nếu có thumbnail mới và cũ, xóa cũ
    if (updateData.thumbnail && course.thumbnail) {
        await deleteFile(course.thumbnail);
    }

    Object.assign(course, updateData);
    await course.save();
    return course;
};

export const deleteCourse = async (courseId: string) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }

    // Xóa thumbnail nếu có
    if (course.thumbnail) {
        await deleteFile(course.thumbnail);
    }

    // Xóa các lesson modules và lessons liên quan
    const modules = await LessonModule.find({ course: courseId });
    for (const module of modules) {
        await deleteLessonModule(module._id.toString());
    }

    await course.deleteOne();
    return { message: 'Course deleted successfully' };
};