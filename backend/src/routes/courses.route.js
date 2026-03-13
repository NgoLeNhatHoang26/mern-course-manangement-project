import { Router } from "express";
import {getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollCourse} from '../controller/courses.controller.js'
import reviewRoute from './review.route.js'
import moduleRoute from './lessonModule.route.js'
const router = Router();

router.get('/', getAllCourses)
router.get('/:courseId', getCourseById)

router.post('/', createCourse)
router.patch('/:courseId', updateCourse)
router.delete('/:courseId', deleteCourse)

router.post('/:courseId/enroll', enrollCourse)

router.use('/:courseId/modules', moduleRoute)
router.use('/:courseId/reviews', reviewRoute)

export default router;