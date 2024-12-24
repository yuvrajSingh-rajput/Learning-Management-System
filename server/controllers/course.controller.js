import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                success: false,
                message: "course title & category is required",
            });
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id,
        });

        return res.status(201).json({
            course,
            message: "Course created",
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false, 
            message: "Failed to create course",
        });
    }
};

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;

        const courses = await Course.find({ creator: userId });

        if (courses.length === 0) {
            return res.status(404).json({
                courses: [],
                success: false,
                message: "No courses found for the creator",
            });
        }

        return res.status(200).json({
            courses,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load courses",
        });
    }
};

export const editCourse = async (req, res) => {
    try {
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;
        const courseId = req.params.courseId;

        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found",
                success: false,
            });
        }

        const updateData = {
            courseTitle,
            subTitle,
            description, 
            coursePrice,
            category,
            courseLevel,
        };
        
        // delete old thumbnail
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split('.')[0];
                await deleteMediaFromCloudinary(publicId);
            }
            const courseThumbnail = await uploadMedia(thumbnail.path);
            updateData.courseThumbnail = courseThumbnail?.secure_url;
        }

        course = await Course.findByIdAndUpdate(courseId, updateData, {new: true});

        return res.status(200).json({
            course,
            message: "Course updated successfully",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to edit courses",
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const {courseId} = req.params;
        console.log(courseId);

        const course = await Course.findById(courseId);

        if(!course){
            res.status(404).json({
                message: "Course not found",
                success: false,
            });
        }

        return res.status(200).json({
            course,
            success: true,
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: "Failed to get course",
        });
    }
};