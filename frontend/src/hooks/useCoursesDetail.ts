import {useEffect, useRef, useState} from "react";
import { CourseService, ICourse } from "../service/courseService.js";
import { LessonModuleService, ILessonModule } from "../service/lessonModuleService.js";
import { LessonService, ILesson} from "../service/lessonService.ts";
import { ReviewService,IReview} from "../service/reviewService.ts";

interface ILessonModuleWithLessons extends ILessonModule {
    lessons: ILesson[]
}

interface ICourseDetail extends ICourse {
    modules: ILessonModuleWithLessons[]
    reviews: IReview[]
}


export const useCourseDetail = (courseId: string) => {

    const [course, setCourse] = useState<ICourseDetail | null>(null);

    const [loading, setLoading] = useState(true);

    let isMounted = useRef(true);

    const fetchCourse = async () => {
        try {
            const [courseRes, moduleRes, reviewRes] = await Promise.all([
                CourseService.getCourseById(courseId),
                LessonModuleService.getAllModulesByCourse(courseId),
                ReviewService.getAllReviewsByCourse(courseId),
            ]);


            const modules = moduleRes || [];
            const modulesWithLessons: ILessonModuleWithLessons[] = await Promise.all(
                modules.map(async (module: ILessonModule): Promise<ILessonModuleWithLessons> => {
                    const lessons = await LessonService.getLessonsByModule(module._id);
                    return {
                        ...module,
                        lessons: lessons || [],
                    };
                })
            );
            if ( isMounted.current ) {
                setCourse({
                    ...courseRes,
                    modules: modulesWithLessons,
                    reviews: reviewRes,
                });
            }


        } catch(err) {
            console.error(err)
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    useEffect(() => {
        if (!courseId) return
        isMounted.current = true
        setLoading(true)
        fetchCourse()

        return () => {
            isMounted.current = false
        }
    }, [courseId])

    return {course, loading, refetch: fetchCourse};
}