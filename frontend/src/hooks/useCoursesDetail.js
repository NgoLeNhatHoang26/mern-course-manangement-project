import { useEffect, useState } from "react";
import { CourseService } from "../service/courseService";
import { LessonModuleService } from "../service/lessonModuleService";
import { LessonService} from "../service/lessonService.js";
import { ReviewService } from "../service/reviewService.js";
export const useCourseDetail = (courseId) => {

    const [course, setCourse] = useState(null);

    const [loading, setLoading] = useState(true);

    let isMounted = true;

    const fetchCourse = async () => {
        try {
            const [courseRes, moduleRes, reviewRes] = await Promise.all([
                CourseService.getCourseById(courseId),
                LessonModuleService.getAllModulesByCourse(courseId),
                ReviewService.getAllReviewsByCourse(courseId),
            ]);


            const modules = moduleRes || [];
            console.log(modules);
            const modulesWithLessons = await Promise.all(
                modules.map(async (module) => {
                    const lessons = await LessonService.getAllLessonByModule(module._id);
                    return {
                        ...module,
                        lessons: lessons || [],
                    };
                })
            );

            setCourse({
                ...courseRes,
                modules: modulesWithLessons,
                reviews: reviewRes,
            });

        } catch(err) {
            console.error(err)
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    useEffect(() => {
        if (!courseId) return;

        // Dùng để kiểm tra component này còn sống không
        // Nếu chuyển component khi fetchCourse còn đang chạy
        // -> Màn hình vẫn hiện Loading và thực hiện Fetch component mới
        setLoading(true);

        fetchCourse();

        return () => {
            isMounted = false;
        }
    }, [courseId])
    console.log(course);
    return {course, loading, refetch: fetchCourse};
}