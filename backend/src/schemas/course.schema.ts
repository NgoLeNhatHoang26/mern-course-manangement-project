import { z } from 'zod'

// Dùng Schema trong middleware
// Dùng Input cho controller

export const createCourseSchema = z.object({
    title: z.string().min(3, 'Tên khoá học tối thiểu 3 ký tự').max(100),
    description: z.string().min(10, 'Mô tả tối thiểu 10 ký tự'),
    level: z.enum(['Cơ bản', 'Trung bình', 'Nâng cao']),
    instructor: z.string().min(2),
    thumbnail: z.string()
})
export type CreateCourseInput = z.infer<typeof createCourseSchema>

export const updateCourseSchema = createCourseSchema.partial()
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>