import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function LessonNavFooter({ prevLesson, nextLesson, courseId }) {
    const navigate = useNavigate();

    const go = (lesson) => {
        if (!lesson) return;
        navigate(`/courses/${courseId}/lessons/${lesson._id ?? lesson.id}`);
    };

    return (
        <Box sx={{ bgcolor: "#fff", borderTop: "1px solid #e2e8f0" }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ px: { xs: 2, md: 4 }, py: 1.5, maxWidth: "lg", mx: "auto" }}
            >
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => go(prevLesson)}
                    disabled={!prevLesson}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 140, justifyContent: "flex-start" }}
                >
                    <Box sx={{ textAlign: "left" }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                            Bài trước
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3,
                            maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {prevLesson?.title ?? "—"}
                        </Typography>
                    </Box>
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                <Button
                    endIcon={<ArrowForward />}
                    onClick={() => go(nextLesson)}
                    disabled={!nextLesson}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 140, justifyContent: "flex-end" }}
                >
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                            Bài tiếp theo
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3,
                            maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {nextLesson?.title ?? "—"}
                        </Typography>
                    </Box>
                </Button>
            </Stack>
        </Box>
    );
}