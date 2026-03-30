import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton,
    Select, MenuItem, Typography, Avatar, Tooltip
} from '@mui/material'
import { LockOpen, Lock } from '@mui/icons-material'
import { useUsers } from '../hooks/useUsers.js'
import Loading from '../components/common/Loading'

const ROLE_COLOR = {
    admin: 'error',
    user: 'default',
}

export default function UsersPage() {
    const { users, loading, handleToggleStatus, handleUpdateRole } = useUsers()

    if (loading) return <Loading />

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý người dùng ({users.length})
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Người dùng</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Khoá học</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Ngày tham gia</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user._id}
                                sx={{
                                    opacity: user.isActive ? 1 : 0.5,
                                    '&:hover': { bgcolor: '#f8fafc' }
                                }}
                            >
                                {/* Avatar + Tên */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#6366f1', fontSize: 14 }}>
                                            {user.userName[0].toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={600}>
                                            {user.userName}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Email */}
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                    </Typography>
                                </TableCell>

                                {/* Role — dropdown đổi role */}
                                <TableCell>
                                    <Select
                                        value={user.role}
                                        size="small"
                                        onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                        sx={{ fontSize: 13 }}
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                </TableCell>

                                {/* Số khoá học */}
                                <TableCell>
                                    <Chip label={`${user.enrollmentCount} khoá`} size="small" />
                                </TableCell>

                                {/* Ngày tham gia */}
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </TableCell>

                                {/* Trạng thái */}
                                <TableCell>
                                    <Chip
                                        label={user.isActive ? 'Hoạt động' : 'Đã khóa'}
                                        color={user.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>

                                {/* Nút khóa/mở */}
                                <TableCell>
                                    <Tooltip title={user.isActive ? 'Khóa tài khoản' : 'Mở tài khoản'}>
                                        <IconButton
                                            size="small"
                                            color={user.isActive ? 'error' : 'success'}
                                            onClick={() => handleToggleStatus(user._id)}
                                        >
                                            {user.isActive ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}