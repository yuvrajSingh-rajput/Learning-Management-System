import { CourseProgress } from "../models/course-progress.model.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        // step-1: fetch user's course progress
        const courseProgress = await CourseProgress.findOne({courseId, userId}).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "course not found",
            });
        };

        // If no progress found (intially) then, return course details with an empty progress.
        if(!courseProgress){
            return res.status(200).json({
                success: true,
                data: {
                    courseDetails,
                    progress: [],
                    completed: false,
                }
            });
        };

        // return the user's course progress along with coursedetails
        return res.status(200).json({
            data: {
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed,
            }
        });

    } catch (error) {
        console.log(error);
    }
};

export const updateLectureProgress = async (req, res) => {
    try {
        const {courseId, lectureId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            // if no progress exists then create a new record
            courseProgress = new CourseProgress({
                userId, 
                courseId, 
                lectureProgress: [],
                completed: false,
            });
        };

        // find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);

        if(lectureIndex !== -1){
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }else{
            // add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: true,
            });
        };

        // if all lecture is complete
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;

        const course = await Course.findById(courseId);
        if(course.lectures.length === lectureProgressLength) courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "lecture progress updated successfully",
        });

    } catch (error) {
        console.log(error);
    }
};

export const markCourseAsCompleted = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "course progress not found",
            });
        };

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = true);
        courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            success: false,
            message: "course successfully marked as completed",
        });

    } catch (error) {
        console.log(error);
    }
};

export const markCourseAsIncompleted = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "course progress not found",
            });
        };

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = false);
        courseProgress.completed = false;

        await courseProgress.save();

        return res.status(200).json({
            success: false,
            message: "course successfully marked as incompleted",
        });

    } catch (error) {
        console.log(error);
    }
};