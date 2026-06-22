import { Router } from 'express'
import { getLessonsByModuleController , getLessonByIdController, createLessonController, updateLessonController, deleteLessonController } from '../controller/lesson.controller.js'
import { uploadVideo } from '../middleware/upload.js'
import authMiddleware from '../middleware/auth.middleware.js'
import roleMiddleware from '../middleware/role.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { idempotencyMiddleware } from '../middleware/idempotency.middleware.js'
import { createLessonSchema, updateLessonSchema } from '../schemas/lesson.schema.js'

const router = Router({ mergeParams: true })

// Public
router.get('/', getLessonsByModuleController)
router.get('/:lessonId', getLessonByIdController)

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), uploadVideo.single('videoUrl'), validate(createLessonSchema), idempotencyMiddleware, createLessonController)
router.patch('/:lessonId', authMiddleware, roleMiddleware('admin'), validate(updateLessonSchema), updateLessonController)
router.delete('/:lessonId', authMiddleware, roleMiddleware('admin'), deleteLessonController)

export default router