import { Avatar, Box, Divider, Rating, Stack, Typography } from '@mui/material';
import EditMenu from '../../../components/common/EditMenu.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { ReviewService } from '../../service/reviewService.ts'
import CreateReviewForm from './CreateReviewForm.jsx'
import { memo } from 'react';

const Review = memo(({ review, onSuccess }) => {
    const { user } = useAuth()
    const isOwner = user?._id === review.userId?._id || user?.id === review.userId?._id
    const isAdmin = user?.role === 'admin'
    const canEdit = isOwner || isAdmin

    const formattedDate = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        })
        : null
    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                    src={review.userId?.avatarUrl}
                    sx={{ width: 40, height: 40, bgcolor: '#6366f1', fontSize: 15, flexShrink: 0 }}
                >
                    {!review.userId?.avatarUrl && (review.userId?.userName?.[0]?.toUpperCase() ?? 'U')}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {review.userId?.userName ?? 'Người dùng'}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            {formattedDate && (
                                <Typography variant="caption" color="text.secondary">
                                    {formattedDate}
                                </Typography>
                            )}

                            {canEdit && (
                                <EditMenu
                                    itemName="đánh giá này"
                                    onDelete={async () => {
                                        await ReviewService.deleteReview(review._id)
                                        onSuccess?.()
                                    }}
                                    // Chỉ owner mới thấy nút chỉnh sửa, admin chỉ xóa
                                    renderEditForm={isOwner ? ({ onClose }) => (
                                        <CreateReviewForm
                                            courseId={review.courseId}
                                            initialValues={{ rating: review.rating, comment: review.comment }}
                                            onSubmit={async (data) => {
                                                await ReviewService.updateReview(review._id, data)
                                                onClose()
                                                onSuccess?.()
                                            }}
                                            submitLabel="Cập nhật"
                                        />
                                    ) : undefined}
                                    buttonSx={{ color: 'text.secondary', p: 0.5 }}
                                />
                            )}
                        </Stack>
                    </Stack>

                    <Rating value={review.rating} readOnly size="small" sx={{ mb: 0.75 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {review.comment}
                    </Typography>
                </Box>
            </Stack>
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
})

export default Review;