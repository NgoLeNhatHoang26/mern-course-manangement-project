import { useState } from 'react'
import { TextField } from '@mui/material'
import BaseForm from '../../../components/common/BaseForm.jsx'

const INITIAL_FORM = { title: '', description: '' }

export default function LessonModuleForm({ onSubmit, initialValues = INITIAL_FORM, submitLabel = 'Lưu' }) {
    const [form, setForm] = useState(initialValues)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await onSubmit({ title: form.title, description: form.description })
    }

    return (
        <BaseForm onSubmit={handleSubmit} submitLabel={submitLabel}>
            <TextField
                label="Tên chương"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                fullWidth
            />
            <TextField
                label="Mô tả"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={3}
            />
        </BaseForm>
    )
}