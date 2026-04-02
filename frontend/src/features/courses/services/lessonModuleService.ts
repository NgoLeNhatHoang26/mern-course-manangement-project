import axiosClient from "../../../lib/api";
import { ILessonModule } from "@features/courses";

export const LessonModuleService = {
    getAllModulesByCourse: async (courseId: string) => {
        const response = await axiosClient.get(`/courses/${courseId}/modules`);
        return response.data;
    },
    getModuleById: async (moduleId: string) => {
        const response = await axiosClient.get(`/modules/${moduleId}`);
        return response.data
    },
    createModule: async (courseId:string, module:ILessonModule) => {
        const response = await axiosClient.post(`/courses/${courseId}/modules`, module);
        return response.data;
    }
}