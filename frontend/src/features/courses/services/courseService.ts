import axiosClient from '../../../lib/api'
import { ICourse } from '../types/course.interfaces'

export const CourseService = {
    getAllCourses: async (params?: {search?: string; level?: string}): Promise<ICourse[]> => {
        const response = await axiosClient.get<ICourse[]>('/courses', { params: params })
        return response.data
    },

    getCourseById: async (id: string): Promise<ICourse> => {
        const response = await axiosClient.get<ICourse>(`/courses/${id}`)
        return response.data
    },

    createCourse: async (course: FormData): Promise<ICourse> => {
        const response = await axiosClient.post<ICourse>('/courses', course)
        return response.data
    },
    updateCourse: async (id: string, course: FormData | Partial<ICourse>): Promise<ICourse>=> {
        const response = await axiosClient.put<ICourse>(`/courses/${id}`, course)
        return response.data
    },

    deleteCourse: async (id: string): Promise<void> => {
        await axiosClient.delete(`/courses/${id}`)
    },
}