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
    level: {
        type: String,
        enum: ["Cơ bản", "Trung bình", "Nâng cao"],
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
    },
    thumbnail: {
        type: String,
        default: "/images/default_thumbnail.png"
    }
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);
