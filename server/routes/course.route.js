import express from "express";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import { 
    createCourse, 
    createLecture, 
    editCourse, 
    editLecture, 
    getCourseById, 
    getCreatorCourses, 
    getLectureById, 
    getLectures,
    getPublishedCourse,
    removeLecture,
    searchCourse,
    tooglePublishCourses
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const router = express.Router();


router.route('/').post(isAuthenticated, createCourse);
router.route('/search').get(isAuthenticated, searchCourse);
router.route('/published-courses').get(getPublishedCourse);
router.route('/').get(isAuthenticated, getCreatorCourses);
router.route('/:courseId').put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route('/:courseId').get(isAuthenticated, getCourseById);
router.route('/:courseId/lecture').post(isAuthenticated, createLecture);
router.route('/:courseId/lecture').get(isAuthenticated, getLectures);
router.route('/:courseId/lecture/:lectureId').post(isAuthenticated, editLecture);
router.route('/:courseId/lecture/:lectureId').delete(isAuthenticated, removeLecture);
router.route('/:courseId/lecture/:lectureId').get(isAuthenticated, getLectureById);
router.route('/:courseId').patch(isAuthenticated, tooglePublishCourses);


export default router;