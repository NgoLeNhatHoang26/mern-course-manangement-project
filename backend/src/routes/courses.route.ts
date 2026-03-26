import { Router } from "express";
import {getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse} from '../controller/courses.controller.js'
import reviewRoute from './review.route.js'
import moduleRoute from './lessonModule.route.js'
import {upload}from '../middleware/upload.js'
import enrollmentRoute from "./enrollment.route.js";
const router = Router();

router.get('/', getAllCourses)
router.get('/:courseId', getCourseById)

router.post("/", upload.single("thumbnail"), createCourse);
router.put('/:courseId', upload.single('thumbnail'),updateCourse)
router.delete('/:courseId', deleteCourse)

router.post('/:courseId/enrollments', enrollmentRoute)

router.use('/:courseId/modules', moduleRoute)
router.use('/:courseId/reviews', reviewRoute)

export default router;