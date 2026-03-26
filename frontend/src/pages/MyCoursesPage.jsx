import { Box, CircularProgress, Grid, Typography, Stack } from "@mui/material";
import { School } from "@mui/icons-material";
import CourseCard from "../components/courses/CourseCard.jsx";
import { useMyEnrollments } from "../hooks/useMyCourse.ts";

function EmptyState() {
    return (
        <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
            <School sx={{ fontSize: 64, color: "#cbd5e1" }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>
                Bạn chưa đăng ký khoá học nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Khám phá các khoá học và bắt đầu học ngay hôm nay!
            </Typography>
        </Stack>
    );
}

export default function MyCoursesPage() {
    const { enrollments, loading } = useMyEnrollments();

    return (
        <Box>
            <Typography variant="h5" fontWeight={800} color="#1e293b" mb={3}>
                Khoá học của tôi
            </Typography>

            {loading ? (
                <Stack alignItems="center" sx={{ py: 10 }}>
                    <CircularProgress />
                </Stack>
            ) : enrollments.length === 0 ? (
                <EmptyState />
            ) : (
                <Grid container spacing={3}>
                    {enrollments.map((enrollment) => (
                        <Grid item xs={12} sm={6} md={4} key={enrollment._id}>
                            <CourseCard course={enrollment.courseId} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}