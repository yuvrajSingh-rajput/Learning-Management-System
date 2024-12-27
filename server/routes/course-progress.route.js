import express from "express";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import {
    getCourseProgress, 
    markCourseAsCompleted, 
    markCourseAsIncompleted, 
    updateLectureProgress
} from "../controllers/course-progress.controller.js";

const router = express.Router();

router.route("/:courseId").get(isAuthenticated, getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated, updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated, markCourseAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated, markCourseAsIncompleted);

export default router;