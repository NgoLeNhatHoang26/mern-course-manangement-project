import { Router } from "express";
import {getUserEnrollments } from "../controller/enrollment.controller.js";
const router = Router();

router.get("/:userId", getUserEnrollments);

export default router;