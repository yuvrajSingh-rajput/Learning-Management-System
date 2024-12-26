import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

router.route('/upload-video').post(upload.single("file"), async (req, res) => {
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            success: true,
            message: "file successfully uploaded",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "error in uploading file",
        });
    }
});

export default router;