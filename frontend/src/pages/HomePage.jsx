
import { useEffect, useState } from "react";
import { CourseService } from "../service/courseService";
import CourseList from "../components/courses/CourseList"
import {Box, Typography } from "@mui/material";
import Button  from "@mui/material/Button";
import CreateCourseDialog from "../components/courses/CreateCourseDialog.jsx";
import {useCourses} from "../hooks/useCourses";
function HomePage() {
    const {courses, refetch} = useCourses();


    return (
        <Box
            sx={{
                gap: 1,
            }}

        >
            <Typography variant="h4">Danh sách khóa học</Typography>

            <CreateCourseDialog onSuccess={refetch} />
            <CourseList courses={courses} />

        </Box>

    );
}

export default HomePage;