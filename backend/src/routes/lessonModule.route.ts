import { Router } from "express";
import { getLessonModulesByCourseController, createLessonModuleController, updateLessonModuleController, deleteLessonModuleController } from "../controller/lessonModule.controller.js";
import lessonRoute from "./lesson.route.js";
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createModuleSchema, updateModuleSchema } from '../schemas/module.schema.js';

const router = Router({ mergeParams: true });

// Public
router.get('/', authMiddleware, getLessonModulesByCourseController);

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), validate(createModuleSchema), createLessonModuleController);
router.patch('/:moduleId', authMiddleware, roleMiddleware('admin'), validate(updateModuleSchema), updateLessonModuleController);
router.delete('/:moduleId', authMiddleware, roleMiddleware('admin'), deleteLessonModuleController);

router.use('/:moduleId/lessons', lessonRoute);
export default router;