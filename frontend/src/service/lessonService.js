import axios from "axios";
const API_URL = "http://localhost:5000";

export const CourseService = {
    getAllLessonByCourse: async (courseId) => {
        const response = await axios.get(`${API_URL}/${courseId}`);
        return response.data;
    },
    getLessonById: async (courseId,lessonId) => {
        const response = await axios.get(`${API_URL}/${courseId}/${lessonId}`);
        return response.data
    }
}