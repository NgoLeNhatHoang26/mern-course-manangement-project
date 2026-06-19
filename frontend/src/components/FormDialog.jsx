import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

export default function FormDialog({ title, buttonLabel = "Thêm mới", children, loading = false }) {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        if (loading) return;
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined" startIcon={<Add />} onClick={() => setOpen(true)} size="small">
                {buttonLabel}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                disableEscapeKeyDown={loading}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {title}
                    <IconButton onClick={handleClose} size="small" disabled={loading}>
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {typeof children === "function"
                        ? children({ onClose: handleClose })
                        : children
                    }
                </DialogContent>
            </Dialog>
        </>
    );
}