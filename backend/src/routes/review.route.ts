import { Router } from 'express';
import { getAllReviewsController, createReviewController, updateReviewController, deleteReviewController } from '../controller/review.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from '../middleware/validate.middleware.js';
import { createReviewSchema, updateReviewSchema } from '../schemas/review.schema.js';

const router = Router({ mergeParams: true });

router.get('/', getAllReviewsController);
router.post("/", authMiddleware, validate(createReviewSchema), createReviewController);
router.patch('/:reviewId', authMiddleware, validate(updateReviewSchema), updateReviewController);
router.delete('/:reviewId', authMiddleware, deleteReviewController);

export default router;