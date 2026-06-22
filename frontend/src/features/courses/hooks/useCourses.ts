import { useEffect, useState, useCallback } from 'react'
import { CourseService } from '@features/courses'
import { ICourse, IPagination } from '@features/courses'

interface IFilter {
    search?: string
    level?: string
}

const PAGE_LIMIT = 12

export const useCourses = () => {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [pagination, setPagination] = useState<IPagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [filter, setFilterState] = useState<IFilter>({})
    const [page, setPage] = useState(1)

    const fetchCourses = useCallback(async () => {
        setLoading(true)
        try {
            const result = await CourseService.getAllCourses({ ...filter, page, limit: PAGE_LIMIT })
            setCourses(result.items ?? [])
            setPagination(result.pagination ?? null)
        } catch (error) {
            console.error('Lỗi lấy courses:', error)
        } finally {
            setLoading(false)
        }
    }, [filter, page])

    const setFilter = useCallback((newFilter: IFilter | ((prev: IFilter) => IFilter)) => {
        setFilterState(newFilter)
        setPage(1)
    }, [])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return { courses, loading, filter, pagination, page, setPage, setFilter, refetch: fetchCourses }
}
