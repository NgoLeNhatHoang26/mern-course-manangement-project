import { Router } from "express";
import { getLessonModulesByCourseController, createLessonModuleController, updateLessonModuleController, deleteLessonModuleController } from "../controller/lessonModule.controller.js";
import lessonRoute from "./lesson.route.js";
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router({ mergeParams: true });

// Public
router.get('/', authMiddleware, getLessonModulesByCourseController);

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), createLessonModuleController);
router.patch('/:moduleId', authMiddleware, roleMiddleware('admin'), updateLessonModuleController);
router.delete('/:moduleId', authMiddleware, roleMiddleware('admin'), deleteLessonModuleController);

router.use('/:moduleId/lessons', lessonRoute);
export default router;