import { Review } from "../models/review.js";

export const getAllReviews = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const reviews = await Review
            .find({courseId : courseId })
            .sort({ createdAt: -1 });

        if (!reviews.length) {
            return res.status(200).json([]);
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;
        const newReview = new Review({
            ...req.body,
            userId,
            courseId
        });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            req.body,
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({
                message: "Review not found"
            });
        }
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            req.body,
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({
                message: "Review not found"
            });
        }
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}