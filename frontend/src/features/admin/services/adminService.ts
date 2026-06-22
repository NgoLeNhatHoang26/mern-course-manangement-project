import axiosClient from '@/lib/api'
import { IUser, IUserListParams } from '../types/admin.types'
import { IDashboard } from "../hooks/useDashboard";
import { IPaginatedResult } from '@features/courses'

export const AdminService = {
    getDashboard: async (): Promise<IDashboard> => {
        const res = await axiosClient.get('/admin/dashboard')
        return res.data
    },
    getAllUsers: async (params?: IUserListParams): Promise<IPaginatedResult<IUser>> => {
        const res = await axiosClient.get<IPaginatedResult<IUser>>('/admin/users', { params })
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
