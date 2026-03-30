import mongoose, {Document, Schema} from 'mongoose'
import {NextFunction} from "express";

export interface IEnrollment extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    progress: number;
    completedLessons: number;
    enrollmentAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>({
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress:           { type: Number, default: 0 },
    completedLessons:   {type: Number, default: 0},
    enrollmentAt:       { type: Date, default: Date.now }
}, { timestamps: true } );

// Đảm bảo mỗi user không enroll 1 course nhiều lần
enrollmentSchema.index({userId: 1, courseId: 1}, {unique: true} )

enrollmentSchema.post('save', async function () {
    await mongoose.model('Course').findByIdAndUpdate(
        this.courseId,
        { $inc: {studentCount: 1} }
    )
})

enrollmentSchema.post('findOneAndDelete', async function (doc) {
    if (doc){
        await mongoose.model('Course').findByIdAndUpdate(
            doc.courseId,
            { $inc: {studentCount: -1} }
        )
    }

})

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);