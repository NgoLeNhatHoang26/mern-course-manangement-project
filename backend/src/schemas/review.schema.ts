import { z } from 'zod'

export const createReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, 'Nhận xét tối thiểu 10 ký tự').max(500),
})

type createReview = z.infer<typeof createReviewSchema>
export const updateReviewSchema = createReviewSchema.partial()