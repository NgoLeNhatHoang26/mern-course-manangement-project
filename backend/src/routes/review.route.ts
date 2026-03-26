import { Router } from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../controller/review.controller.ts';
import authMiddleware from "../middleware/auth.middleware.ts";
const router = Router({ mergeParams: true });

router.get('/', getAllReviews)
router.post("/", authMiddleware, createReview);
router.patch('/', updateReview)
router.delete('/', deleteReview)

export default router;