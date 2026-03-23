import { Router } from "express";
import {getLessonsByModule, getLessonById, createLesson, updateLesson, deleteLesson} from "../controller/lesson.controller.js";
import {upload} from "../middleware/upload.js";
const router = Router({ mergeParams: true });

router.get('/', getLessonsByModule)
router.get('/:lessonId', getLessonById)
router.post("/", upload.single("videoUrl"), createLesson);
router.patch('/:lessonId', updateLesson)
router.delete('/:lessonId', deleteLesson)
export default router;