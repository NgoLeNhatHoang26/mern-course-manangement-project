import axiosClient from '@/lib/api'
import { ICourse, IPaginatedResult } from '@features/courses'

export interface CourseListParams {
    search?: string
    level?: string
    page?: number
    limit?: number
}

export const CourseService = {
    getAllCourses: async (params?: CourseListParams): Promise<IPaginatedResult<ICourse>> => {
        const res = await axiosClient.get<IPaginatedResult<ICourse>>('/courses', { params })
        return res.data
    },

    getCourseById: async (id: string): Promise<ICourse> => {
        const response = await axiosClient.get<ICourse>(`/courses/${id}`)
        return response.data
    },

    createCourse: async (course: FormData, idempotencyKey?: string): Promise<ICourse> => {
        const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined
        const response = await axiosClient.post<ICourse>('/courses', course, { headers })
        return response.data
    },

    updateCourse: async (id: string, course: FormData | Partial<ICourse>): Promise<ICourse> => {
        const response = await axiosClient.put<ICourse>(`/courses/${id}`, course)
        return response.data
    },

    deleteCourse: async (id: string): Promise<void> => {
        await axiosClient.delete(`/courses/${id}`)
    },
}
