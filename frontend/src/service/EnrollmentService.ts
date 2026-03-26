import axiosClient from "./api.ts";

export const EnrollmentService = {
    enroll: async (courseId) => {
        const res = await axiosClient.post("/enrollments", { courseId });
        return res.data;
    },
    getMyEnrollments: async () => {
        const res = await axiosClient.get("/enrollments/me");
        return res.data;
    },
    checkEnrollment: async (courseId) => {
        const res = await axiosClient.get(`/enrollments/${courseId}/check`);
        return res.data;
    },
};