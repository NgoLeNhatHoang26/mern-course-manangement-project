import { Router } from "express";
import enrollmentRoute from "./enrollment.route.js";
import { getUserProfile, updateUserProfile } from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get('/', authMiddleware, getUserProfile);
router.get('/enrollments', authMiddleware, enrollmentRoute);
router.patch('/', authMiddleware, updateUserProfile);
export default router;