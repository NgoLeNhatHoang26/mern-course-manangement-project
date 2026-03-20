import { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { ExpandMore, PlayCircleOutline, MenuBook } from "@mui/icons-material";

export default function LessonModule({ Module }) {
    const [expanded, setExpanded] = useState(false);
    const lessons = Module?.lessons ?? [];

    return (
        <Accordion
            expanded={expanded}
            onChange={(_, val) => setExpanded(val)}
            elevation={0}
            disableGutters
            sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px !important",
                overflow: "hidden",
                "&:before": { display: "none" },
                "&.Mui-expanded": { borderColor: "#c7d2fe" },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: "#6366f1" }} />}
                sx={{
                    px: 2.5,
                    py: 1,
                    bgcolor: expanded ? "#f5f3ff" : "#fff",
                    transition: "background 0.2s",
                    "&:hover": { bgcolor: "#f5f3ff" },
                    "& .MuiAccordionSummary-content": { my: 1 },
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: "100%" }}>
                    {/* Order badge */}
                    <Box
                        sx={{
                            minWidth: 32,
                            height: 32,
                            borderRadius: "8px",
                            bgcolor: expanded ? "#6366f1" : "#e0e7ff",
                            color: expanded ? "#fff" : "#6366f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            transition: "all 0.2s",
                            flexShrink: 0,
                        }}
                    >
                        {Module?.order ?? "—"}
                    </Box>

                    <Stack sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {Module?.title}
                        </Typography>
                        {Module?.description && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {Module.description}
                            </Typography>
                        )}
                    </Stack>

                    <Chip
                        icon={<MenuBook sx={{ fontSize: "13px !important" }} />}
                        label={`${lessons.length} bài`}
                        size="small"
                        sx={{
                            fontSize: "0.7rem",
                            height: 22,
                            bgcolor: "#f1f5f9",
                            color: "#64748b",
                            flexShrink: 0,
                        }}
                    />
                </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 0, py: 0 }}>
                <Divider sx={{ borderColor: "#e0e7ff" }} />

                {lessons.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ px: 2.5, py: 2, fontStyle: "italic" }}
                    >
                        Chưa có bài học nào
                    </Typography>
                ) : (
                    <Stack divider={<Divider sx={{ borderColor: "#f1f5f9" }} />}>
                        {lessons.map((lesson, idx) => (
                            <Stack
                                key={lesson._id ?? lesson.id ?? idx}
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{
                                    px: 2.5,
                                    py: 1.2,
                                    cursor: "pointer",
                                    "&:hover": { bgcolor: "#f8fafc" },
                                    transition: "background 0.15s",
                                }}
                            >
                                <PlayCircleOutline sx={{ fontSize: 18, color: "#6366f1", flexShrink: 0 }} />
                                <Typography variant="body2" sx={{ color: "#334155", flex: 1 }}>
                                    {lesson.title}
                                </Typography>
                                {lesson.duration && (
                                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                        {lesson.duration}
                                    </Typography>
                                )}
                            </Stack>
                        ))}
                    </Stack>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
