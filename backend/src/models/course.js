import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
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
        required: false,
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    studentCount: {
        type: Number,
        default: 0,
    },
    ratingAverage: {
        type: Number,
        default: 0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    }

}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);
