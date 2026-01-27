import { Router } from "express";
import {getAllCourses, getCourseById} from '../controller/courses.controller.js'
import lessonRoute from './lesson.route.js'
import reviewRoute from './review.route.js'
const router = Router();

router.get('/', getAllCourses)
router.get('/:id', getCourseById)
router.use('/:courseId/lessons', lessonRoute)
router.use('/:courseId/review', reviewRoute)
export default router;