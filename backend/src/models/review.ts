import mongoose, {Document, Schema} from "mongoose";

export interface IReview extends Document {
    userId:     mongoose.Types.ObjectId;
    courseId:   mongoose.Types.ObjectId;
    rating:     number;
    comment:    string;
}

const reviewSchema = new Schema({
    userId:     {type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId:   { type: Schema.Types.ObjectId, ref: "Course", required: true, },
    rating:     { type: Number, required: true,
                    min: [1, 'Rating must be at least 1'],
                    max: [5, 'Rating cannot exceed 5'],
                    validate: {
                        validator: Number.isInteger,
                        message: 'Rating must be an integer'
                    },
                },
    comment:    { type: String, required: true }
}, {timestamps: true});

// Mỗi user chỉ review 1 lần
reviewSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
)
export const Review = mongoose.model<IReview>("Review", reviewSchema);