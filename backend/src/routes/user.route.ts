import { Router } from 'express';
import { getUserProfileController, updateUserProfileController, createNewAccountController } from '../controller/user.controller.js';
import enrollmentRoute from './enrollment.route.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.post('/', createNewAccountController);

// User đã đăng nhập
router.get('/', authMiddleware, getUserProfileController);
router.patch('/', authMiddleware, updateUserProfileController);
router.use('/enrollments', authMiddleware, enrollmentRoute);

export default router;