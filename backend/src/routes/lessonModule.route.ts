import { Router } from "express";
import {getLessonModulesByCourse, createLessonModule, updateLessonModule, deleteLessonModule} from "../controller/lessonModule.controller.js";
import lessonRoute from "./lesson.route.js";
import authMiddleware from '../middleware/auth.middleware.js'
import roleMiddleware from '../middleware/role.middleware.js'

const router = Router({mergeParams: true});

// Public
router.get('/',authMiddleware, getLessonModulesByCourse)

// Admin only
router.post('/',authMiddleware, roleMiddleware('admin'), createLessonModule)
router.patch('/:moduleId', authMiddleware, roleMiddleware('admin'), updateLessonModule)
router.delete('/:moduleId', authMiddleware, roleMiddleware('admin'), deleteLessonModule)


router.use('/:moduleId/lessons', lessonRoute)
export default router;