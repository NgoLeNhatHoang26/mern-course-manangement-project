import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Chip, Divider, Stack, Typography,
} from "@mui/material";
import { ExpandMore, PlayCircle, PlayCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SidebarLesson({ lesson, isActive, courseId }) {
    const navigate = useNavigate();
    const id = lesson._id ?? lesson.id;

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => navigate(`/courses/${courseId}/lessons/${id}`)}
            sx={{
                px: 2,
                py: 1.2,
                cursor: "pointer",
                bgcolor: isActive ? "#ede9fe" : "transparent",
                borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
                transition: "all 0.15s",
                "&:hover": { bgcolor: isActive ? "#ede9fe" : "#f8fafc" },
            }}
        >
            {isActive
                ? <PlayCircle sx={{ fontSize: 18, color: "#6366f1", flexShrink: 0 }} />
                : <PlayCircleOutline sx={{ fontSize: 18, color: "#94a3b8", flexShrink: 0 }} />
            }
            <Typography
                variant="body2"
                sx={{
                    flex: 1,
                    color: isActive ? "#4f46e5" : "#334155",
                    fontWeight: isActive ? 700 : 400,
                    lineHeight: 1.4,
                }}
            >
                {lesson.title}
            </Typography>
            {lesson.duration && (
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {lesson.duration}p
                </Typography>
            )}
        </Stack>
    );
}

export default function LessonSidebar({ modules, activeLessonId, courseId }) {
    return (
        <Box
            sx={{
                height: "100%",
                overflowY: "auto",
                bgcolor: "#fff",
                borderLeft: "1px solid #e2e8f0",
            }}
        >
            <Typography
                variant="subtitle2"
                sx={{ px: 2, py: 1.5, fontWeight: 700, color: "#1e293b", bgcolor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 1 }}
            >
                Nội dung khoá học
            </Typography>

            {modules.map((mod, idx) => (
                <Accordion key={mod._id ?? mod.id ?? idx} defaultExpanded elevation={0} disableGutters
                           sx={{ "&:before": { display: "none" }, borderBottom: "1px solid #f1f5f9" }}
                >
                    <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18 }} />}
                                      sx={{ px: 2, py: 0.5, minHeight: 44, bgcolor: "#fafafa",
                                          "& .MuiAccordionSummary-content": { my: 0.5 } }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%" }}>
                            <Box sx={{ minWidth: 24, height: 24, borderRadius: "6px", bgcolor: "#e0e7ff",
                                color: "#6366f1", display: "flex", alignItems: "center",
                                justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>
                                {mod.order ?? idx + 1}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", flex: 1,
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {mod.title}
                            </Typography>
                            <Chip label={`${mod.lessons?.length ?? 0} bài`} size="small"
                                  sx={{ height: 18, fontSize: "0.65rem", bgcolor: "#f1f5f9", color: "#64748b",
                                      "& .MuiChip-label": { px: 0.8 } }} />
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 0 }}>
                        <Divider />
                        {(mod.lessons ?? []).map((lesson) => (
                            <SidebarLesson
                                key={lesson._id ?? lesson.id}
                                lesson={lesson}
                                isActive={(lesson._id ?? lesson.id) === activeLessonId}
                                courseId={courseId}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}