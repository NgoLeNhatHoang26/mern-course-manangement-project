import { useState } from 'react'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import BaseForm from '../common/BaseForm.jsx'

const LEVELS = ['Cơ bản', 'Trung bình', 'Nâng cao']

const INITIAL_FORM = {
    title: '',
    description: '',
    level: '',
    instructor: '',
    thumbnail: null,
}

export default function CourseForm({ onSubmit, initialValues = INITIAL_FORM, submitLabel = 'Lưu' }) {
    const [form, setForm] = useState(initialValues)
    const [preview, setPreview] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setForm((prev) => ({ ...prev, thumbnail: file }))
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Chỉ dùng FormData khi có file thumbnail mới
        if (form.thumbnail instanceof File) {
            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('description', form.description)
            formData.append('level', form.level)
            formData.append('instructor', form.instructor)
            formData.append('thumbnail', form.thumbnail)
            await onSubmit(formData)
        } else {
            // Không có file mới → gửi JSON bình thường
            await onSubmit({
                title: form.title,
                description: form.description,
                level: form.level,
                instructor: form.instructor,
            })
        }
    }

    return (
        <BaseForm onSubmit={handleSubmit} submitLabel={submitLabel}>
            <TextField label="Tên khoá học" name="title" value={form.title} onChange={handleChange} required fullWidth />
            <TextField label="Mô tả" name="description" value={form.description} onChange={handleChange} required fullWidth multiline rows={3} />
            <TextField label="Giảng viên" name="instructor" value={form.instructor} onChange={handleChange} required fullWidth />
            <TextField label="Cấp độ" name="level" value={form.level} onChange={handleChange} required fullWidth select>
                {LEVELS.map((lv) => (
                    <MenuItem key={lv} value={lv}>{lv}</MenuItem>
                ))}
            </TextField>
            <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>Thumbnail</Typography>
                <Button variant="outlined" component="label" fullWidth>
                    Chọn ảnh
                    <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </Button>
                {preview && (
                    <Box component="img" src={preview} alt="preview"
                         sx={{ mt: 1.5, width: '100%', borderRadius: 1, maxHeight: 200, objectFit: 'cover' }} />
                )}
            </Box>
        </BaseForm>
    )
}