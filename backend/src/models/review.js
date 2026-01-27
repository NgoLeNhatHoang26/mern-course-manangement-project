import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false,
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        },
    },
    comment: {
        type: String,
        required: true,
    }
}, {timestamps: true});

export const Review = mongoose.model("Review", reviewSchema);