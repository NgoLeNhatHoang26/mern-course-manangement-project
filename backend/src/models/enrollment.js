import mongoose from 'mongoose'

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false,
    },
    progress: {
        type: Float64Array,
        default: 0
    },
    completedLessons: {
        type: Number,
        default: 0
    },
}, { timestamps: true } );

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);