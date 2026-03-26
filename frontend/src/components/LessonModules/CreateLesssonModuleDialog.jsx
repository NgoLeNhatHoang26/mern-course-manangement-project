import FormDialog from '../common/FormDialog.jsx'
import LessonModuleForm from './LessonModuleForm.jsx'
import { LessonModuleService } from '../../service/lessonModuleService.ts'

export default function CreateLessonModuleDialog({ courseId, onSuccess }) {
    return (
        <FormDialog title="Tạo chương mới" buttonLabel="Thêm chương">
            {({ onClose }) => (
                <LessonModuleForm
                    onSubmit={async (data) => {
                        await LessonModuleService.createModule(courseId, data)
                        onClose()
                        onSuccess?.()
                    }}
                    submitLabel="Tạo chương"
                />
            )}
        </FormDialog>
    )
}