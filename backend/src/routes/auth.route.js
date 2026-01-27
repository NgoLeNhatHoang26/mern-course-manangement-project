import express from 'express';
import authController from '../controller/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/me', authMiddleware, authController.getMe);

export default router;