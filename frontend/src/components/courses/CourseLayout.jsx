import {
    Box,
    Container,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
    LinearProgress,
    Avatar,
} from "@mui/material";
import {
    Person,
    Star,
    MenuBook,
    PlayLesson,
} from "@mui/icons-material";

import { useNavigate } from 'react-router-dom'
import { CourseService } from '../../service/courseService'
import CourseForm from './CourseForm.jsx'
import ReviewList from "../reviews/ReviewList";
import LessonModule from "../LessonModules/LessonModule.jsx";
import {getImageUrl} from "../../utils/ImageURL.js";
import CreateLessonModuleDialog from "../LessonModules/CreateLesssonModuleDialog.jsx";
import CreateReviewDialog from "../reviews/CreateReviewDialog.jsx";
import EnrollButton from "./EnrollButton";
import EditMenu from "../common/EditMenu";
const LEVEL_COLOR = {
    "Cơ bản":    { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    "Trung bình": { bg: "#fff8e1", color: "#f57f17", border: "#ffe082" },
    "Nâng cao":  { bg: "#fce4ec", color: "#c62828", border: "#f48fb1" },
};

function StarRating({ value = 0, count = 0 }) {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
            {stars.map((s) => (
                <Star
                    key={s}
                    sx={{
                        fontSize: 18,
                        color: s <= Math.round(value) ? "#f59e0b" : "#e2e8f0",
                    }}
                />
            ))}
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", ml: 0.5 }}>
                {value > 0 ? value.toFixed(1) : "—"}
            </Typography>
            {count > 0 && (
                <Typography variant="body2" color="text.secondary">
                    ({count} đánh giá)
                </Typography>
            )}
        </Stack>
    );
}

function ModuleProgressBar({ modules = [] }) {
    const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0);
    return (
        <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <MenuBook sx={{ fontSize: 15, color: "#6366f1" }} />
                        <Typography variant="caption" color="text.secondary">
                            {modules.length} chương
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PlayLesson sx={{ fontSize: 15, color: "#6366f1" }} />
                        <Typography variant="caption" color="text.secondary">
                            {totalLessons} bài học
                        </Typography>
                    </Stack>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                    {totalLessons} bài
                </Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#e2e8f0",
                    "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        borderRadius: 3,
                    },
                }}
            />
        </Stack>
    );
}

export default function CourseLayout({course, refetch}) {
    if (!course) return null;

    const resolvedLessonModules = course?.modules ?? [];
    const resolvedReviews = course?.reviews ?? [];
    const levelStyle = LEVEL_COLOR[course.level] ?? LEVEL_COLOR["Cơ bản"];

    const navigate = useNavigate()
    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 6 }}>

            {/* Hero — thumbnail + info */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 220, sm: 320, md: 400 },
                    overflow: "hidden",
                    bgcolor: "#1e293b",
                }}
            >
                {course.thumbnail ? (
                    <Box
                        component="img"
                        src={getImageUrl(course.thumbnail)}
                        alt={course.thumbnail}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.55,
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                        }}
                    />
                )}

                {/* Overlay text */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        p: { xs: 2.5, md: 5 },
                        background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)",
                    }}
                >
                    <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                label={course.level ?? "Cơ bản"}
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "0.72rem",
                                    bgcolor: levelStyle.bg,
                                    color: levelStyle.color,
                                    border: `1px solid ${levelStyle.border}`,
                                }}
                            />
                        </Stack>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "#fff",
                                lineHeight: 1.25,
                                fontSize: { xs: "1.4rem", md: "2rem" },
                                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                            }}
                        >
                            {course.title}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ width: 26, height: 26, bgcolor: "#6366f1", fontSize: 13 }}>
                                <Person sx={{ fontSize: 15 }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ color: "#cbd5e1", fontWeight: 500 }}>
                                {course.instructor}
                            </Typography>
                        </Stack>

                        <StarRating value={course.ratingAverage} count={course.ratingCount} />
                        <EnrollButton
                            courseId={course._id}
                            modules={resolvedLessonModules}
                        />
                    </Stack>
                </Box>
                <EditMenu
                        itemName={course.title}
                        onDelete={async () => {
                            await CourseService.deleteCourse(course._id)
                            navigate('/')
                        }}
                        renderEditForm={({ onClose }) => (
                            <CourseForm
                                onSubmit={async (formData) => {
                                    await CourseService.updateCourse(course._id, formData)
                                    onClose()
                                    refetch?.()
                                }}
                                initialValues={{ title: course.title, description: course.description, level: course.level, instructor: course.instructor, thumbnail: null }}
                                submitLabel="Cập nhật"
                            />
                        )}
                        containerSx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
                        buttonSx={{ bgcolor: 'rgba(0,0,0,0.4)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
                    />


            </Box>

            {/* Body */}
            <Container maxWidth="lg" sx={{ mt: "-32px", position: "relative", zIndex: 1 }}>
                <Stack spacing={3}>

                    {/* Description */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 3.5 },
                            borderRadius: 3,
                            border: "1px solid #e2e8f0",
                            bgcolor: "#fff",
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#1e293b" }}>
                            Mô tả khoá học
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                            {course.description}
                        </Typography>
                    </Paper>

                    {/* Modules */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 3.5 },
                            borderRadius: 3,
                            border: "1px solid #e2e8f0",
                            bgcolor: "#fff",
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                    Nội dung khoá học
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <CreateLessonModuleDialog courseId={course._id} onSuccess={refetch}/>
                                </Stack>


                            </Stack>

                            <ModuleProgressBar modules={resolvedLessonModules} />

                            <Divider />

                            <Stack spacing={1}>
                                {resolvedLessonModules.map((module) => (
                                    <LessonModule Module={module} key={module.id ?? module._id} onSuccess={refetch} />
                                ))}
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Reviews */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 3.5 },
                            borderRadius: 3,
                            border: "1px solid #e2e8f0",
                            bgcolor: "#fff",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                Đánh giá
                            </Typography>
                            <CreateReviewDialog courseId={course._id} onSuccess={refetch} />
                            <StarRating value={course.ratingAverage} count={course.ratingCount} />
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <ReviewList Reviews={resolvedReviews} onSuccess = {refetch} />
                    </Paper>

                </Stack>
            </Container>
        </Box>
    );
}
