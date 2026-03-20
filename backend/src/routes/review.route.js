import { Router } from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../controller/review.controller.js';
const router = Router();

router.get('/', getAllReviews)
router.post('/', createReview)
router.patch('/', updateReview)
router.delete('/', deleteReview)

export default router;