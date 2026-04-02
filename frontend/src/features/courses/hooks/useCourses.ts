import { useEffect, useState, useCallback } from 'react'
import { CourseService } from '@features/courses'
import { ICourse } from '@features/courses'


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
            setCourses((data || []).filter(course => course))
        } catch (error) {
            console.error('Lỗi lấy courses:', error)
        } finally {
            setLoading(false)
        }
    }, [filter])

    const setFilter = useCallback((newFilter: IFilter | ((prev: IFilter) => IFilter)) => {
        setFilterState(newFilter)
    },[])
    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return { courses, loading,filter, setFilter, refetch: fetchCourses }
}