import { useState, useEffect } from 'react'
import { authService } from '../service/authService'

interface IUser {
    userName: string
    email: string
    password: string
    role: string
}

export const useAuth = () => {
    const [user, setUser] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }

        authService.getMe()
            .then((res) => setUser(res.data))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false))
    }, [])

    const isAdmin = user?.role === 'admin'
    const isLoggedIn = Boolean(user)

    return { user, loading, isAdmin, isLoggedIn }
}