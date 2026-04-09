import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

export default function FormDialog({ title, buttonLabel = "Thêm mới", children }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="outlined" startIcon={<Add />} onClick={() => setOpen(true)} size="small">
                {buttonLabel}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {title}
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {typeof children === "function"
                        ? children({ onClose: () => setOpen(false) }) // ← truyền onClose vào form
                        : children
                    }
                </DialogContent>
            </Dialog>
        </>
    );
}