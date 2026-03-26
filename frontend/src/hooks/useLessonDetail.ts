import { useEffect, useState } from "react";
import { LessonService } from "../service/lessonService.ts";
import { LessonModuleService } from "../service/lessonModuleService.ts";

export const useLessonDetail = (courseId, lessonId) => {
    const [lesson, setLesson] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lessonId || !courseId) return;
        let isMounted = true;

        const fetch = async () => {
            setLoading(true);
            try {
                const [lessonRes, moduleRes] = await Promise.all([
                    LessonService.getLessonById(lessonId),
                    LessonModuleService.getAllModulesByCourse(courseId),
                ]);

                const modulesWithLessons = await Promise.all(
                    (moduleRes || []).map(async (mod) => {
                        const lessons = await LessonService.getAllLessonByModule(mod._id ?? mod.id);
                        return { ...mod, lessons: lessons || [] };
                    })
                );

                if (isMounted) {
                    setLesson(lessonRes);
                    setModules(modulesWithLessons);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetch();
        return () => { isMounted = false; };
    }, [lessonId, courseId]);

    const allLessons = modules.flatMap((mod) => mod.lessons ?? []);
    const currentIndex = allLessons.findIndex((l) => (l._id ?? l.id) === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return { lesson, modules, loading, prevLesson, nextLesson };
};