import axiosClient from "../../../lib/api";
export interface ILesson {
    _id: string
    moduleId: string
    title: string
    videoUrl?: string
    order: number
}
export const LessonService = {
    getLessonsByModule: async (moduleId: string) => {
        const res = await axiosClient.get(`/modules/${moduleId}/lessons`);
        return res.data;
    },

    getLessonById: async (lessonId: string) => {
        const res = await axiosClient.get(`/lessons/${lessonId}`);
        return res.data;
    },
    createLesson: async (moduleId: string, lesson: Omit<ILesson, '_id'>): Promise<ILesson> => {
        const res = await axiosClient.post<ILesson>(`/modules/${moduleId}/lessons`, lesson)
        return res.data
    },

};
