import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    level: String,
}, { timestamps: true });

export const Course = mongoose.model('Course', courseSchema);