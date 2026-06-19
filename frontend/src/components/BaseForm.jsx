import { Box, Button, CircularProgress, Stack } from "@mui/material";

export default function BaseForm({ onSubmit, children, submitLabel = "Tạo mới", loadingLabel, loading = false }) {
    const label = loading ? (loadingLabel ?? 'Đang xử lý...') : submitLabel;

    return (
        <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
                {children}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {label}
                </Button>
            </Stack>
        </Box>
    );
}