import axiosClient from "./api";

export const LessonService = {
    getAllLessonByCourse: async (courseId) => {
        const response = await axiosClient.get(`/lessons/course/${courseId}`);
        return response.data;
    },
    getLessonById: async (courseId,lessonId) => {
        const response = await axiosClient.get(`/lessons/${courseId}/${lessonId}`);
        return response.data
    }
}