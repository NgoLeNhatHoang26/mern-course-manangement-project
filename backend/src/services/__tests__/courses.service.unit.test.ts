import { beforeEach, describe, expect, it, vi } from 'vitest';

const courseStatics = vi.hoisted(() => ({
    find: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
}));
const lessonModuleMocks = vi.hoisted(() => ({
    find: vi.fn(),
}));
const CourseMock = vi.hoisted(() =>
    vi.fn().mockImplementation((data) => ({
      ...data,
      _id: 'c1',
      save: vi.fn().mockResolvedValue(undefined),
      deleteOne: vi.fn().mockResolvedValue(undefined),
    }))
);

Object.assign(CourseMock, {
    find: courseStatics.find,
    findById: courseStatics.findById,
});

vi.mock('../../models/course.js', () => ({
    Course: CourseMock,
}));
vi.mock('../../lib/redis.js', () => ({
    redisClient: null,
}));
vi.mock('../../config/cloudinary.config.js', () => ({
    deleteFile: vi.fn(),
}));
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from '../courses.service.js';
import { object } from 'zod';
import { Course } from '../../models/course.js';
import { CreateCourseInput } from '../../schemas/course.schema.js';
import { deleteFile } from '../../config/cloudinary.config.js';
import { deleteLessonModule } from '../lessonModule.service.js';
describe('courses.service unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('filters courses by search and level', async () => {
        const mockedCourses = [
            { _id: 'c1', title: 'Node.js cơ bản', level: 'Cơ bản' },
        ];
        courseStatics.find.mockResolvedValue(mockedCourses);

        const result = await getAllCourses('node', 'Cơ bản');

        expect(courseStatics.find).toHaveBeenCalledWith({
            title: { $regex: 'node', $options: 'i' },
            level: 'Cơ bản',
        });
        expect(result).toEqual(mockedCourses);
    });

    it('should throw when course does not exist', async () => {
        courseStatics.findById.mockResolvedValue(null);
        await expect(getCourseById('c1') as any).rejects.toThrow('Course not found');    
    });  

    it.todo('createCourse persists new course with thumbnail');
    it('should persist new course with thumbnail', async () => {
        const courseData: CreateCourseInput = {
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
        };

        const saveMock = vi.fn().mockResolvedValue(undefined);

        const thumbnail: string = 'https://example.com/thumbnail.jpg';

        const createdCourse = {
            _id: 'c1',
            ...courseData,
            thumbnail,
            save: saveMock,
        }

        CourseMock.mockImplementation(() => createdCourse);

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
    it.todo('updateCourse applies partial updates only');
    it('should apply partial updates only', async () => {
        const MockCourse = {
            _id: 'c1',
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
            thumbnail: 'https://example.com/thumbnail.jpg',
        };
        const updateData = {
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
            thumbnail: 'https://example.com/thumbnail2.jpg',
        }
        const MockNewThumbnail: string = 'https://example.com/thumbnail2.jpg';
        const updatedCourse = await updateCourse('c1', {
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
            thumbnail: MockNewThumbnail,
        });
       
        
    });
    it.todo('deleteCourse removes course by id');
    it('should throw when course does not exist', async () => {
        courseStatics.findById.mockResolvedValue(null);
        await expect(deleteCourse('c1') as any).rejects.toThrow('Course not found');
    });
    it('should remove course by id', async () => {
        const MockCourse = {
            _id: 'c1',
            title: 'Node.js cơ bản',
            description: 'Node.js cơ bản',
            level: 'Cơ bản',
            instructor: 'John Doe',
        };
        const thumbnail: string = 'https://example.com/thumbnail3.jpg';

        courseStatics.findById.mockResolvedValue(MockCourse);
        expect(courseStatics.findById).toHaveBeenCalledWith('c1');
        const deleteThumbnail = await deleteFile(thumbnail);
        expect(deleteFile).toHaveBeenCalledWith(thumbnail);
        expect(deleteThumbnail).toEqual(undefined);
        const mockModules = [
            { _id: 'm1', courseId: 'c1', title: 'Module 1' },
            { _id: 'm2', courseId: 'c1', title: 'Module 2' },
        ];
        lessonModuleMocks.find.mockResolvedValue(mockModules);
        expect(lessonModuleMocks.find).toHaveBeenCalledWith({ courseId: 'c1' });
        for (const module of mockModules) {
            const deleteModule = await deleteLessonModule(module._id as string);
        }
        expect(deleteLessonModule).toHaveBeenCalledWith('m1');
        expect(deleteLessonModule).toHaveBeenCalledWith('m2');
        const deleteCourseResult = await deleteCourse('c1');
        expect(deleteCourseResult).toEqual({ message: 'Course deleted successfully' });
    });
});
