import { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { PlayArrow, School } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { EnrollmentService } from "../../service/enrollmentService.js";

export default function EnrollButton({ courseId, modules = [] }) {
    const navigate = useNavigate();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    // Kiểm tra đã enroll chưa khi load
    useEffect(() => {
        if (!courseId) return;
        const check = async () => {
            try {
                const res = await EnrollmentService.checkEnrollment(courseId);
                setIsEnrolled(res.isEnrolled);
            } catch {
                setIsEnrolled(false);
            } finally {
                setLoading(false);
            }
        };
        check();
    }, [courseId]);

    // Lấy lesson đầu tiên từ module đầu tiên
    const firstLesson = modules
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        ?.[0]?.lessons
        ?.slice()
        ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        ?.[0];

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            await EnrollmentService.enroll(courseId);
            setIsEnrolled(true);
        } catch (error) {
            console.error(error);
        } finally {
            setEnrolling(false);
        }
    };

    const handleContinue = () => {
        if (!firstLesson) return;
        navigate(`/courses/${courseId}/lessons/${firstLesson._id ?? firstLesson.id}`);
    };

    if (loading) {
        return <CircularProgress size={24} />;
    }

    if (isEnrolled) {
        return (
            <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleContinue}
                disabled={!firstLesson}
                sx={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    fontWeight: 700,
                    px: 4,
                    "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
                }}
            >
                Tiếp tục học
            </Button>
        );
    }

    return (
        <Button
            variant="contained"
            size="large"
            startIcon={enrolling ? <CircularProgress size={16} sx={{ color: "white" }} /> : <School />}
            onClick={handleEnroll}
            disabled={enrolling}
            sx={{
                bgcolor: "#0f172a",
                fontWeight: 700,
                px: 4,
                "&:hover": { bgcolor: "#1e293b" },
            }}
        >
            {enrolling ? "Đang đăng ký..." : "Đăng ký khoá học"}
        </Button>
    );
}