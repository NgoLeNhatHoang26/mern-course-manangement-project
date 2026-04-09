import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

export default function LessonContent({ lesson }) {
    if (!lesson) return null;

    return (
        <Box sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", flex: 1, mr: 2 }}>
                    {lesson.title}
                </Typography>
                {lesson.duration && (
                    <Chip
                        icon={<AccessTime sx={{ fontSize: "14px !important" }} />}
                        label={`${lesson.duration} phút`}
                        size="small"
                        sx={{ bgcolor: "#f1f5f9", color: "#64748b", flexShrink: 0 }}
                    />
                )}
            </Stack>

            {lesson.isPreview && (
                <Chip label="Xem thử miễn phí" size="small"
                      sx={{ mb: 2, bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 600 }} />
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                {lesson.content}
            </Typography>
        </Box>
    );
}