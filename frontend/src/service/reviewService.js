import axiosClient from "./api";

export const ReviewService = {
    getAllReviewsByCourse: async (courseId) => {
        const response = await axiosClient.get(`/courses/${courseId}/reviews`);
        return response.data;
    },

}