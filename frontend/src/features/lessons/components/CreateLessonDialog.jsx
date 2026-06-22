import { useRef, useState } from 'react'
import FormDialog from '../../../components/FormDialog.jsx'
import LessonForm from '../components/LessonForm.jsx'
import { LessonService } from '@features/lessons'

export default function CreateLessonDialog({ moduleId, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const submittingRef = useRef(false)
    const idempotencyKeyRef = useRef(null)

    return (
        <FormDialog title="Tạo bài học mới" buttonLabel="Thêm bài học" loading={loading}>
            {({ onClose }) => (
                <LessonForm
                    loading={loading}
                    onSubmit={async (formData) => {
                        if (submittingRef.current) return
                        submittingRef.current = true
                        if (!idempotencyKeyRef.current) {
                            idempotencyKeyRef.current = crypto.randomUUID()
                        }
                        setLoading(true)
                        try {
                            await LessonService.createLesson(moduleId, formData, idempotencyKeyRef.current)
                            idempotencyKeyRef.current = null
                            onClose()
                            onSuccess?.()
                        } catch {
                            // Surface error through form validation/toast upstream.
                        } finally {
                            setLoading(false)
                            submittingRef.current = false
                        }
                    }}
                    submitLabel="Tạo bài học"
                />
            )}
        </FormDialog>
    )
}
