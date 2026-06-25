import {
    Box, Avatar, Typography, Stack, Divider, Chip,
    Grid, Paper, LinearProgress, Skeleton,
} from "@mui/material";
import {
    EmailRounded,
    CalendarTodayRounded,
    SchoolRounded,
    MenuBookRounded,
    EmojiEventsRounded,
    CheckCircleRounded,
    PlayCircleRounded,
} from "@mui/icons-material";
import { useAuthState } from "@features/auth";
import { useMyEnrollments } from "@features/enrollment/hooks/useMyEnrollements";
import { getImageUrl } from "../utils/ImageURL.js";


function StatCard({ icon, label, value, loading, accent }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'box-shadow 200ms ease',
                '&:hover': { boxShadow: 2 },
                height: '100%',
            }}
        >
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    bgcolor: accent?.bg ?? 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accent?.color ?? 'text.secondary',
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box>
                {loading ? (
                    <Skeleton width={32} height={28} />
                ) : (
                    <Typography variant="h5" fontWeight={700} color="text.primary" lineHeight={1}>
                        {value}
                    </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
                    {label}
                </Typography>
            </Box>
        </Paper>
    );
}

function InfoRow({ icon, children }) {
    return (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0 }}>
                {icon}
            </Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
                {children}
            </Typography>
        </Stack>
    );
}

function EnrollmentRow({ enrollment }) {
    const course = enrollment.courseId;
    const progress = enrollment.progress ?? 0;
    const done = progress >= 100;

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Box
                component="img"
                src={getImageUrl(course?.thumbnail)}
                alt={course?.title ?? 'Course'}
                loading="lazy"
                sx={{
                    width: 72,
                    height: 50,
                    borderRadius: 1.5,
                    objectFit: 'cover',
                    flexShrink: 0,
                    bgcolor: 'grey.100',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    noWrap
                    sx={{ mb: 0.25 }}
                >
                    {course?.title ?? '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, display: 'block' }}>
                    {course?.instructor}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">Tiến độ</Typography>
                    <Typography
                        variant="caption"
                        fontWeight={600}
                        color={done ? 'success.main' : 'text.primary'}
                    >
                        {progress}%
                    </Typography>
                </Stack>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    color={done ? 'success' : 'primary'}
                    sx={{ height: 4, borderRadius: 2, bgcolor: 'grey.200' }}
                />
            </Box>

            <Chip
                icon={
                    done
                        ? <CheckCircleRounded sx={{ fontSize: '14px !important' }} />
                        : <PlayCircleRounded sx={{ fontSize: '14px !important' }} />
                }
                label={done ? 'Hoàn thành' : 'Đang học'}
                size="small"
                sx={{
                    flexShrink: 0,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    bgcolor: done ? 'success.light' : 'grey.100',
                    color: done ? 'success.dark' : 'text.secondary',
                    '& .MuiChip-icon': { ml: '6px' },
                }}
            />
        </Stack>
    );
}

function EnrollmentRowSkeleton() {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="rounded" width={72} height={50} />
            <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={18} />
                <Skeleton width="40%" height={14} sx={{ mt: 0.5 }} />
                <Skeleton width="100%" height={4} sx={{ mt: 1, borderRadius: 2 }} />
            </Box>
            <Skeleton variant="rounded" width={72} height={24} />
        </Stack>
    );
}


const ROLE_LABEL = { admin: 'Admin', instructor: 'Giảng viên', student: 'Học viên' };
const ROLE_STYLE = {
    admin:      { bgcolor: '#fef3c7', color: '#b45309' },
    instructor: { bgcolor: '#dbeafe', color: '#1d4ed8' },
    student:    { bgcolor: 'grey.100', color: 'text.secondary' },
};

export default function MyProfilePage() {
    const { user } = useAuthState();
    const { enrollments, loading } = useMyEnrollments();

    if (!user) return null;

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit', month: 'long', year: 'numeric',
          })
        : '—';

    const completed = enrollments.filter((e) => (e.progress ?? 0) >= 100).length;
    const inProgress = enrollments.filter((e) => (e.progress ?? 0) < 100 && (e.progress ?? 0) > 0).length;
    const role = user.role ?? 'student';
    const roleStyle = ROLE_STYLE[role] ?? ROLE_STYLE.student;

    const stats = [
        {
            icon: <SchoolRounded />,
            label: 'Đã đăng ký',
            value: enrollments.length,
            accent: { bg: '#f0f0f0', color: '#292929' },
        },
        {
            icon: <MenuBookRounded />,
            label: 'Đang học',
            value: inProgress,
            accent: { bg: '#dbeafe', color: '#1d4ed8' },
        },
        {
            icon: <EmojiEventsRounded />,
            label: 'Hoàn thành',
            value: completed,
            accent: { bg: '#dcfce7', color: '#16a34a' },
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>

            <Typography variant="h5" fontWeight={700} color="text.primary" mb={3}>
                Hồ sơ cá nhân
            </Typography>

            <Grid container spacing={3} alignItems="flex-start">

                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
                    >
                        <Box
                            sx={{
                                height: 80,
                                background: 'linear-gradient(135deg, #000000 0%, #292929 100%)',
                            }}
                        />

                        <Box sx={{ px: 2.5, pb: 3 }}>
                            <Box sx={{ mt: '-40px', mb: 1.5 }}>
                                <Avatar
                                    src={getImageUrl(user.avatarUrl)}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        border: '3px solid',
                                        borderColor: 'background.paper',
                                        boxShadow: 2,
                                    }}
                                >
                                    {!user.avatarUrl && user.userName?.[0]?.toUpperCase()}
                                </Avatar>
                            </Box>

                            <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.3}>
                                {user.userName}
                            </Typography>
                            <Chip
                                label={ROLE_LABEL[role] ?? role}
                                size="small"
                                sx={{ mt: 0.75, fontWeight: 600, fontSize: '0.7rem', ...roleStyle }}
                            />

                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={1.25}>
                                <InfoRow icon={<EmailRounded sx={{ fontSize: 15 }} />}>
                                    {user.email}
                                </InfoRow>
                                <InfoRow icon={<CalendarTodayRounded sx={{ fontSize: 15 }} />}>
                                    Tham gia {joinedDate}
                                </InfoRow>
                            </Stack>

                            {user.bio && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {user.bio}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                    <Stack spacing={3}>

                        <Grid container spacing={2}>
                            {stats.map((s) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
                                    <StatCard {...s} loading={loading} />
                                </Grid>
                            ))}
                        </Grid>

                        <Paper
                            elevation={0}
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
                        >
                            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                                        Khoá học của tôi
                                    </Typography>
                                    {!loading && enrollments.length > 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                            {enrollments.length} khoá
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>

                            <Box sx={{ px: 3, py: 2.5 }}>
                                {loading ? (
                                    <Stack spacing={2.5}>
                                        {[1, 2, 3].map((i) => <EnrollmentRowSkeleton key={i} />)}
                                    </Stack>
                                ) : enrollments.length === 0 ? (
                                    <Stack alignItems="center" spacing={1} py={5}>
                                        <SchoolRounded sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.3 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Bạn chưa đăng ký khoá học nào
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Stack
                                        spacing={0}
                                        divider={<Divider sx={{ my: 2 }} />}
                                    >
                                        {enrollments.map((enrollment) => (
                                            <EnrollmentRow key={enrollment._id} enrollment={enrollment} />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>

                    </Stack>
                </Grid>

            </Grid>
        </Box>
    );
}
