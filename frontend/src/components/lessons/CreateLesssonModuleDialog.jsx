import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import CreateLessonModuleForm from "./CreateLessonModuleForm.jsx";

export default function CreateLessonModuleDialog({ courseId }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpen(true)}
                size="small"
            >
                Thêm chương
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Tạo chương học mới
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <CreateLessonModuleForm
                        courseId={courseId}
                        onSuccess={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
