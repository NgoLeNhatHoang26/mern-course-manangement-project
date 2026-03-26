import axiosClient from "./api.js";

export const CourseService = {
    getAllCourses: async () => {
        const response = await axiosClient.get('/courses');
        return response.data;
    },
    getCourseById: async (id) => {
        const response = await axiosClient.get(`/courses/${id}`);
        return response.data
    },
    createCourse: async (course) => {
        const response = await axiosClient.post(`/courses`, course);
        return response.data;
    }
}