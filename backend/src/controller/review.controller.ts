import { NextFunction, Request, Response } from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../services/review.service.js';

export const getAllReviewsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params as { courseId: string };
        const reviews = await getAllReviews(courseId);
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

export const createReviewController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params as { courseId: string };
        const userId = req.user?._id?.toString();
        const savedReview = await createReview(courseId, userId, req.body);
        res.status(201).json(savedReview);
    } catch (error) {
        next(error);
    }
};

export const updateReviewController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reviewId } = req.params as { reviewId: string };
        const userId = req.user?._id?.toString();
        const updatedReview = await updateReview(reviewId, userId, req.body);
        res.json(updatedReview);
    } catch (error) {
        next(error);
    }
};

export const deleteReviewController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reviewId } = req.params as { reviewId: string };
        const userId = req.user?._id?.toString();
        const userRole = req.user?.role;
        const result = await deleteReview(reviewId, userId, userRole);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
