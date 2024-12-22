import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                success: false,
                message: "User already exists!",
            });
        }        

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: true,
            message: "failed to register",
        });
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password",
            });
        }
        
        generateToken(res, user, `welcome back ${user.name}`);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: true,
            message: "failed to login",
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "failed to logout",
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "failed to fetch profile",
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // extract public id of old image from the url if it exists.
        if(user.imageUrl){
            const publicId = user.imageUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }

        // upload new photo 
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const imageUrl = cloudResponse.secure_url;

        const updatedData = {name, imageUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new: true}).select("-password");

        return res.status(200).json({
            success: true, 
            user: updatedUser,
            message: "profile updated successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "failed to update profile",
        });
    }
}