import { Router } from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../controller/review.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router({ mergeParams: true });

router.get('/', getAllReviews)
router.post("/", authMiddleware, createReview);
router.patch('/',authMiddleware, updateReview)
router.delete('/',authMiddleware, deleteReview)

export default router;