import { useEffect, useState } from "react";
import { CourseService } from "../service/courseService";
import { LessonModuleService } from "../service/lessonModuleService";
import { LessonService} from "../service/lessonService.js";
import { ReviewService } from "../service/reviewService.js";
export const useCourseDetail = (courseId) => {

    const [course, setCourse] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return;

        // Dùng để kiểm tra component này còn sống không
        // Nếu chuyển component khi fetchCourse còn đang chạy
        // -> Màn hình vẫn hiện Loading và thực hiện Fetch component mới
        let isMounted = true;

        setLoading(true);
        const fetchCourse = async () => {
            try {
                const [courseRes, moduleRes, reviewRes] = await Promise.all([
                    CourseService.getCourseById(courseId),
                    LessonModuleService.getAllModulesByCourse(courseId),
                    ReviewService.getAllReviewsByCourse(courseId),
                ]);
                const modules = moduleRes.data || [];

                const modulesWithLessons = await Promise.all(
                    modules.map(async (module) => {
                        const lessonRes = await LessonService.getAllLessonByModule(module.id)
                        return {
                            ...module,
                            lessons: lessonRes.data || [],
                        }
                    })
                )

                setCourse({
                    ...courseRes.data,
                    modules: modulesWithLessons,
                    reviews: reviewRes.data,
                })

            } catch(err) {
                console.error(err)
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCourse();

        return () => {
            isMounted = false;
        }
    }, [courseId])

    return {course, loading}
}