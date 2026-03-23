import axiosClient from "./api";

export const ReviewService = {
    getAllReviewsByCourse: async (courseId) => {
        const response = await axiosClient.get(`/courses/${courseId}/reviews`);
        return response.data;
    },
    createReview: async (courseId, review) => {
        const response = await axiosClient.post(`/courses/${courseId}/reviews`, review);
        return response.data;
    }

}