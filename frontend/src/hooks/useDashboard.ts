import { useEffect, useState } from 'react'
import { AdminService } from '../service/adminService'

interface IStats {
    totalUsers: number
    totalCourses: number
    totalEnrollments: number
    totalReviews: number
}

interface IEnrollmentByMonth {
    _id: { year: number; month: number }
    count: number
}

interface ITopCourse {
    title: string
    instructor: string
    level: string
    ratingAverage: number
    enrollmentCount: number
}

interface IRecentUser {
    _id: string
    userName: string
    email: string
    role: string
    createdAt: string
}

export interface IDashboard {
    stats: IStats
    enrollmentsByMonth: IEnrollmentByMonth[]
    topCourses: ITopCourse[]
    recentUsers: IRecentUser[]
}

export const useDashboard = () => {
    const [dashboard, setDashboard] = useState<IDashboard | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await AdminService.getDashboard()
                setDashboard(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])

    return { dashboard, loading }
}