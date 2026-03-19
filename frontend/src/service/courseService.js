import axiosClient from "./api";

export const CourseService = {
    getAllCourses: async () => {
        const response = await axiosClient.get('/courses');
        return response.data;
    },
    getCourseById: async (id) => {
        const response = await axiosClient.get(`/course/${id}`);
        return response.data
    }
}