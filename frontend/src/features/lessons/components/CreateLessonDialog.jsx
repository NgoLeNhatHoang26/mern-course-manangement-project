import { useState } from 'react'
import FormDialog from '../../../components/FormDialog.jsx'
import LessonForm from '../components/LessonForm.jsx'
import { LessonService } from '@features/lessons'

export default function CreateLessonDialog({ moduleId, onSuccess }) {
    const [loading, setLoading] = useState(false)

    return (
        <FormDialog title="Tạo bài học mới" buttonLabel="Thêm bài học" loading={loading}>
            {({ onClose }) => (
                <LessonForm
                    loading={loading}
                    onSubmit={async (formData) => {
                        setLoading(true)
                        try {
                            await LessonService.createLesson(moduleId, formData)
                            onClose()
                            onSuccess?.()
                        } finally {
                            setLoading(false)
                        }
                    }}
                    submitLabel="Tạo bài học"
                />
            )}
        </FormDialog>
    )
}