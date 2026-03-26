import { Router } from "express";
import {getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollCourse} from '../controller/courses.controller.ts'
import reviewRoute from './review.route.js'
import moduleRoute from './lessonModule.route.js'
import {upload}from '../middleware/upload.ts'
import enrollmentRoute from "./enrollment.route.js";
const router = Router();

router.get('/', getAllCourses)
router.get('/:courseId', getCourseById)

router.post("/", upload.single("thumbnail"), createCourse);
router.patch('/:courseId', updateCourse)
router.delete('/:courseId', deleteCourse)

router.post('/:courseId/enrollments', enrollmentRoute)

router.use('/:courseId/modules', moduleRoute)
router.use('/:courseId/reviews', reviewRoute)

export default router;