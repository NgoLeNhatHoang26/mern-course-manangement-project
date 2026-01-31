import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        
    },
    level: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Course = mongoose.model('Course', courseSchema);