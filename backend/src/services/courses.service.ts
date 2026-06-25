import { Course } from '../models/course.js';
import { LessonModule } from '../models/lessonModule.js';
import { CreateCourseInput, UpdateCourseInput } from '../schemas/course.schema.js';
import { deleteFile } from '../config/cloudinary.config.js';
import { deleteLessonModule } from './lessonModule.service.js';
import { redisClient } from '../lib/redis.js';
import { AppError } from '../utils/AppError.js';
import { buildPaginatedResult, IPaginatedResult } from '../utils/pagination.js';

interface UpdateCourseBody extends UpdateCourseInput {
    thumbnail?: string;
}

export interface GetAllCoursesOptions {
    search?: string;
    level?: string;
    page?: number;
    limit?: number;
}

const COURSE_CACHE_TTL_SECONDS = 300;
const COURSE_LIST_CACHE_PREFIX = 'courses:list:';
const COURSE_DETAIL_CACHE_PREFIX = 'courses:id:';

const getListCacheKey = (search?: string, level?: string, page = 1, limit = 12): string =>
    `${COURSE_LIST_CACHE_PREFIX}search=${search?.trim().toLowerCase() || ''}&level=${level || ''}&page=${page}&limit=${limit}`;

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

export const getAllCourses = async ({
    search,
    level,
    page = 1,
    limit = 12,
}: GetAllCoursesOptions = {}): Promise<IPaginatedResult<any>> => {
    const cacheKey = getListCacheKey(search, level, page, limit);
    const cached = await getCachedJson<IPaginatedResult<any>>(cacheKey);
    if (cached) return cached;

    const filter: Record<string, any> = {};

    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    if (level) {
        filter.level = level;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Course.countDocuments(filter),
    ]);

    const result = buildPaginatedResult(items, total, page, limit);
    await setCachedJson(cacheKey, result);
    return result;
};

export const getCourseById = async (courseId: string) => {
    const cacheKey = getDetailCacheKey(courseId);
    const cachedCourse = await getCachedJson(cacheKey);
    if (cachedCourse) {
        return cachedCourse;
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new AppError('Course not found', 404);
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
    await invalidateCourseCaches(newCourse._id.toString());
    return newCourse;
};

export const updateCourse = async (courseId: string, updateData: UpdateCourseBody) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new AppError('Course not found', 404);
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
        throw new AppError('Course not found', 404);
    }

    if (course.thumbnail) {
        await deleteFile(course.thumbnail);
    }

    const modules = await LessonModule.find({ courseId });
    for (const module of modules) {
        const moduleId = module._id.toString();
        await deleteLessonModule(moduleId);
    }

    await course.deleteOne();
    await invalidateCourseCaches(courseId);
    return { message: 'Course deleted successfully' };
};