import FormDialog from '../common/FormDialog.jsx'
import LessonForm from './LessonForm.jsx'
import { LessonService } from '../../service/lessonService.ts'

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