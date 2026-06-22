import { beforeEach, describe, expect, it, vi } from 'vitest';

const courseStatics = vi.hoisted(() => ({
    find: vi.fn(),
    findById: vi.fn(),
    countDocuments: vi.fn(),
}));

const lessonModuleMocks = vi.hoisted(() => ({
    find: vi.fn(),
}));

const CourseMock = vi.hoisted(() =>
    vi.fn(function (this: unknown, data: Record<string, unknown>) {
        return {
            ...data,
            _id: 'c1',
            save: vi.fn().mockResolvedValue(undefined),
            deleteOne: vi.fn().mockResolvedValue(undefined),
        };
    }),
);

Object.assign(CourseMock, {
    find: courseStatics.find,
    findById: courseStatics.findById,
    countDocuments: courseStatics.countDocuments,
});

vi.mock('../../models/course.js', () => ({
    Course: CourseMock,
}));

vi.mock('../../models/lessonModule.js', () => ({
    LessonModule: {
        find: lessonModuleMocks.find,
    },
}));

vi.mock('../../lib/redis.js', () => ({
    redisClient: null,
}));

vi.mock('../../config/cloudinary.config.js', () => ({
    deleteFile: vi.fn(),
}));

vi.mock('../lessonModule.service.js', () => ({
    deleteLessonModule: vi.fn().mockResolvedValue(undefined),
}));

import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from '../courses.service.js';
import { CreateCourseInput } from '../../schemas/course.schema.js';
import { deleteFile } from '../../config/cloudinary.config.js';
import { deleteLessonModule } from '../lessonModule.service.js';

const makeFindQuery = (result: unknown[]) => ({
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(result),
});

describe('courses.service unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllCourses', () => {
        it('returns paginated result with correct items and pagination meta', async () => {
            const mockedCourses = [{ _id: 'c1', title: 'Node.js cơ bản', level: 'Cơ bản' }];
            courseStatics.find.mockReturnValue(makeFindQuery(mockedCourses));
            courseStatics.countDocuments.mockResolvedValue(1);

            const result = await getAllCourses({ search: 'node', level: 'Cơ bản' });

            expect(courseStatics.find).toHaveBeenCalledWith({
                title: { $regex: 'node', $options: 'i' },
                level: 'Cơ bản',
            });
            expect(courseStatics.countDocuments).toHaveBeenCalledWith({
                title: { $regex: 'node', $options: 'i' },
                level: 'Cơ bản',
            });
            expect(result.items).toEqual(mockedCourses);
            expect(result.pagination).toMatchObject({
                page: 1,
                limit: 12,
                total: 1,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            });
        });

        it('applies correct skip for page 2', async () => {
            const query = makeFindQuery([]);
            courseStatics.find.mockReturnValue(query);
            courseStatics.countDocuments.mockResolvedValue(25);

            await getAllCourses({ page: 2, limit: 12 });

            expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(query.skip).toHaveBeenCalledWith(12);
            expect(query.limit).toHaveBeenCalledWith(12);
        });

        it('sets hasNextPage true when there are more items', async () => {
            courseStatics.find.mockReturnValue(makeFindQuery([]));
            courseStatics.countDocuments.mockResolvedValue(25);

            const result = await getAllCourses({ page: 1, limit: 12 });

            expect(result.pagination.hasNextPage).toBe(true);
            expect(result.pagination.totalPages).toBe(3);
        });

        it('returns empty items when no courses match filter', async () => {
            courseStatics.find.mockReturnValue(makeFindQuery([]));
            courseStatics.countDocuments.mockResolvedValue(0);

            const result = await getAllCourses({ search: 'nonexistent' });

            expect(result.items).toHaveLength(0);
            expect(result.pagination.total).toBe(0);
            expect(result.pagination.hasNextPage).toBe(false);
        });
    });

    it('should throw when course does not exist', async () => {
        courseStatics.findById.mockResolvedValue(null);
        await expect(getCourseById('c1')).rejects.toThrow('Course not found');
    });

    it('should persist new course with thumbnail', async () => {
        const courseData: CreateCourseInput = {
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
        };

        const saveMock = vi.fn().mockResolvedValue(undefined);
        const thumbnail = 'https://example.com/thumbnail.jpg';

        const createdCourse = {
            _id: 'c1',
            ...courseData,
            thumbnail,
            save: saveMock,
            deleteOne: vi.fn().mockResolvedValue(undefined),
        };

        CourseMock.mockImplementation(function () {
            return createdCourse;
        });

        const result = await createCourse(courseData, thumbnail);

        expect(CourseMock).toHaveBeenCalledWith({
            title: courseData.title,
            description: courseData.description,
            level: courseData.level,
            instructor: courseData.instructor,
            thumbnail,
        });
        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual(createdCourse);
    });

    it('should apply partial updates only', async () => {
        const saveMock = vi.fn().mockResolvedValue(undefined);
        const mockCourse = {
            _id: 'c1',
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
            thumbnail: 'https://example.com/thumbnail.jpg',
            save: saveMock,
        };

        courseStatics.findById.mockResolvedValue(mockCourse);

        const result = await updateCourse('c1', {
            title: 'Node.js nâng cao',
            thumbnail: 'https://example.com/thumbnail2.jpg',
        });

        expect(courseStatics.findById).toHaveBeenCalledWith('c1');
        expect(deleteFile).toHaveBeenCalledWith('https://example.com/thumbnail.jpg');
        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(result.title).toBe('Node.js nâng cao');
        expect(result.thumbnail).toBe('https://example.com/thumbnail2.jpg');
    });

    it('should throw when deleting non-existent course', async () => {
        courseStatics.findById.mockResolvedValue(null);
        await expect(deleteCourse('c1')).rejects.toThrow('Course not found');
    });

    it('should remove course by id', async () => {
        const deleteOneMock = vi.fn().mockResolvedValue(undefined);
        const mockCourse = {
            _id: 'c1',
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
            thumbnail: 'https://example.com/thumbnail3.jpg',
            deleteOne: deleteOneMock,
        };
        const mockModules = [
            { _id: 'm1', courseId: 'c1', title: 'Module 1' },
            { _id: 'm2', courseId: 'c1', title: 'Module 2' },
        ];

        courseStatics.findById.mockResolvedValue(mockCourse);
        lessonModuleMocks.find.mockResolvedValue(mockModules);

        const result = await deleteCourse('c1');

        expect(courseStatics.findById).toHaveBeenCalledWith('c1');
        expect(deleteFile).toHaveBeenCalledWith('https://example.com/thumbnail3.jpg');
        expect(lessonModuleMocks.find).toHaveBeenCalledWith({ courseId: 'c1' });
        expect(deleteLessonModule).toHaveBeenCalledWith('m1');
        expect(deleteLessonModule).toHaveBeenCalledWith('m2');
        expect(deleteOneMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ message: 'Course deleted successfully' });
    });
});
