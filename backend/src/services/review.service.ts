import { Review } from '../models/review.js';
import { AppError } from '../utils/AppError.js';

export const getAllReviews = async (courseId: string) => {
    return await Review
        .find({ courseId })
        .populate('userId', 'userName')
        .sort({ createdAt: -1 });
};

export const createReview = async (courseId: string, userId: string | undefined, reviewData: Record<string, unknown>) => {
    if (!userId) throw new AppError('Unauthorized', 401);
    const newReview = new Review({
        ...reviewData,
        userId,
        courseId,
    });
    return await newReview.save();
};

export const updateReview = async (reviewId: string, userId: string | undefined, updateData: Record<string, unknown>) => {
    if (!userId) throw new AppError('Unauthorized', 401);
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError('Review not found', 404);
    if (review.userId.toString() !== userId) throw new AppError('Forbidden', 403);

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
    if (!updatedReview) throw new AppError('Review not found', 404);
    return updatedReview;
};

export const deleteReview = async (reviewId: string, userId: string | undefined, userRole?: string) => {
    if (!userId) throw new AppError('Unauthorized', 401);
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError('Review not found', 404);

    const isOwner = review.userId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403);

    await Review.findOneAndDelete({ _id: reviewId });
    return { message: 'Review deleted successfully' };
};
