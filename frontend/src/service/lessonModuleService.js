import axiosClient from "./api";

export const LessonModuleService = {
    getAllModulesByCourse: async (courseId) => {
        const response = await axiosClient.get(`/courses/${courseId}/modules`);
        return response.data;
    },
    getModuleById: async (courseId,moduleId) => {
        const response = await axiosClient.get(`/modules/${moduleId}`);
        return response.data
    },
    createModule: async (courseId, module) => {
        const response = await axiosClient.post(`/courses/${courseId}/modules`, module);
        return response.data;
    }
}