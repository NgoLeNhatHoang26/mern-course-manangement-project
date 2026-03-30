import { useEffect, useState } from 'react'
import { IUser } from '../service/userService.ts'
import { AdminService} from "../service/adminService.ts";

export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await AdminService.getAllUsers()
            console.log('users data:', data)
            setUsers(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleStatus = async (id: string) => {
        const updated = await AdminService.toggleStatus(id)
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: updated.isActive } : u))
    }

    const handleUpdateRole = async (id: string, role: string) => {
        const updated = await AdminService.updateRole(id, role)
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: updated.role } : u))
    }

    return { users, loading, handleToggleStatus, handleUpdateRole, refetch: fetchUsers }
}