import { NextFunction, Request, Response } from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../services/review.service.js';

export const getAllReviewsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params;
        const reviews = await getAllReviews(courseId);
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

export const createReviewController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id?.toString();
        const savedReview = await createReview(courseId, userId, req.body);
        res.status(201).json(savedReview);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if ((error as any).code === 11000) {
            res.status(409).json({ message: 'Bạn đã đánh giá khoá học này rồi' });
            return;
        }
        next(error);
    }
};

export const updateReviewController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reviewId } = req.params;
        const userId = req.user?._id?.toString();
        const updatedReview = await updateReview(reviewId, userId, req.body);
        res.json(updatedReview);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if ((error as Error).message === 'Forbidden') {
            res.status(403).json({ message: 'Không có quyền sửa review này' });
            return;
        }
        if ((error as Error).message === 'Review not found') {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        next(error);
    }
};

export const deleteReviewController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reviewId } = req.params;
        const userId = req.user?._id?.toString();
        const userRole = req.user?.role;
        const result = await deleteReview(reviewId, userId, userRole);
        res.json(result);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if ((error as Error).message === 'Forbidden') {
            res.status(401).json({ message: 'Không có quyền xóa review này' });
            return;
        }
        if ((error as Error).message === 'Review not found') {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        next(error);
    }
};