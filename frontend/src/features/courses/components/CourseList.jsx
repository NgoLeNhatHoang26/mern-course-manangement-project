import { Box, Grid, Typography, Stack } from "@mui/material";
import { SearchOffRounded } from "@mui/icons-material";
import CourseCard from "./CourseCard";

function EmptyState() {
    return (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 10 }}>
            <SearchOffRounded sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.4 }} />
            <Typography variant="body1" fontWeight={600} color="text.secondary">
                Không tìm thấy khoá học nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Thử thay đổi từ khoá hoặc bộ lọc tìm kiếm.
            </Typography>
        </Stack>
    );
}

const CourseList = ({ courses }) => {
    if (!courses || courses.length === 0) return <EmptyState />;

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                {courses.length} khoá học
            </Typography>
            <Grid container spacing={2.5}>
                {courses.filter(Boolean).map((course) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course._id}>
                        <CourseCard course={course} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CourseList;
