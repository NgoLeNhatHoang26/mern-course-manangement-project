import mongoose from 'mongoose'

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    progress: {
        type: Number,
        default: 0
    },
    completedLessons: {
        type: Number,
        default: 0
    },
    enrollmentAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true } );

// Đảm bảo mỗi user không enroll 1 course nhiều lần
enrollmentSchema.index(
    {userId: 1, courseId: 1},
    {unique: true},
)

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);