import { Router } from "express";
import {getMyEnrollments, enrollCourse, checkEnrollment} from "../controller/enrollment.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/me", authMiddleware,getMyEnrollments);
router.post('/', authMiddleware,enrollCourse );
router.get("/:courseId/check", authMiddleware, checkEnrollment);
export default router;