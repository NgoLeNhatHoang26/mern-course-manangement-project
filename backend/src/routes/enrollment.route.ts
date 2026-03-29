import { Router } from "express";
import {getMyEnrollments, enrollCourse, checkEnrollment} from "../controller/enrollment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware,getMyEnrollments);
router.post('/', authMiddleware, enrollCourse );
router.get("/:courseId/check", authMiddleware, checkEnrollment);
export default router;