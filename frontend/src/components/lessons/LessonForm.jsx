import { useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import { VideoFile } from '@mui/icons-material'
import BaseForm from '../common/BaseForm.jsx'

const INITIAL_FORM = {
    title: '',
    content: '',
    duration: '',
    isPreview: false,
    videoUrl: null,
}

export default function LessonForm({ onSubmit, initialValues = INITIAL_FORM, submitLabel = 'Lưu' }) {
    const [form, setForm] = useState(initialValues)
    const [videoName, setVideoName] = useState(null)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setForm((prev) => ({ ...prev, videoUrl: file }))
        setVideoName(file.name)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('content', form.content)
        formData.append('duration', form.duration)
        formData.append('isPreview', String(form.isPreview))
        if (form.videoUrl) formData.append('videoUrl', form.videoUrl)
        await onSubmit(formData)
    }

    return (
        <BaseForm onSubmit={handleSubmit} submitLabel={submitLabel}>
            <TextField
                label="Tên bài học"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                fullWidth
            />
            <TextField
                label="Nội dung"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={3}
            />
            <TextField
                label="Thời lượng (phút)"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
            />
            <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                    Video bài giảng
                </Typography>
                <Button variant="outlined" component="label" fullWidth startIcon={<VideoFile />}>
                    {videoName ? 'Đổi video' : 'Chọn video'}
                    <input type="file" accept="video/*" hidden onChange={handleFileChange} />
                </Button>
                <Typography
                    variant="caption"
                    color={videoName ? 'text.primary' : 'text.secondary'}
                    sx={{ mt: 0.75, display: 'block' }}
                >
                    {videoName ?? 'Chưa có video bài giảng'}
                </Typography>
            </Box>
            <FormControlLabel
                control={<Checkbox name="isPreview" checked={form.isPreview} onChange={handleChange} />}
                label="Cho phép xem thử miễn phí"
            />
        </BaseForm>
    )
}