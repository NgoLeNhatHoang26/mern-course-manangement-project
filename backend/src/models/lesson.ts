import mongoose, {Schema, Document} from "mongoose"

export interface ILesson extends Document {
    courseId:   mongoose.Types.ObjectId;
    moduleId:   mongoose.Types.ObjectId;
    title:      string;
    content:    string;
    videoUrl:   string;
    duration:   number;
    order:      number;
    isPreview:  boolean;
}

const lessonSchema = new Schema({
    courseId:   { type: Schema.Types.ObjectId, ref: "Course" },
    moduleId:   {type: Schema.Types.ObjectId,  ref: "LessonModule" },
    title:      {type: String, required: true },
    content:    {type: String, required: true },
    videoUrl:   {type: String },
    duration:   { type: Number, required: true },
    order:      {type: Number, required: true },
    isPreview:  { type: Boolean, default: false },
}, { timestamps: true });

export const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);