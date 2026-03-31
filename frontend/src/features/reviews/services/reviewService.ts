import axiosClient from "../../../lib/api";
import { IReview } from "../types/review.interface";

export const ReviewService = {
    getAllReviewsByCourse: async (courseId: string) => {
        const response = await axiosClient.get(`/courses/${courseId}/reviews`);
        return response.data;
    },
    createReview: async (courseId: string, review: IReview) => {
        const response = await axiosClient.post(`/courses/${courseId}/reviews`, review);
        return response.data;
    },
    updateReview: async (reviewId: string, data: Omit<IReview, '_id' | 'userId' | 'courseId'>): Promise<IReview> => {
        const res = await axiosClient.patch<IReview>(`/reviews/${reviewId}`, data)
        return res.data
    },
    deleteReview: async (reviewId: string): Promise<void> => {
        await axiosClient.delete(`/reviews/${reviewId}`)
    },

}