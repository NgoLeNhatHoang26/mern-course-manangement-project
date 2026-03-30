import { useEffect, useState } from 'react'
import { CourseService, ICourse } from '../service/courseService'

interface IFilter {
    search?: string
    level?: string
}

export const useCourses = () => {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<IFilter>({})
    const fetchCourses = async () => {
        setLoading(true)
        try {
            const data = await CourseService.getAllCourses(filter)
            setCourses(data || [])
        } catch (error) {
            console.error('Lỗi lấy courses:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [filter])

    return { courses, loading,filter, setFilter, refetch: fetchCourses }
}