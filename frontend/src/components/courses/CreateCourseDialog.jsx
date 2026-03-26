import * as React from 'react';
import CourseForm from "./CourseForm.jsx";
import FormDialog from '../common/FormDialog.jsx';
import {CourseService} from "../../service/courseService.js";

export default function CreateCourseDialog({ onSuccess }) {
    return (
        <FormDialog title="Tạo khóa học mới" buttonLabel="Thêm khóa học">
            {({ onClose }) => (
                <CourseForm
                    onSubmit={async (formData) => {
                        await CourseService.createCourse(formData)
                        onClose()
                        onSuccess?.()
                    }}
                    submitLabel="Tạo khóa học"
                />
            )}
        </FormDialog>
    )
}