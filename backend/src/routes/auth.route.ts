import express from 'express';
import authController from '../controller/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';
import { env } from '../config/env.js';
const router = express.Router();
const authLimiters = env.NODE_ENV === 'test' ? [] : [authRateLimiter];

router.post('/register',
    ...authLimiters,
    validate(registerSchema),
    authController.register
);

router.post('/login',
    ...authLimiters,
    validate(loginSchema),
    authController.login
);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;