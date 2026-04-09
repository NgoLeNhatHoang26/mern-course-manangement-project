import { Course } from '../models/course.js';
import { LessonModule } from '../models/lessonModule.js';
import { Lesson } from '../models/lesson.js';
import { CreateCourseInput, UpdateCourseInput } from '../schemas/course.schema.js';
import { deleteFile } from '../config/cloudinary.config.js';
import { deleteLessonModule } from './lessonModule.service.js';
import { redisClient } from '../lib/redis.js';

interface UpdateCourseBody extends UpdateCourseInput {
    thumbnail?: string;
}

const COURSE_CACHE_TTL_SECONDS = 300;
const COURSE_LIST_CACHE_PREFIX = 'courses:list:';
const COURSE_DETAIL_CACHE_PREFIX = 'courses:id:';

const getListCacheKey = (search?: string, level?: string): string =>
    `${COURSE_LIST_CACHE_PREFIX}search=${search?.trim().toLowerCase() || ''}&level=${level || ''}`;

const getDetailCacheKey = (courseId: string): string => `${COURSE_DETAIL_CACHE_PREFIX}${courseId}`;

const getCachedJson = async <T>(key: string): Promise<T | null> => {
    if (!redisClient) return null;
    const cached = await redisClient.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
};

const setCachedJson = async <T>(key: string, value: T, ttlSeconds = COURSE_CACHE_TTL_SECONDS): Promise<void> => {
    if (!redisClient) return;
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

const deleteCacheByPrefix = async (prefix: string): Promise<void> => {
    if (!redisClient) return;

    let cursor = '0';
    do {
        const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
            await redisClient.del(...keys);
        }
    } while (cursor !== '0');
};

const invalidateCourseCaches = async (courseId?: string): Promise<void> => {
    await deleteCacheByPrefix(COURSE_LIST_CACHE_PREFIX);
    if (courseId && redisClient) {
        await redisClient.del(getDetailCacheKey(courseId));
    }
};

export const getAllCourses = async (search?: string, level?: string) => {
    const cacheKey = getListCacheKey(search, level);
    const cachedCourses = await getCachedJson(cacheKey);
    if (cachedCourses) {
        return cachedCourses;
    }

    const filter: Record<string, any> = {};

    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    if (level) {
        filter.level = level;
    }

    const courses = await Course.find(filter);
    await setCachedJson(cacheKey, courses);
    return courses;
};

export const getCourseById = async (courseId: string) => {
    const cacheKey = getDetailCacheKey(courseId);
    const cachedCourse = await getCachedJson(cacheKey);
    if (cachedCourse) {
        return cachedCourse;
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }
    await setCachedJson(cacheKey, course);
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
    await invalidateCourseCaches((newCourse._id as string).toString());
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
    await invalidateCourseCaches(courseId);
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
        const moduleId = module._id as string;
        await deleteLessonModule(moduleId);
    }

    await course.deleteOne();
    await invalidateCourseCaches(courseId);
    return { message: 'Course deleted successfully' };
};