import { Avatar, Box, Divider, Rating, Stack, Typography } from '@mui/material';

export default function Review({ AvatarSrc, RatingValue, Comment, userName, createdAt }) {
    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
        : null;

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                    src={AvatarSrc}
                    sx={{ width: 40, height: 40, bgcolor: "#6366f1", fontSize: 15, flexShrink: 0 }}
                >
                    {!AvatarSrc && (userName?.[0]?.toUpperCase() ?? "U")}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                            {userName ?? "Người dùng"}
                        </Typography>
                        {formattedDate && (
                            <Typography variant="caption" color="text.secondary">
                                {formattedDate}
                            </Typography>
                        )}
                    </Stack>

                    <Rating value={RatingValue} readOnly size="small" sx={{ mb: 0.75 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {Comment}
                    </Typography>
                </Box>
            </Stack>
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
}