import CreateLessonForm from "./CreateLessonForm.jsx";
import FormDialog from "../common/FormDialog.jsx";
export default function CreateLessonDialog({ courseId, moduleId, onSuccess }) {
    return (
        <>
            <FormDialog>
                {({onClose}) => (
                    <CreateLessonForm courseId={courseId} moduleId={moduleId} onSuccess={() => {onClose() ; onSuccess()}} />
                )}
            </FormDialog>
        </>
    );
}