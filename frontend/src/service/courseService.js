import axios from "axios";
const API_URL = "http://localhost:5000/courses";

export const CourseService = {
    getAllCourses: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    getCourseById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data
    }
}