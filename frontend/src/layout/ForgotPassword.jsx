import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Alert, CircularProgress } from '@mui/material'
import { authService } from '@features/auth'

const focusVisibleOutline = {
    outline: '2px solid var(--color-surface-base)',
    outlineOffset: 'var(--space-2)',
};

export default function ForgotPassword({ open, handleClose }) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await authService.forgotPassword(email)
            setSuccess(true)
        } catch {
            setError('Có lỗi xảy ra, vui lòng thử lại')
        } finally {
            setLoading(false)
        }
    }

    const handleDialogClose = () => {
        setEmail('')
        setSuccess(false)
        setError('')
        handleClose()
    }

    return (
        <Dialog open={open} onClose={handleDialogClose}>
            <DialogTitle sx={{ fontSize: 'var(--font-size-3xl)' }}>
                Đặt lại mật khẩu
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}>
                {success ? (
                    <Alert severity="success">
                        Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
                    </Alert>
                ) : (
                    <>
                        <DialogContentText
                            sx={{
                                fontSize: 'var(--font-size-md)',          
                                color: 'var(--color-text-secondary)',       
                            }}
                        >
                            Nhập email tài khoản của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
                        </DialogContentText>
                        {error && <Alert severity="error">{error}</Alert>}
                        <OutlinedInput
                            autoFocus
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            type="email"
                            fullWidth
                            sx={{
                                fontSize: 'var(--font-size-md)',
                                borderRadius: 'var(--radius-xs)',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--color-text-tertiary)',   
                                    borderWidth: '2px',
                                },
                            }}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button
                    onClick={handleDialogClose}
                    sx={{
                        fontSize: 'var(--font-size-md)',
                        transition: `background-color var(--motion-duration-instant)`,
                        '&:hover': { backgroundColor: 'var(--color-surface-raised)' },
                        '&:focus-visible': {
                            ...focusVisibleOutline,
                            borderRadius: 'var(--radius-xs)',
                        },
                    }}
                >
                    Đóng
                </Button>
                {!success && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || !email}
                        startIcon={loading ? <CircularProgress size={16} /> : null}
                        sx={{
                            fontSize: 'var(--font-size-md)',
                            borderRadius: 'var(--radius-xs)',
                            transition: `background-color var(--motion-duration-instant)`,
                            '&:focus-visible': focusVisibleOutline,
                            '&.Mui-disabled': {
                                opacity: 0.38,
                                pointerEvents: 'all',
                                cursor: 'not-allowed',
                            },
                        }}
                    >
                        Gửi link reset
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}
