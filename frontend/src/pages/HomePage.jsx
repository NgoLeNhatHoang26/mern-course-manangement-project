import { CourseList, CreateCourseDialog, useCourses, CourseFilter } from "@features/courses"
import {Box, Typography } from "@mui/material";
import AdminOnlyComponent from "@components/AdminOnlyComponent.jsx";
function HomePage() {
    const {courses, refetch, setFilter} = useCourses();

    return (
        <Box
            sx={{ p: 3 }}
        >
            <CourseFilter onFilterChange={setFilter} />
            <Typography variant="h4">Danh sách khóa học</Typography>
            <AdminOnlyComponent>
                <CreateCourseDialog onSuccess={refetch} />
            </AdminOnlyComponent>
            <CourseList courses={courses} />

        </Box>
    );
}

export default HomePage;