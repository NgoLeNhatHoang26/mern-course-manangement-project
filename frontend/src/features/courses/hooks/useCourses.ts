import { useEffect, useState, useCallback } from 'react'
import { CourseService } from '../services/courseService'
import { ICourse } from '../types/course.interfaces'


interface IFilter {
    search?: string
    level?: string
}

export const useCourses = () => {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilterState] = useState<IFilter>({})
    const fetchCourses = useCallback( async () => {
        setLoading(true)
        try {
            const data = await CourseService.getAllCourses(filter)
            setCourses(data || [])
        } catch (error) {
            console.error('Lỗi lấy courses:', error)
        } finally {
            setLoading(false)
        }
    }, [filter])

    const setFilter = (newFilter: IFilter | ((prev: IFilter) => IFilter)) => {
        setFilterState(newFilter)
    }

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return { courses, loading,filter, setFilter, refetch: fetchCourses }
}