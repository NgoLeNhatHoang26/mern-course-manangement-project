import { Box, CircularProgress, Grid, Typography, Stack } from "@mui/material";
import { SchoolRounded } from "@mui/icons-material";
import { CourseCard } from "@features/courses";
import { useMyEnrollments } from "@features/enrollment/hooks/useMyEnrollements";

function EmptyState() {
    return (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 10 }}>
            <SchoolRounded sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.3 }} />
            <Typography variant="body1" fontWeight={600} color="text.secondary">
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
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" fontWeight={700} color="text.primary" mb={3}>
                Khoá học của tôi
            </Typography>

            {loading ? (
                <Stack alignItems="center" sx={{ py: 10 }}>
                    <CircularProgress size={32} />
                </Stack>
            ) : enrollments.length === 0 ? (
                <EmptyState />
            ) : (
                <Grid container spacing={2.5}>
                    {enrollments.map((enrollment) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={enrollment._id}>
                            <CourseCard course={enrollment.courseId} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
