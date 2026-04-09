import { Review } from '../models/review.js';

export const getAllReviews = async (courseId: string) => {
    return await Review
        .find({ courseId })
        .populate('userId', 'userName')
        .sort({ createdAt: -1 });
};

export const createReview = async (courseId: string, userId: string | undefined, reviewData: any) => {
    if (!userId) throw new Error('Unauthorized');
    const newReview = new Review({
        ...reviewData,
        userId,
        courseId,
    });
    return await newReview.save();
};

export const updateReview = async (reviewId: string, userId: string | undefined, updateData: any) => {
    if (!userId) throw new Error('Unauthorized');
    const review = await Review.findById(reviewId);
    if (!review) throw new Error('Review not found');
    if (review.userId.toString() !== userId) throw new Error('Forbidden');

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
    if (!updatedReview) throw new Error('Review not found');
    return updatedReview;
};

export const deleteReview = async (reviewId: string, userId: string | undefined, userRole?: string) => {
    if (!userId) throw new Error('Unauthorized');
    const review = await Review.findById(reviewId);
    if (!review) throw new Error('Review not found');

    const isOwner = review.userId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) throw new Error('Forbidden');

    await Review.findOneAndDelete({ _id: reviewId });
    return { message: 'Review deleted successfully' };
};