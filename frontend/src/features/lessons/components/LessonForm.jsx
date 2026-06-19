import { useState } from 'react'
import { Alert, Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import { VideoFile } from '@mui/icons-material'
import BaseForm from '../../../components/BaseForm.jsx'

const INITIAL_FORM = {
    title: '',
    content: '',
    duration: '',
    isPreview: false,
    videoUrl: null,
}

const MAX_VIDEO_SIZE_MB = 500
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024

export default function LessonForm({ onSubmit, initialValues = INITIAL_FORM, submitLabel = 'Lưu', loading = false }) {
    const [form, setForm] = useState(initialValues)
    const [videoName, setVideoName] = useState(null)
    const [videoError, setVideoError] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > MAX_VIDEO_SIZE_BYTES) {
            setVideoError(`Video quá lớn. Kích thước tối đa cho phép là ${MAX_VIDEO_SIZE_MB}MB.`)
            e.target.value = ''
            return
        }
        setVideoError('')
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
        <BaseForm onSubmit={handleSubmit} submitLabel={submitLabel} loadingLabel="Đang tạo bài học..." loading={loading}>
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
                {videoError ? (
                    <Alert severity="error" sx={{ mt: 1 }}>{videoError}</Alert>
                ) : (
                    <Typography
                        variant="caption"
                        color={videoName ? 'text.primary' : 'text.secondary'}
                        sx={{ mt: 0.75, display: 'block' }}
                    >
                        {videoName ?? 'Chưa có video bài giảng'}
                    </Typography>
                )}
            </Box>
            <FormControlLabel
                control={<Checkbox name="isPreview" checked={form.isPreview} onChange={handleChange} />}
                label="Cho phép xem thử miễn phí"
            />
        </BaseForm>
    )
}