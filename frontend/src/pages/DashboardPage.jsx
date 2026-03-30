import {
    Box, Grid, Paper, Typography, Stack,
    Avatar, Chip, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material'
import { People, MenuBook, School, Star } from '@mui/icons-material'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts'
import { useDashboard } from '../hooks/useDashboard'
import Loading from '../components/common/Loading'

const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']

const STAT_CARDS = (stats) => [
    { label: 'Tổng người dùng', value: stats.totalUsers, icon: <People />, color: '#6366f1' },
    { label: 'Tổng khoá học', value: stats.totalCourses, icon: <MenuBook />, color: '#f59e0b' },
    { label: 'Tổng enroll', value: stats.totalEnrollments, icon: <School />, color: '#10b981' },
    { label: 'Tổng đánh giá', value: stats.totalReviews, icon: <Star />, color: '#ef4444' },
]

export default function DashboardPage() {
    const { dashboard, loading } = useDashboard()

    if (loading) return <Loading />
    if (!dashboard) return null

    const { stats, enrollmentsByMonth, topCourses, recentUsers } = dashboard

    const chartData = enrollmentsByMonth.map((item) => ({
        name: MONTHS[item._id.month - 1],
        enrollments: item.count,
    }))

    return (
        <Box sx={{ display: 'flex',flexDirection: 'column',width: '100%', gap: 2}}>
            <Typography variant="h5" fontWeight={700} mb={3}>Dashboard</Typography>

            {/* Dòng 1 — Stats Cards */}
            <Grid container spacing={2} mb={3}>
                {STAT_CARDS(stats).map((card) => (
                    <Grid item xs={12} sm={6} md={3} key={card.label}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                                    <Typography variant="h4" fontWeight={800} mt={0.5}>{card.value}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: card.color, width: 48, height: 48 }}>
                                    {card.icon}
                                </Avatar>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Dòng 2 — Biểu đồ + Users mới */}
            <Grid container spacing={3} mb={3} pb={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>
                            Enrollments 6 tháng gần nhất
                        </Typography>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                                <YAxis tick={{ fontSize: 13 }} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="enrollments"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4} >
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', overflow: 'scroll' }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>
                            Người dùng mới
                        </Typography>
                        <Stack spacing={2}>z
                            {recentUsers.map((user) => (
                                <Stack key={user._id} direction="row" alignItems="center" spacing={1.5}>
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#6366f1', fontSize: 14 }}>
                                        {user.userName[0].toUpperCase()}
                                    </Avatar>
                                    <Box flex={1} minWidth={0}>
                                        <Typography variant="body2" fontWeight={600} noWrap>{user.userName}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
                                    </Box>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        color={user.role === 'admin' ? 'error' : 'default'}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dòng 3 — Top courses — full width */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                    Top khoá học được enroll nhiều nhất
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Khoá học</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Giảng viên</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Cấp độ</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Số enroll</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {topCourses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography color="text.secondary" py={2}>Chưa có dữ liệu</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                topCourses.map((course, index) => (
                                    <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                        <TableCell>
                                            <Typography fontWeight={700} color={index < 3 ? '#f59e0b' : 'text.secondary'}>
                                                #{index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{course.title}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{course.instructor}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={course.level} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Star sx={{ fontSize: 15, color: '#f59e0b' }} />
                                                <Typography variant="body2">
                                                    {course.ratingAverage?.toFixed(1) ?? '—'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={course.enrollmentCount} color="primary" size="small" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}