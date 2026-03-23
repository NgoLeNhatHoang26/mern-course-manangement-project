import * as React from 'react';
import CreateCourseForm from "./CreateCourseForm.jsx";
import FormDialog from '../common/FormDialog.jsx';
export default function CreateCourseDialog({onSuccess}) {
    return (
        <FormDialog title="Tạo khóa học mới" buttonLabel="Thêm khóa học">
            {({onClose}) => (
                <CreateCourseForm  onSuccess={() => {onClose(); onSuccess() }} />
        )}
        </FormDialog>
    );
}