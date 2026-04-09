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
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại')
            console.error(err)
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
            <DialogTitle>Đặt lại mật khẩu</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}>
                {success ? (
                    <Alert severity="success">
                        Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
                    </Alert>
                ) : (
                    <>
                        <DialogContentText>
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
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleDialogClose}>Đóng</Button>
                {!success && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || !email}
                        startIcon={loading ? <CircularProgress size={16} /> : null}
                    >
                        Gửi link reset
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}