import express from 'express';
import authController from '../controller/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import {validate} from "../middleware/validate.middleware.js";
import {registerSchema, loginSchema} from "../schemas/auth.schema.js";

const router = express.Router();

router.post('/register',
    validate(registerSchema),
    authController.register
);

router.post('/login',
    validate(loginSchema),
    authController.login
);
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.get('/me', authMiddleware, authController.getMe);

export default router;