import { Course } from '../models/course.js';
export const getAllCourses = async (req, res, next) => {
    try {
        res.json("Lấy thành công")
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
export const getCourseById = async (req, res, next) => {

}