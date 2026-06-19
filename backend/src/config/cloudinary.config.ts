import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from './logger.js';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});
logger.debug({ cloudName: env.CLOUDINARY_CLOUD_NAME }, 'Cloudinary config loaded');
export const deleteFile = async (url: string, resourceType: 'image' | 'video' = 'image') => {
    const parts = url.split('/')
    const filename = parts[parts.length - 1].split('.')[0]
    const folder = parts[parts.length - 2]
    const publicId = `${folder}/${filename}`

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
export default cloudinary;