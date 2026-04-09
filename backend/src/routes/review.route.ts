import { Router } from 'express';
import { getAllReviewsController, createReviewController, updateReviewController, deleteReviewController } from '../controller/review.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.get('/', getAllReviewsController);
router.post("/", authMiddleware, createReviewController);
router.patch('/:reviewId', authMiddleware, updateReviewController);
router.delete('/:reviewId', authMiddleware, deleteReviewController);

export default router;