import { beforeEach, describe, expect, it, vi } from 'vitest';

const reviewStatics = vi.hoisted(() => ({
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
}));

const ReviewMock = vi.hoisted(() =>
    vi.fn(function (this: unknown, data: Record<string, unknown>) {
        return {
            ...data,
            _id: 'r1',
            save: vi.fn().mockResolvedValue(undefined),
        };
    }),
);

Object.assign(ReviewMock, {
    find: reviewStatics.find,
    findById: reviewStatics.findById,
    findByIdAndUpdate: reviewStatics.findByIdAndUpdate,
    findOneAndDelete: reviewStatics.findOneAndDelete,
});

vi.mock('../../models/review.js', () => ({
    Review: ReviewMock,
}));

import {
    createReview,
    deleteReview,
    getAllReviews,
    updateReview,
} from '../review.service.js';

describe('review.service unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllReviews', () => {
        it('returns all reviews for a course', async () => {
            const reviews = [
                {
                    _id: 'r1',
                    courseId: 'c1',
                    userId: { userName: 'alice' },
                    rating: 5,
                    comment: 'Great course',
                },
            ];
            const sortMock = vi.fn().mockResolvedValue(reviews);
            const populateMock = vi.fn().mockReturnValue({ sort: sortMock });

            reviewStatics.find.mockReturnValue({ populate: populateMock } as never);

            const result = await getAllReviews('c1');

            expect(reviewStatics.find).toHaveBeenCalledWith({ courseId: 'c1' });
            expect(populateMock).toHaveBeenCalledWith('userId', 'userName');
            expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result).toEqual(reviews);
        });
    });

    describe('createReview', () => {
        it('creates review for authenticated user', async () => {
            const reviewData = { rating: 5, comment: 'Excellent' };
            const savedReview = {
                _id: 'r1',
                userId: 'u1',
                courseId: 'c1',
                ...reviewData,
            };
            const saveMock = vi.fn().mockResolvedValue(savedReview);

            ReviewMock.mockImplementation(function () {
                return { ...savedReview, save: saveMock };
            });

            const result = await createReview('c1', 'u1', reviewData);

            expect(ReviewMock).toHaveBeenCalledWith({
                ...reviewData,
                userId: 'u1',
                courseId: 'c1',
            });
            expect(saveMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(savedReview);
        });

        it('throws Unauthorized when userId is missing', async () => {
            await expect(createReview('c1', undefined, { rating: 5, comment: 'x' }))
                .rejects
                .toMatchObject({ message: 'Unauthorized', statusCode: 401 });
            expect(ReviewMock).not.toHaveBeenCalled();
        });
    });

    describe('updateReview', () => {
        it('allows owner to update own review', async () => {
            const existingReview = {
                _id: 'r1',
                userId: { toString: () => 'u1' },
            };
            const updatedReview = {
                _id: 'r1',
                userId: 'u1',
                rating: 4,
                comment: 'Updated comment',
            };

            reviewStatics.findById.mockResolvedValue(existingReview);
            reviewStatics.findByIdAndUpdate.mockResolvedValue(updatedReview);

            const result = await updateReview('r1', 'u1', { rating: 4, comment: 'Updated comment' });

            expect(reviewStatics.findById).toHaveBeenCalledWith('r1');
            expect(reviewStatics.findByIdAndUpdate).toHaveBeenCalledWith(
                'r1',
                { rating: 4, comment: 'Updated comment' },
                { new: true },
            );
            expect(result).toEqual(updatedReview);
        });

        it('throws Forbidden when user is not the owner', async () => {
            reviewStatics.findById.mockResolvedValue({
                _id: 'r1',
                userId: { toString: () => 'u1' },
            });

            await expect(updateReview('r1', 'u2', { rating: 3 }))
                .rejects
                .toMatchObject({ message: 'Forbidden', statusCode: 403 });
            expect(reviewStatics.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it('throws Review not found when review does not exist', async () => {
            reviewStatics.findById.mockResolvedValue(null);

            await expect(updateReview('r1', 'u1', { rating: 3 }))
                .rejects
                .toMatchObject({ message: 'Review not found', statusCode: 404 });
        });
    });

    describe('deleteReview', () => {
        it('allows owner to delete review', async () => {
            reviewStatics.findById.mockResolvedValue({
                _id: 'r1',
                userId: { toString: () => 'u1' },
            });
            reviewStatics.findOneAndDelete.mockResolvedValue(undefined);

            const result = await deleteReview('r1', 'u1');

            expect(reviewStatics.findById).toHaveBeenCalledWith('r1');
            expect(reviewStatics.findOneAndDelete).toHaveBeenCalledWith({ _id: 'r1' });
            expect(result).toEqual({ message: 'Review deleted successfully' });
        });

        it('allows admin to delete review', async () => {
            reviewStatics.findById.mockResolvedValue({
                _id: 'r1',
                userId: { toString: () => 'u1' },
            });
            reviewStatics.findOneAndDelete.mockResolvedValue(undefined);

            const result = await deleteReview('r1', 'u2', 'admin');

            expect(reviewStatics.findOneAndDelete).toHaveBeenCalledWith({ _id: 'r1' });
            expect(result).toEqual({ message: 'Review deleted successfully' });
        });

        it('throws Forbidden when user is neither owner nor admin', async () => {
            reviewStatics.findById.mockResolvedValue({
                _id: 'r1',
                userId: { toString: () => 'u1' },
            });

            await expect(deleteReview('r1', 'u2', 'user'))
                .rejects
                .toMatchObject({ message: 'Forbidden', statusCode: 403 });
            expect(reviewStatics.findOneAndDelete).not.toHaveBeenCalled();
        });

        it('throws Review not found when review does not exist', async () => {
            reviewStatics.findById.mockResolvedValue(null);

            await expect(deleteReview('r1', 'u1'))
                .rejects
                .toMatchObject({ message: 'Review not found', statusCode: 404 });
        });
    });
});
