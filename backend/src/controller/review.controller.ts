import {NextFunction, Request, Response} from 'express'
import { Review } from '../models/review.js'

export const getAllReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params
        const reviews = await Review
            .find({ courseId })
            .populate('userId', 'userName')
            .sort({ createdAt: -1 })

        res.status(200).json(reviews)
    } catch (error) {
        next(error)
    }
}

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.params
        const userId = req.user?._id

        const newReview = new Review({
            ...req.body,
            userId,
            courseId,
        })
        const savedReview = await newReview.save()
        res.status(201).json(savedReview)
    } catch (error) {
        if ((error as any).code === 11000) {
            res.status(409).json({ message: 'Bạn đã đánh giá khoá học này rồi' })
            return
        }
        next(error)
    }
}

export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reviewId } = req.params
        const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true })
        if (!updatedReview) {
            res.status(404).json({ message: 'Review not found' })
            return
        }
        res.json(updatedReview)
    } catch (error) {
        next(error)
    }
}

export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reviewId } = req.params
        const deletedReview = await Review.findByIdAndDelete(reviewId)
        if (!deletedReview) {
            res.status(404).json({ message: 'Review not found' })
            return
        }
        res.json({ message: 'Review deleted successfully' })
    } catch (error) {
        next(error)
    }
}