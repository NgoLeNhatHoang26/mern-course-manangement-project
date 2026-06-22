import { useRef, useState } from 'react';
import CourseForm from "./CourseForm.jsx";
import FormDialog from '../../../components/FormDialog.jsx';
import {CourseService} from "@features/courses";

export default function CreateCourseDialog({ onSuccess }) {
    const [loading, setLoading] = useState(false);
    const submittingRef = useRef(false);
    const idempotencyKeyRef = useRef(null);

    return (
        <FormDialog title="Tạo khóa học mới" buttonLabel="Thêm khóa học" loading={loading}>
            {({ onClose }) => (
                <CourseForm
                    loading={loading}
                    onSubmit={async (formData) => {
                        if (submittingRef.current) return;
                        submittingRef.current = true;
                        if (!idempotencyKeyRef.current) {
                            idempotencyKeyRef.current = crypto.randomUUID();
                        }
                        setLoading(true);
                        try {
                            await CourseService.createCourse(formData, idempotencyKeyRef.current);
                            idempotencyKeyRef.current = null;
                            onClose();
                            onSuccess?.();
                        } catch {
                            // Surface error through form validation/toast upstream.
                        } finally {
                            setLoading(false);
                            submittingRef.current = false;
                        }
                    }}
                    submitLabel="Tạo khóa học"
                />
            )}
        </FormDialog>
    )
}
