import { Router } from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../controller/review.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router({ mergeParams: true });

router.get('/', getAllReviews)
router.post("/", authMiddleware, createReview);
router.patch('/', updateReview)
router.delete('/', deleteReview)

export default router;