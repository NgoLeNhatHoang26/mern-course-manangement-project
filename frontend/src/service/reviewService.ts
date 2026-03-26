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
    }

}