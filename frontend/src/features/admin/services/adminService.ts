import axiosClient from '@/lib/api'
import { IUser } from '../types/admin.types'
import { IDashboard } from "../hooks/useDashboard";

export const AdminService = {
    getDashboard: async (): Promise<IDashboard> => {
        const res = await axiosClient.get('/admin/dashboard')
        return res.data
    },
    getAllUsers: async (): Promise<IUser[]> => {
        const res = await axiosClient.get<IUser[]>('/admin/users')
        return res.data
    },
    updateRole: async (id: string, role: string): Promise<IUser> => {
        const res = await axiosClient.patch<IUser>(`/admin/users/${id}/role`, { role })
        return res.data
    },
    toggleStatus: async (id: string): Promise<IUser> => {
        const res = await axiosClient.patch<IUser>(`/admin/users/${id}/toggle-status`)
        return res.data
    },
}