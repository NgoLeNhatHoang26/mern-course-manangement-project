import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

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