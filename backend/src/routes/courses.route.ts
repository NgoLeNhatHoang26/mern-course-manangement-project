import { Router } from 'express';
import { getAllCoursesController, getCourseByIdController, createCourseController, updateCourseController, deleteCourseController } from '../controller/courses.controller.js';
import reviewRoute from './review.route.js';
import moduleRoute from './lessonModule.route.js';
import enrollmentRoute from './enrollment.route.js';
import { uploadImage, handleImageUpload } from '../middleware/upload.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCourseSchema, updateCourseSchema } from '../schemas/course.schema.js';

const router = Router();

// Public
router.get('/', getAllCoursesController);
router.get('/:courseId', getCourseByIdController);

// Admin only
router.post('/',
    authMiddleware,
    roleMiddleware('admin'),
    handleImageUpload,
    validate(createCourseSchema),
    createCourseController
);
router.put('/:courseId',
    authMiddleware,
    roleMiddleware('admin'),
    handleImageUpload,
    validate(updateCourseSchema),
    updateCourseController
);
router.delete('/:courseId', authMiddleware, roleMiddleware('admin'), deleteCourseController);

// Sub-routes
router.post('/:courseId/enrollments', enrollmentRoute);
router.use('/:courseId/modules', moduleRoute);
router.use('/:courseId/reviews', reviewRoute);

export default router;