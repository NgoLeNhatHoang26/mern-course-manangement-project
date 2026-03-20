import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

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
                courseId,
                title: form.title,
                description: form.description,
                order: Number(form.order),
            };
            // TODO: thay bằng LessonModuleService.createModule(payload)
            console.log("Submit:", payload);
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
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
                <TextField
                    label="Thứ tự"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    required
                    fullWidth
                    type="number"
                    inputProps={{ min: 1 }}
                />
                <Button type="submit" variant="contained" size="large" fullWidth>
                    Tạo chương
                </Button>
            </Stack>
        </Box>
    );
}
