import { CourseList, CreateCourseDialog, useCourses, CourseFilter } from "@features/courses"
import { Box, Typography, Stack, Divider } from "@mui/material";
import AdminOnlyComponent from "@components/AdminOnlyComponent.jsx";

function HomePage() {
    const { courses, refetch, setFilter } = useCourses();

    return (
        <Box>
            {/* Page header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} mb={3}>
                <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom={false}>
                        Danh sách khoá học
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Khám phá và học các khoá học chất lượng cao
                    </Typography>
                </Box>
                <AdminOnlyComponent>
                    <CreateCourseDialog onSuccess={refetch} />
                </AdminOnlyComponent>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Filter */}
            <CourseFilter onFilterChange={setFilter} />

            {/* Course grid */}
            <CourseList courses={courses} />
        </Box>
    );
}

export default HomePage;
