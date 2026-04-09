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
                        } catch (error) {
                            console.log('Status:', error.response?.status)
                            console.log('Data:', error.response?.data)
                        }
                    }}
                    submitLabel="Tạo khóa học"
                />
            )}
        </FormDialog>
    )
}