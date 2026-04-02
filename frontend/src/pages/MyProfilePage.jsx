import {
    Box, Avatar, Typography, Stack, Divider, Chip,
    Grid, Paper, CircularProgress, LinearProgress
} from "@mui/material";
import { Email, CalendarToday, School, MenuBook } from "@mui/icons-material";
import { useAuthState } from "@features/auth";
import { useMyEnrollments } from "@features/enrollment";
import { getImageUrl } from "../utils/ImageURL.js";

function StatCard({ icon, label, value }) {
    return (
        <Paper elevation={0} sx={{
            p: 3, borderRadius: 2, border: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", gap: 2,
        }}>
            <Box sx={{
                width: 52, height: 52, borderRadius: 2,
                bgcolor: "#e0e7ff", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#6366f1", flexShrink: 0,
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="h5" fontWeight={800} color="#1e293b" lineHeight={1}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.3}>
                    {label}
                </Typography>
            </Box>
        </Paper>
    );
}

function EnrollmentRow({ enrollment }) {
    const course = enrollment.courseId;
    const progress = enrollment.progress ?? 0;
    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box
                    component="img"
                    src={getImageUrl(course?.thumbnail)}
                    alt={course?.title}
                    sx={{
                        width: 72, height: 50, borderRadius: 1.5,
                        objectFit: "cover", flexShrink: 0, bgcolor: "#e2e8f0",
                    }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} color="#1e293b" noWrap>
                        {course?.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {course?.instructor}
                    </Typography>
                    <Box sx={{ mt: 0.8 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.3}>
                            <Typography variant="caption" color="text.secondary">Tiến độ</Typography>
                            <Typography variant="caption" fontWeight={600} color="#6366f1">{progress}%</Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 5, borderRadius: 3,
                                bgcolor: "#e2e8f0",
                                "& .MuiLinearProgress-bar": {
                                    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                                    borderRadius: 3,
                                },
                            }}
                        />
                    </Box>
                </Box>
                <Chip
                    label={progress === 100 ? "Hoàn thành" : "Đang học"}
                    size="small"
                    sx={{
                        flexShrink: 0,
                        bgcolor: progress === 100 ? "#dcfce7" : "#e0e7ff",
                        color: progress === 100 ? "#16a34a" : "#4f46e5",
                        fontWeight: 600, fontSize: "0.7rem",
                    }}
                />
            </Stack>
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
}

export default function MyProfilePage() {
    const { user } = useAuthState();
    const { enrollments, loading } = useMyEnrollments();

    if (!user) return null;

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric"
        })
        : "—";

    const completed = enrollments.filter(e => (e.progress ?? 0) >= 100).length;
    const inProgress = enrollments.filter(e => (e.progress ?? 0) < 100).length;

    return (
        <Box>
            <Typography variant="h5" fontWeight={800} color="#1e293b" mb={3}>
                Hồ sơ của tôi
            </Typography>

            <Grid container spacing={3} alignItems="flex-start">

                {/* LEFT — profile card */}
                <Grid item xs={12} lg={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        <Stack alignItems="center" spacing={2}>
                            <Avatar
                                src={getImageUrl(user.avatarUrl)}
                                sx={{ width: 88, height: 88, bgcolor: "#6366f1", fontSize: 32, fontWeight: 700 }}
                            >
                                {!user.avatarUrl && user.userName?.[0]?.toUpperCase()}
                            </Avatar>

                            <Box textAlign="center">
                                <Typography variant="h6" fontWeight={700} color="#1e293b">
                                    {user.userName}
                                </Typography>
                                <Chip label="Học viên" size="small" sx={{
                                    mt: 0.5, bgcolor: "#e0e7ff", color: "#4f46e5",
                                    fontWeight: 600, fontSize: "0.72rem",
                                }} />
                            </Box>

                            <Divider flexItem />

                            <Stack spacing={1.5} sx={{ width: "100%" }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Email sx={{ fontSize: 17, color: "#94a3b8", flexShrink: 0 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                    }}>
                                        {user.email}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <CalendarToday sx={{ fontSize: 17, color: "#94a3b8", flexShrink: 0 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Tham gia {joinedDate}
                                    </Typography>
                                </Stack>
                            </Stack>

                            {user.bio && (
                                <>
                                    <Divider flexItem />
                                    <Typography variant="body2" color="text.secondary"
                                                textAlign="center" sx={{ lineHeight: 1.7 }}>
                                        {user.bio}
                                    </Typography>
                                </>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                {/* RIGHT — stats + courses */}
                <Grid item xs={12} lg={9}>
                    <Stack spacing={3}>

                        {/* Stats */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <StatCard icon={<School />} label="Đã đăng ký"
                                          value={loading ? <CircularProgress size={20} /> : enrollments.length} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <StatCard icon={<MenuBook />} label="Đang học"
                                          value={loading ? <CircularProgress size={20} /> : inProgress} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <StatCard icon={<School />} label="Hoàn thành"
                                          value={loading ? <CircularProgress size={20} /> : completed} />
                            </Grid>
                        </Grid>

                        {/* Recent courses */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                            <Typography variant="subtitle1" fontWeight={700} color="#1e293b" mb={2.5}>
                                Khoá học gần đây
                            </Typography>

                            {loading ? (
                                <Stack alignItems="center" py={4}><CircularProgress /></Stack>
                            ) : enrollments.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    Chưa đăng ký khoá học nào
                                </Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {enrollments.slice(0, 5).map((enrollment) => (
                                        <EnrollmentRow key={enrollment._id} enrollment={enrollment} />
                                    ))}
                                </Stack>
                            )}
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}