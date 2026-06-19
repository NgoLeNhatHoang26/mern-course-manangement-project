import * as React from 'react';
import CourseForm from "./CourseForm.jsx";
import FormDialog from '../../../components/FormDialog.jsx';
import {CourseService} from "@features/courses";

export default function CreateCourseDialog({ onSuccess }) {
    return (
        <FormDialog title="Tạo khóa học mới" buttonLabel="Thêm khóa học">
            {({ onClose }) => (
                <CourseForm
                    onSubmit={async (formData) => {
                        try {
                            await CourseService.createCourse(formData)
                            onClose()
                            onSuccess?.()
                        } catch {
                            // Surface error through form validation/toast upstream.
                        }
                    }}
                    submitLabel="Tạo khóa học"
                />
            )}
        </FormDialog>
    )
}