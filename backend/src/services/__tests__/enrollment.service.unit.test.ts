import { beforeEach, describe, expect, it, vi } from 'vitest';

const enrollmentStatics = vi.hoisted(() => ({
    find: vi.fn(),
    findOne: vi.fn(),
}));

const EnrollmentMock = vi.hoisted(() =>
    vi.fn(function (this: unknown, data: Record<string, unknown>) {
        return {
            ...data,
            _id: 'e1',
            save: vi.fn().mockResolvedValue(undefined),
        };
    }),
);

Object.assign(EnrollmentMock, {
    find: enrollmentStatics.find,
    findOne: enrollmentStatics.findOne,
});

vi.mock('../../models/enrollment.js', () => ({
    Enrollment: EnrollmentMock,
}));

import {
    checkUserEnrollment,
    enrollInCourse,
    getUserEnrollments,
} from '../enrollment.service.js';

describe('enrollment.service unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('enrollInCourse', () => {
        it('creates enrollment for valid user and course', async () => {
            enrollmentStatics.findOne.mockResolvedValue(null);
            const createdEnrollment = {
                _id: 'e1',
                userId: 'u1',
                courseId: 'c1',
            };
            const saveMock = vi.fn().mockResolvedValue(createdEnrollment);

            EnrollmentMock.mockImplementation(function () {
                return { ...createdEnrollment, save: saveMock };
            });

            const result = await enrollInCourse('u1', 'c1');

            expect(enrollmentStatics.findOne).toHaveBeenCalledWith({ userId: 'u1', courseId: 'c1' });
            expect(EnrollmentMock).toHaveBeenCalledWith({ userId: 'u1', courseId: 'c1' });
            expect(saveMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(createdEnrollment);
        });

        it('throws Unauthorized when userId is missing', async () => {
            await expect(enrollInCourse(undefined, 'c1')).rejects.toThrow('Unauthorized');
            expect(enrollmentStatics.findOne).not.toHaveBeenCalled();
            expect(EnrollmentMock).not.toHaveBeenCalled();
        });

        it('throws 409 when enrollment already exists', async () => {
            enrollmentStatics.findOne.mockResolvedValue({ _id: 'e1', userId: 'u1', courseId: 'c1' });

            await expect(enrollInCourse('u1', 'c1')).rejects.toMatchObject({
                message: 'Already enrolled in this course',
                statusCode: 409,
            });
            expect(EnrollmentMock).not.toHaveBeenCalled();
        });

        it('throws 409 when save fails with duplicate key', async () => {
            enrollmentStatics.findOne.mockResolvedValue(null);
            const duplicateError = Object.assign(new Error('E11000 duplicate key'), { code: 11000 });
            const saveMock = vi.fn().mockRejectedValue(duplicateError);

            EnrollmentMock.mockImplementation(function () {
                return { _id: 'e1', userId: 'u1', courseId: 'c1', save: saveMock };
            });

            await expect(enrollInCourse('u1', 'c1')).rejects.toMatchObject({
                message: 'Already enrolled in this course',
                statusCode: 409,
            });
            expect(saveMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserEnrollments', () => {
        it('returns populated user enrollments sorted by enrollmentAt desc', async () => {
            const enrollments = [
                { _id: 'e1', userId: 'u1', courseId: { _id: 'c1', title: 'Node.js' } },
            ];
            const sortMock = vi.fn().mockResolvedValue(enrollments);
            const populateMock = vi.fn().mockReturnValue({ sort: sortMock });

            enrollmentStatics.find.mockReturnValue({ populate: populateMock } as never);

            const result = await getUserEnrollments('u1');

            expect(enrollmentStatics.find).toHaveBeenCalledWith({ userId: 'u1' });
            expect(populateMock).toHaveBeenCalledWith('courseId');
            expect(sortMock).toHaveBeenCalledWith({ enrollmentAt: -1 });
            expect(result).toEqual(enrollments);
        });

        it('throws Unauthorized when userId is missing', async () => {
            await expect(getUserEnrollments(undefined)).rejects.toThrow('Unauthorized');
            expect(enrollmentStatics.find).not.toHaveBeenCalled();
        });
    });

    describe('checkUserEnrollment', () => {
        it('returns isEnrolled true when enrollment exists', async () => {
            enrollmentStatics.findOne.mockResolvedValue({ _id: 'e1', userId: 'u1', courseId: 'c1' });

            const result = await checkUserEnrollment('u1', 'c1');

            expect(enrollmentStatics.findOne).toHaveBeenCalledWith({ userId: 'u1', courseId: 'c1' });
            expect(result).toEqual({ isEnrolled: true });
        });

        it('returns isEnrolled false when enrollment does not exist', async () => {
            enrollmentStatics.findOne.mockResolvedValue(null);

            const result = await checkUserEnrollment('u1', 'c1');

            expect(result).toEqual({ isEnrolled: false });
        });

        it('throws Unauthorized when userId is missing', async () => {
            await expect(checkUserEnrollment(undefined, 'c1')).rejects.toThrow('Unauthorized');
            expect(enrollmentStatics.findOne).not.toHaveBeenCalled();
        });
    });
});
