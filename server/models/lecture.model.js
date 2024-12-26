import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle : {
        type: String,
        required: true,
    },
    tutorialUrl: {
        type: String,
    },
    publicId: {
        type: String,
    },
    isPreviewFree: {
        type: Boolean,
        default: false,
    },
    
}, {timestamps: true});

export const Lecture = mongoose.model("Lecture", lectureSchema);