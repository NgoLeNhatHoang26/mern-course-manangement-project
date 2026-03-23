import { Box, Typography } from "@mui/material";
import { VideocamOff } from "@mui/icons-material";
import { getImageUrl } from "../../utils/ImageURL.js";

export default function LessonVideo({ videoUrl }) {
    if (!videoUrl) {
        return (
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    bgcolor: "#0f172a",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    gap: 1,
                }}
            >
                <VideocamOff sx={{ fontSize: 40, color: "#475569" }} />
                <Typography variant="body2" color="#475569">
                    Bài giảng chưa được đăng tải
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component="video"
            src={getImageUrl(videoUrl)}
            controls
            sx={{
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: 2,
                bgcolor: "#000",
                display: "block",
            }}
        />
    );
}