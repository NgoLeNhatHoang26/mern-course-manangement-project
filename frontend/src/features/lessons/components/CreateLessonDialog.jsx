import FormDialog from '../../../components/FormDialog.jsx'
import LessonForm from '../components/LessonForm.jsx'
import { LessonService } from '@features/lessons'

export default function CreateLessonDialog({ moduleId, onSuccess }) {
    return (
        <FormDialog title="Tạo bài học mới" buttonLabel="Thêm bài học">
            {({ onClose }) => (
                <LessonForm
                    onSubmit={async (formData) => {
                        await LessonService.createLesson(moduleId, formData)
                        onClose()
                        onSuccess?.()
                    }}
                    submitLabel="Tạo bài học"
                />
            )}
        </FormDialog>
    )
}