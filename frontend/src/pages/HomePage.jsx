import { CourseList, CreateCourseDialog, useCourses, CourseFilter } from "@features/courses"
import { Box, Typography, Stack, Divider, Pagination } from "@mui/material";
import AdminOnlyComponent from "@components/AdminOnlyComponent.jsx";

function HomePage() {
    const { courses, refetch, setFilter, pagination, page, setPage } = useCourses();

    return (
        <Box>
            {/* Page header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} mb={3}>
                <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom={false}>
                        Danh sách khoá học
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {pagination
                            ? `${pagination.total} khoá học`
                            : 'Khám phá và học các khoá học chất lượng cao'}
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

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4} mb={2}>
                    <Pagination
                        count={pagination.totalPages}
                        page={page}
                        onChange={(_e, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}
        </Box>
    );
}

export default HomePage;
