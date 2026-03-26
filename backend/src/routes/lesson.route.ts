import { Router } from "express";
import {getLessonsByModule, getLessonById, createLesson, updateLesson, deleteLesson} from "../controller/lesson.controller.ts";
import {upload} from "../middleware/upload.ts";
const router = Router({ mergeParams: true });

router.get('/', getLessonsByModule)
router.get('/:lessonId', getLessonById)
router.post("/", upload.single("videoUrl"), createLesson);
router.patch('/:lessonId', updateLesson)
router.delete('/:lessonId', deleteLesson)
export default router;