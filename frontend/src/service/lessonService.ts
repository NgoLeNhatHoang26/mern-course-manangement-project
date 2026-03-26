import axiosClient from "./api.js";

export const LessonService = {
  getLessonsByModule: async (moduleId) => {
    const res = await axiosClient.get(`/lessons?moduleId=${moduleId}`);
    return res.data;
  },

  getLessonById: async (lessonId) => {
    const res = await axiosClient.get(`/lessons/${lessonId}`);
    return res.data;
  },
};
