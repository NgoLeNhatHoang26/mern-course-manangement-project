import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CreateCourseForm from "./CreateCourseForm.jsx";

export default function FormDialog({ name }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                {name}
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Tạo khoá học mới</DialogTitle>
                <DialogContent>
                    <CreateCourseForm onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}