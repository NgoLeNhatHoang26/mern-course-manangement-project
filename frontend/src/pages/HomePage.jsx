import CourseList from "../components/courses/CourseList"
import {Box, Typography } from "@mui/material";
import CreateCourseDialog from "../components/courses/CreateCourseDialog.jsx";
import {useCourses} from "../hooks/useCourses.js";
import CourseFilter from '../components/courses/CourseFilter'
function HomePage() {
    const {courses, refetch, setFilter} = useCourses();


    return (
        <Box
            sx={{ p: 3 }}
        >
            <CourseFilter onFilterChange={setFilter} />
            <Typography variant="h4">Danh sách khóa học</Typography>
            <CreateCourseDialog onSuccess={refetch} />
            <CourseList courses={courses} />

        </Box>
    );
}

export default HomePage;