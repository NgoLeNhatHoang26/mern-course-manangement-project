import { Router } from 'express'
import { getLessonsByModule, getLessonById, createLesson, updateLesson, deleteLesson } from '../controller/lesson.controller.js'
import { uploadVideo } from '../middleware/upload.js'
import authMiddleware from '../middleware/auth.middleware.js'
import roleMiddleware from '../middleware/role.middleware.js'

const router = Router({ mergeParams: true })

// Public
router.get('/', getLessonsByModule)
router.get('/:lessonId', getLessonById)

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), uploadVideo.single('videoUrl'), createLesson)
router.patch('/:lessonId', authMiddleware, roleMiddleware('admin'), updateLesson)
router.delete('/:lessonId', authMiddleware, roleMiddleware('admin'), deleteLesson)

export default router