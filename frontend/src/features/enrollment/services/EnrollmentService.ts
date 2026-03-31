import axiosClient from "./api";

export interface IEnrollment{
    _id: string;
    userId: string;
    courseId: string;
    progress: number;
    completedLessons: number;
    enrollmentAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const EnrollmentService = {
    enroll: async (courseId: string) => {
        const res = await axiosClient.post("/enrollments", { courseId });
        return res.data;
    },
    getMyEnrollments: async () => {
        const res = await axiosClient.get("/enrollments/me");
        return res.data;
    },
    checkEnrollment: async (courseId: string) => {
        const res = await axiosClient.get(`/enrollments/${courseId}/check`);
        return res.data;
    },
};