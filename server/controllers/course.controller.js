import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

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
        console.error(error);
        res.status(500).json({
            success: false, 
            message: "Failed to create course",
        });
    }
};

export const searchCourse = async (req, res) => {
    try {
        const {query = "", categories = [], sortByPrice = ""} = req.query;

        const searchCriteria = {
            isPublished: true, 
            $or: [
                {courseTitle: {$regex: query, $options: "i"}},
                {subTitle: {$regex: query, $options: "i"}},
                {category: {$regex: query, $options: "i"}},
            ]
        };

        // if category selected
        if(categories.length > 0){
            searchCriteria.category = {$in: categories};
        };

        // define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1; 
        }

        let courses = await Course.find(searchCriteria)
                                  .populate({path: "creator", select: "name imageUrl"})
                                  .sort(sortOptions);

        return res.status(200).json({
            success: true,
            courses: courses || [],
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false, 
            message: "internal server error",
        });
    }
};

export const getPublishedCourse = async (req, res) => {
    try {
        const courses = await Course.find({isPublished: true}).populate({path: "creator", select: "name imageUrl"});
        if(!courses){
            res.status(404).json({
                success: false,
                message: "no courses found",
            });
        }

        res.status(200).json({
            success: true,
            courses,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, 
            message: "Failed to get published courses",
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

export const createLecture = async (req, res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                success: false,
                message: "lecture title is required",
            });
        }

        const lecture = await Lecture.create({lectureTitle});
        const course = await Course.findById(courseId);

        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            success: true,
            lecture,
            message: "lecture created successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create lecture",
        });
    };
};

export const getLectures = async (req, res) => {
    try {
        const {courseId} = req.params; 
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            res.status(404).json({
                success: false,
                message: "course not found",
            });
        }

        return res.status(200).json({
            success: true,
            lectures: course.lectures,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch lectures",
        });
    }
};

export const editLecture = async (req, res) => {
    try {
        const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        const {courseId, lectureId} = req.params;
        
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            res.status(404).json({
                success: false,
                message: "lecture not found",
            });
        }

        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo) lecture.tutorialUrl = videoInfo.tutorialUrl;
        if(videoInfo) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lectureId);
            await course.save();
        }

        return res.status(200).json({
            success: true,
            lecture: {
                _id: lecture._id,
                lectureTitle: lecture.lectureTitle,
                tutorialUrl: lecture.tutorialUrl,
                publicId: lecture.publicId, 
                isPreviewFree: lecture.isPreviewFree,
                createdAt: lecture.createdAt,
                updatedAt: lecture.updatedAt,
                __v: lecture.__v,
            },
            message: "lecture successfully updated",
        });
        

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to edit lecture",
        });
    }
};

export const removeLecture = async (req, res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                success: false,
                message: "lecture not found",
            });
        }

        // delete lecture from cloudinary too
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures: lectureId}, // find the course that contains lecture 
            {$pull: {lectures: lectureId}}, // remove the lecture,
        );

        return res.status(200).json({
            success: true,
            message: "lecture removed successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove lecture",
        });
    }
};

export const getLectureById = async (req, res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);

        if(!lecture){
            res.status(404).json({
                success: false,
                message: "lecture not found",
            });
        }

        return res.status(200).json({
            success: true,
            lecture,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove lecture",
        });
    }
}

export const tooglePublishCourses = async (req, res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query;    // {true/false}
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "course not found",
            });
        };
        // publish status based on query parameter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            success: true,
            message: `Course is ${statusMessage}`,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};