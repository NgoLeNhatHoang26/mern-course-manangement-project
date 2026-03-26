import axiosClient from './api'

export interface ICourse {
    _id: string
    title: string
    description: string
    level: string
    instructor: string
    thumbnail?: string
    createdAt: string
    updatedAt: string
}

export const CourseService = {
    getAllCourses: async (): Promise<ICourse[]> => {
        const response = await axiosClient.get<ICourse[]>('/courses')
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