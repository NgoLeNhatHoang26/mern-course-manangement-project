import mongoose from "mongoose"

const lessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    courseOrder: {
        type: Number,
        required: true,
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Lesson = mongoose.model("Lesson", lessonSchema);