import { Request, Response } from 'express'
import { Review } from '../models/review'

export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params
        const reviews = await Review
            .find({ courseId })
            .populate('userId', 'userName')
            .sort({ createdAt: -1 })

        res.status(200).json(reviews)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

export const createReview = async (req: Request, res: Response): Promise<void> => {
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
            res.status(409).json({ message: 'Bạn đã đánh giá khoá học này rồi' }