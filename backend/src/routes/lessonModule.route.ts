import { Router } from "express";
import { getLessonModulesByCourseController ,getLessonModuleByIdController , createLessonModuleController, updateLessonModuleController, deleteLessonModuleController } from "../controller/lessonModule.controller.js";
import lessonRoute from "./lesson.route.js";
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createModuleSchema, updateModuleSchema } from '../schemas/module.schema.js';

const router = Router({ mergeParams: true });

// Public list
router.get('/', authMiddleware, getLessonModulesByCourseController);
// Admin create
router.post('/', authMiddleware, roleMiddleware('admin'), validate(createModuleSchema), createLessonModuleController);
// Nested lessons (more specific paths first)
router.use('/:moduleId/lessons', lessonRoute);
// Module by id
router.get('/:moduleId', authMiddleware, getLessonModuleByIdController);
router.patch('/:moduleId', authMiddleware, roleMiddleware('admin'), validate(updateModuleSchema), updateLessonModuleController);
router.delete('/:moduleId', authMiddleware, roleMiddleware('admin'), deleteLessonModuleController);

export default router;