import { Router } from "express";
import enrollmentRoute from "./enrollment.route.js";
import { getUserProfile, updateUserProfile, createNewAccount} from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get('/', authMiddleware, getUserProfile);
router.post('/', createNewAccount)
router.get('/enrollments', authMiddleware, enrollmentRoute);
router.patch('/', authMiddleware, updateUserProfile);
export default router;