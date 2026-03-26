import { Router } from "express";
import {getLessonModulesByCourse, createLessonModule, updateLessonModule, deleteLessonModule} from "../controller/lessonModule.controller.js";
import lessonRoute from "./lesson.route.js";

const router = Router({mergeParams: true});

router.get('/', getLessonModulesByCourse)
router.post('/', createLessonModule)
router.patch('/:moduleId', updateLessonModule)
router.delete('/:moduleId', deleteLessonModule)
router.use('/:moduleId/lessons', lessonRoute)
export default router;