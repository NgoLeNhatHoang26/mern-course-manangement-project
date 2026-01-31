import { Router } from "express";
import {getCourseById} from "../controller/courses.controller.js";

const router = Router();

router.get('/', getAllModule)
router.get('/:id', getModuleByCourseId)

export default router;