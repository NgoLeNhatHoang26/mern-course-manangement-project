import { useRef, useState } from 'react'
import FormDialog from '../../../components/FormDialog.jsx'
import LessonModuleForm from './LessonModuleForm.jsx'
import { LessonModuleService } from '@features/courses'

export default function CreateLessonModuleDialog({ courseId, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const submittingRef = useRef(false)
    const idempotencyKeyRef = useRef(null)

    return (
        <FormDialog title="Tạo chương mới" buttonLabel="Thêm chương" loading={loading}>
            {({ onClose }) => (
                <LessonModuleForm
                    loading={loading}
                    onSubmit={async (data) => {
                        if (submittingRef.current) return
                        submittingRef.current = true
                        if (!idempotencyKeyRef.current) {
                            idempotencyKeyRef.current = crypto.randomUUID()
                        }
                        setLoading(true)
                        try {
                            await LessonModuleService.createModule(courseId, data, idempotencyKeyRef.current)
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
                    submitLabel="Tạo chương"
                />
            )}
        </FormDialog>
    )
}
