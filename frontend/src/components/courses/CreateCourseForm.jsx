import { useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {CourseService} from "../../service/courseService.js";
const LEVELS = ["Cơ bản", "Trung bình", "Nâng cao"];

const INITIAL_FORM = {
    title: "",
    description: "",
    level: "",
    instructor: "",
    thumbnail: null,
};

export default function CreateCourseForm({onSuccess}) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((prev) => ({ ...prev, thumbnail: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("level", form.level);
        formData.append("instructor", form.instructor);
        if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
        console.log(formData);
        try {
            const res = await CourseService.createCourse(formData)
            console.log(res);
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 480, mx: "auto", mt: 4, p: 3 }}
        >
            <Typography variant="h6" fontWeight={700} mb={3}>
                Tạo khoá học mới
            </Typography>

            <Stack spacing={2.5}>
                <TextField
                    label="Tên khoá học"
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
                    label="Giảng viên"
                    name="instructor"
                    value={form.instructor}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                <TextField
                    label="Cấp độ"
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    required
                    fullWidth
                    select
                >
                    {LEVELS.map((lv) => (
                        <MenuItem key={lv} value={lv}>
                            {lv}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Upload thumbnail */}
                <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Thumbnail
                    </Typography>
                    <Button variant="outlined" component="label" fullWidth>
                        Chọn ảnh
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {preview && (
                        <Box
                            component="img"
                            src={preview}
                            alt="preview"
                            sx={{ mt: 1.5, width: "100%", borderRadius: 1, maxHeight: 200, objectFit: "cover" }}
                        />
                    )}
                </Box>

                <Button type="submit" variant="contained" size="large" fullWidth>
                    Tạo khoá học
                </Button>
            </Stack>
        </Box>
    );
}
