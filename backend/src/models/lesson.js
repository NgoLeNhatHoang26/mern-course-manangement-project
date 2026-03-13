import e from "express";
import mongoose from "mongoose"

const lessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LessonModule",
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
    order: {
        type: Number,
        required: true,
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Lesson = mongoose.model("Lesson", lessonSchema);