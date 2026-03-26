import { useState } from "react";
import {TextField } from "@mui/material";
import {LessonModuleService} from "../../service/lessonModuleService.ts";
import BaseForm from "../common/BaseForm.jsx";

const INITIAL_FORM = { title: "", description: "", order: "" };

export default function CreateLessonModuleForm({ courseId, onSuccess }) {
    const [form, setForm] = useState(INITIAL_FORM);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: form.title,
                description: form.description,
            };

            const res = await LessonModuleService.createModule(courseId, payload)
            console.log(res)
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <BaseForm
        onSubmit={handleSubmit}
        submitLabel="Tạo chương">
                <TextField
                    label="Tên chương"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    rows={3}
                />
        </BaseForm>
    );
}
