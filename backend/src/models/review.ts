import mongoose, {Document, Model, Schema} from "mongoose";
import { logger } from '../config/logger.js';

export interface IReview extends Document {
    userId:     mongoose.Types.ObjectId;
    courseId:   mongoose.Types.ObjectId;
    rating:     number;
    comment:    string;
}

interface IReviewModel extends Model<IReview> {
    calcAverageRating(courseId: mongoose.Types.ObjectId): Promise<void>
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

reviewSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
)

reviewSchema.index({ courseId: 1, createdAt: -1 })

reviewSchema.statics.calcAverageRating = async function (courseId: mongoose.Types.ObjectId) {
    const result = await this.aggregate([
        { $match: { courseId } },
        {
            $group: {
                _id: '$courseId',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1}
            }
        }
    ])
    logger.debug({ result }, 'Review aggregate result')
    if (result.length > 0) {
        await mongoose.model("Course").findByIdAndUpdate(courseId, {
            ratingAverage: Math.round(result[0].avgRating*10) / 10,
            ratingCount: result[0].count,
        })
    } else {
       
        await mongoose.model('Course').findByIdAndUpdate(courseId, {
            ratingAverage: 0,
            ratingCount: 0,
        })
    }
}

reviewSchema.post('save', async function () {
    logger.debug({ courseId: this.courseId }, 'Review saved')
    try {
        await (this.constructor as IReviewModel).calcAverageRating(this.courseId)
        logger.debug('calcAverageRating completed')
    } catch (err) {
        logger.error({ error: err }, 'calcAverageRating failed')
    }
})

reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await (mongoose.model('Review') as IReviewModel).calcAverageRating(doc.courseId)
    }
})


export const Review = mongoose.model<IReview>("Review", reviewSchema);