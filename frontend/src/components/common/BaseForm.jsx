import {Box, Button, Stack} from "@mui/material";
export default function BaseForm({ onSubmit, children, submitLabel = "Tạo mới" }) {
    return (
        <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
                {children} {/* ← các TextField của từng form */}
                <Button type="submit" variant="contained" size="large" fullWidth>
                    {submitLabel}
                </Button>
            </Stack>
        </Box>
    );
}