import axiosClient from "./api.js";

export interface IReview {
    _id: string
    userId:     string;
    courseId:   string;
    rating:     number;
    comment:    string;
}
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