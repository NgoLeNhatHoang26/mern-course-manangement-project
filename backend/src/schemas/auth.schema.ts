import {z} from 'zod'

export const registerSchema = z.object({
    userName: z.string().min(2, 'Tên phải tối thiểu 2 ký tự').max(50),
    email: z.email('Email không hợp lệ'),
    password: z.string().min(6,"Mật khẩu phải tối thiểu 6 ký tự")
})
export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.email('Email không hợp lệ'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})
export type LoginInput = z.infer<typeof loginSchema>