import { useAuth } from '../../hooks/useAuth'

export default function AdminOnly({ children, fallback = null }) {
    const { isAdmin, loading } = useAuth()

    if (loading) return null
    if (!isAdmin) return fallback

    return children
}