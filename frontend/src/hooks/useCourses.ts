import { useEffect, useState } from 'react'
import { CourseService, ICourse } from '../service/courseService'

export const useCourses = () => {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const data = await CourseService.getAllCourses()
            setCourses(data || [])
        } catch (error) {
            console.error('Lỗi lấy courses:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    return { courses, loading, refetch: fetchCourses }
}