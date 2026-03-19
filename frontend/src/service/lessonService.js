import axiosClient from "./api";

export const LessonService = {
    getAllLessonByCourse: async (courseId) => {
        const response = await axiosClient.get(`/lessons/course/${courseId}`);
        return response.data;
    },
    getAllLessonByModule: async (moduleId) => {
        const response = await axiosClient.get(`/modules/${moduleId}/lessons`);
        return response.data
    },
    getLessonById: async (lessonId) => {
        const response = await axiosClient.get(`/lessons/${lessonId}`);
        return response.data
    }
}