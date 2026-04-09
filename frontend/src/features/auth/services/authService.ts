import axiosClient from '../../../lib/api'

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    userName: string
    email: string
    password: string
}

interface AuthResponse {
    token: string
    user: {
        id: string
        userName: string
        email: string
        role: string
        avatarUrl?: string
        createdAt: string
        isActive: boolean
    }
}

export const authService = {
    login: async ({ email, password }: LoginPayload): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/auth/login', { email, password })
        return response.data
    },

    register: async ({ userName, email, password }: RegisterPayload): Promise<{ message: string }> => {
        const response = await axiosClient.post<{ message: string }>('/auth/register', { userName, email, password })
        return response.data
    },

    getMe: async (): Promise<AuthResponse['user']> => {
        const response = await axiosClient.get<AuthResponse['user']>('/auth/me')
        return response.data
    },
    forgotPassword: async (email: string): Promise<void> => {
        await axiosClient.post('/auth/forgot-password', { email })
    },

    resetPassword: async (token: string, password: string): Promise<void> => {
        await axiosClient.post('/auth/reset-password', { token, password })
    },
}