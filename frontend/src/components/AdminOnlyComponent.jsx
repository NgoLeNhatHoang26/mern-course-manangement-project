import { useAuthState } from "@/features/auth"

export default function AdminOnlyComponent({ children, fallback = null }) {
    const { user } = useAuthState()

    if (!user) return null
    if (user.role !== 'admin') return fallback

    return children
}