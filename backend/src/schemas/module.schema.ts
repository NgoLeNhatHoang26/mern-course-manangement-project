import { z } from 'zod'

export const createModuleSchema = z.object({
    title: z.string().min(3, { message: 'Tên chương tối thiểu 3 ký tự' }).max(100),
    description: z.string().min(10, { message: 'Mô tả tối thiểu 10 ký tự' }).max(500),
})

type createModuleInput = z.infer<typeof createModuleSchema>
export const updateModuleSchema = createModuleSchema.partial()