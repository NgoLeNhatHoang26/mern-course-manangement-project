import CreateLessonModuleForm from "./CreateLessonModuleForm.jsx";
import FormDialog from "../common/FormDialog.jsx";
export default function CreateLessonModuleDialog({ courseId, onSuccess}) {

    return (
        <>
            <FormDialog title="Tạo chương học mới" buttonLabel="Thêm chương">
                {({ onClose }) => (
                    <CreateLessonModuleForm courseId={courseId} onSuccess={() => { onClose(); onSuccess() }} />
                )}
            </FormDialog>
        </>
    );
}
