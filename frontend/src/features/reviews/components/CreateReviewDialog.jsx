import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close, RateReview } from "@mui/icons-material";
import CreateReviewForm from "./CreateReviewForm.jsx";

export default function CreateReviewDialog({ courseId, onSuccess }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<RateReview />}
                onClick={() => setOpen(true)}


                size="small"
            >
                Viết đánh giá
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Đánh giá khoá học
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <CreateReviewForm
                        courseId={courseId}
                        onSuccess={() => {
                            setOpen(false);
                            onSuccess?.();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}