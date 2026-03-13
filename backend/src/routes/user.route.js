import { Router } from "express";
import enrollmentRoute from "./enrollment.route.js";
import { getUserProfile, updateUserProfile } from "../controller/user.controller.js";
const router = Router();

router.get('/', getUserProfile)
router.get('/enrollments', enrollmentRoute)
router.patch('/', updateUserProfile)
export default router;