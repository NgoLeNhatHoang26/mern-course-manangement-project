import { Router } from "express";
import {getCourseById} from "../controller/courses.controller.js";

const router = Router();

router.get('/', getAllLesson)
router.get('/:id', getLessonById)

export default router;