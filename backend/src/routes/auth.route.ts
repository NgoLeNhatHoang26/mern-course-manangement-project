import express from 'express';
import authController from '../controller/auth.controller.ts';
import authMiddleware from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;