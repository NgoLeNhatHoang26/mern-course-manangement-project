import { Course } from "../models/course.js";
import { Enrollment } from "../models/enrollment.js";

export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
export const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);
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

export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        res.json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const enrollCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        const existingEnrollment = await Enrollment.findOne({
            userId,
            courseId
        });
        if (existingEnrollment) {
            return res.status(400).json({
                message: "Already enrolled"
            });
        }
        const enrollment = new Enrollment({
            userId,
            courseId
        });
        const savedEnrollment = await enrollment.save();
        res.status(201).json(savedEnrollment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}