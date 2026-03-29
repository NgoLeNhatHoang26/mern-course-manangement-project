import { z } from 'zod'

export const createLessonSchema = z.object({
    title: z.string().min(3, { message: 'Tên bài học tối thiểu 3 ký tự' }).max(100),
    content: z.string().min(10, { message: 'Nội dung tối thiểu 10 ký tự' }),
    duration: z.coerce.number().min(1, { message: 'Thời lượng tối thiểu 1 phút' }),
    isPreview: z.coerce.boolean().optional().default(false),
})

export type CreateLessonInput = z.infer<typeof createLessonSchema>
export const updateLessonSchema = createLessonSchema.partial()