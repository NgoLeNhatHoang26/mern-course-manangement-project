import { useEffect, useState, useCallback } from 'react'
import { IUser } from '../types/admin.types'
import { IPagination } from '@features/courses'
import { AdminService } from "../services/adminService";

const PAGE_LIMIT = 20

export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [pagination, setPagination] = useState<IPagination | null>(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const result = await AdminService.getAllUsers({ page, limit: PAGE_LIMIT })
            setUsers(result.items ?? [])
            setPagination(result.pagination ?? null)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleToggleStatus = async (id: string) => {
        const updated = await AdminService.toggleStatus(id)
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: updated.isActive } : u))
    }

    const handleUpdateRole = async (id: string, role: string) => {
        const updated = await AdminService.updateRole(id, role)
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: updated.role } : u))
    }

    return { users, loading, pagination, page, setPage, handleToggleStatus, handleUpdateRole, refetch: fetchUsers }
}
