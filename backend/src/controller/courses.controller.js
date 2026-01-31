import { Course } from '../models/course.js';


export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.json(courses)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
export const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const createCourse = async (req, res, next) => {
    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};
