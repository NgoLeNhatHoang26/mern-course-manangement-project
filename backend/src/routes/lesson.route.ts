import { Router } from 'express'
import { getLessonsByModuleController , getLessonByIdController, createLessonController, updateLessonController, deleteLessonController } from '../controller/lesson.controller.js'
import { uploadVideo } from '../middleware/upload.js'
import authMiddleware from '../middleware/auth.middleware.js'
import roleMiddleware from '../middleware/role.middleware.js'

const router = Router({ mergeParams: true })

// Public
router.get('/', getLessonsByModuleController)
router.get('/:lessonId', getLessonByIdController)

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), uploadVideo.single('videoUrl'), createLessonController)
router.patch('/:lessonId', authMiddleware, roleMiddleware('admin'), updateLessonController)
router.delete('/:lessonId', authMiddleware, roleMiddleware('admin'), deleteLessonController)

export default router