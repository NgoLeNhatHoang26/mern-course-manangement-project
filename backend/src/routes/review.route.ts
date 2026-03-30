import { Router } from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../controller/review.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router({ mergeParams: true });

router.get('/', getAllReviews)
router.post("/", authMiddleware, createReview);
router.patch('/:reviewId',authMiddleware, updateReview)
router.delete('/:reviewId',authMiddleware, deleteReview)

export default router;