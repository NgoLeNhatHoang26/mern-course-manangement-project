import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material'
import { authService } from '@features/auth'
import { authSchemas } from '@features/auth/schemas/authSchemas'
import { ROUTES } from '../constants/routes'

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = authSchemas.resetPassword({ token, password, confirmPassword: confirm })
        if (errors.password || errors.confirmPassword) {
            setError(errors.confirmPassword || errors.password || 'Du lieu khong hop le')
            return
        }
        setLoading(true)
        setError('')
        try {
            await authService.resetPassword(token, password)
            setSuccess(true)
            setTimeout(() => navigate(ROUTES.SIGNIN), 2000)
        } catch {
            setError('Token khong hop le hoac da het han')
        } finally {
            setLoading(false)
        }
    }

    if (!token) return (
        <Box display="flex" justifyContent="center" mt={10}>
            <Alert severity="error">Link khong hop le</Alert>
        </Box>
    )

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8fafc">
            <Paper elevation={0} sx={{ p: 4, width: 400, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h5" fontWeight={700} mb={1}>Đặt lại mật khẩu</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Nhập mật khẩu mới của bạn
                </Typography>

                {success ? (
                    <Alert severity="success">
                        Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...
                    </Alert>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            label="Mật khẩu mới"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                        >
                            Đặt lại mật khẩu
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    )
}