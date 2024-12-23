import { Course } from "../models/course.model.js";

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