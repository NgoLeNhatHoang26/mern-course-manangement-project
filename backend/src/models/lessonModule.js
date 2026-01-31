import mongoose from "mongoose";

const lessonModuleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const LessonModule = mongoose.model("LessonModule", lessonModuleSchema);