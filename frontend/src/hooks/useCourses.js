import { useEffect, useState } from "react";
import { CourseService } from "../service/courseService";


export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
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
    useEffect(() => {
        fetchCourses();
    }, []);

    return { courses, refetch: fetchCourses};
}