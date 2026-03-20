
import { useEffect, useState } from "react";
import { CourseService } from "../service/courseService";
import CourseList from "../components/courses/CourseList"
import {Box, Typography } from "@mui/material";
import Button  from "@mui/material/Button";
import FormDialog from "../components/courses/CreateCourseDialog.jsx";
function HomePage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
        setLoading(true)
        try {
            const data = await CourseService.getAllCourses();
            setCourses(data || []);
        } catch (error) {
            console.error("Lỗi lấy courses:", error);
        } finally {
            setLoading(false);
        }
        };
        
        fetchCourses();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Typography variant="h4">Danh sách khóa học</Typography>

            <FormDialog name={"Tạo khóa học"} />
            <CourseList courses={courses} />

        </Box>

    );
}

export default HomePage;