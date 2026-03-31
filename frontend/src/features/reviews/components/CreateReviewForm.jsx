import { useState } from "react";
import { Box, Rating, Stack, TextField, Typography } from "@mui/material";
import { Star } from "@mui/icons-material";
import { ReviewService } from "../../service/reviewService.ts";
import BaseForm from "../../../components/common/BaseForm.jsx";

const INITIAL_FORM = { rating: 0, comment: "" };

export default function CreateReviewForm({ courseId, onSuccess,onSubmit,initialValues = INITIAL_FORM }) {
    const [form, setForm] = useState(INITIAL_FORM);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (onSubmit) {
                // Dùng khi update
                await onSubmit({ rating: form.rating, comment: form.comment })
            } else {
                // Dùng khi create
                await ReviewService.createReview(courseId, { rating: form.rating, comment: form.comment })
                onSuccess?.()
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <BaseForm onSubmit={handleSubmit} submitLabel="Gửi đánh giá">
            <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    Đánh giá của bạn <Box component="span" sx={{ color: "error.main" }}>*</Box>
                </Typography>
                <Rating
                    value={form.rating}
                    onChange={(_, val) => setForm((prev) => ({ ...prev, rating: val }))}
                    icon={<Star fontSize="inherit" />}
                    emptyIcon={<Star fontSize="inherit" />}
                    size="large"
                />
            </Box>

            <TextField
                label="Nhận xét"
                name="comment"
                value={form.comment}
                onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                required
                fullWidth
                multiline
                rows={4}
                placeholder="Chia sẻ cảm nhận của bạn về khoá học..."
            />
        </BaseForm>
    );
}