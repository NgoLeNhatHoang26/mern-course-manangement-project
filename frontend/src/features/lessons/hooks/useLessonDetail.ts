import { useEffect, useRef, useState } from 'react'
import { LessonService, ILesson } from '../services/lessonService'
import { LessonModuleService, ILessonModule } from '../../courses/services/lessonModuleService'

interface ILessonModuleWithLessons extends ILessonModule {
    lessons: ILesson[]
}

export const useLessonDetail = (courseId: string, lessonId: string) => {
    const [lesson, setLesson] = useState<ILesson | null>(null)
    const [modules, setModules] = useState<ILessonModuleWithLessons[]>([])
    const [loading, setLoading] = useState(true)
    const isMounted = useRef(true)

    useEffect(() => {
        if (!lessonId || !courseId) return
        isMounted.current = true
        setLoading(true)

        const fetchData = async () => {
            try {
                const [lessonRes, moduleRes] = await Promise.all([
                    LessonService.getLessonById(lessonId),
                    LessonModuleService.getAllModulesByCourse(courseId),
                ])

                const modulesWithLessons: ILessonModuleWithLessons[] = await Promise.all(
                    (moduleRes || []).map(async (mod: ILessonModule): Promise<ILessonModuleWithLessons> => {
                        const lessons = await LessonService.getLessonsByModule(mod._id)
                        return { ...mod, lessons: lessons || [] }
                    })
                )

                if (isMounted.current) {
                    setLesson(lessonRes)
                    setModules(modulesWithLessons)
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (isMounted.current) setLoading(false)
            }
        }

        fetchData()

        return () => {
            isMounted.current = false
        }
    }, [lessonId, courseId])

    const allLessons = modules.flatMap((mod) => mod.lessons ?? [])
    const currentIndex = allLessons.findIndex((l) => l._id === lessonId)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    return { lesson, modules, loading, prevLesson, nextLesson }
}