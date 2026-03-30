import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";
import {Request, Response, NextFunction} from "express";
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'course-thumbnails',  // tên folder trên Cloudinary
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 1280, height: 720, crop: 'fill' }],
        }
    }
})

export  const handleImageUpload = (req: Request, res: Response, next: NextFunction) => {
    uploadImage.single('thumbnail')(req, res, (err) => {
        if (err) {
            console.log('Multer/Cloudinary error:', err)
            res.status(400).json({ message: err.message })
            return
        }
        next()
    })
}
const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'course-videos',
            resource_type: 'video',
            allowed_formats: ['mp4', 'mov', 'avi'],
        }
    },
})

export const uploadImage = multer({ storage: imageStorage })
export const uploadVideo = multer({ storage: videoStorage })