import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary Config Loaded:", process.env.CLOUDINARY_CLOUD_NAME);
export const deleteFile = async (url: string, resourceType: 'image' | 'video' = 'image') => {
    const parts = url.split('/')
    const filename = parts[parts.length - 1].split('.')[0]
    const folder = parts[parts.length - 2]
    const publicId = `${folder}/${filename}`

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
export default cloudinary;