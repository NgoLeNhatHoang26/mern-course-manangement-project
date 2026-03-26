import mongoose, {Document, Schema} from "mongoose";

export interface ILessonModule extends Document {
    courseId:    mongoose.Types.ObjectId;
    title:       string;
    description: string;
    order:       number;
}

const lessonModuleSchema = new Schema({
    courseId: { type: Schema.Types.ObjectId, ref: "Course",},
    title: {type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true }
}, { timestamps: true });

export const LessonModule = mongoose.model<ILessonModule>("LessonModule", lessonModuleSchema);
