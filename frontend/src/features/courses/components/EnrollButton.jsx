import { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { PlayArrow, School } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { EnrollmentService } from "@features/enrollment";

/* ── WCAG 2.2 AA focus-visible outline ────────────────────────────────────
 * Uses color.surface.base (#000000) for maximum contrast on any button bg.
 * ──────────────────────────────────────────────────────────────────────── */
const focusVisibleOutline = {
    outline: '2px solid var(--color-surface-base)',
    outlineOffset: 'var(--space-2)',
};

const disabledSx = {
    opacity: 0.38,
    pointerEvents: 'all',
    cursor: 'not-allowed',
};

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
            /* "Tiếp tục học" — enrolled state
             * color.text.tertiary (#292929) replaces gradient #6366f1→#8b5cf6
             * hover → color.surface.base (#000000) for deeper contrast
             */
            <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleContinue}
                disabled={!firstLesson}
                sx={{
                    backgroundColor: 'var(--color-text-tertiary)',
                    fontWeight: 700,
                    px: 4,
                    fontSize: 'var(--font-size-md)',
                    transition: `background-color var(--motion-duration-instant)`,
                    '&:hover': {
                        backgroundColor: 'var(--color-surface-base)',
                    },
                    '&:focus-visible': focusVisibleOutline,
                    '&.Mui-disabled': disabledSx,
                }}
            >
                Tiếp tục học
            </Button>
        );
    }

    return (
        /* "Đăng ký khoá học" — unenrolled state
         * color.surface.base (#000000) replaces #0f172a (dark navy)
         * hover → color.text.tertiary (#292929) lightens slightly
         */
        <Button
            variant="contained"
            size="large"
            startIcon={
                enrolling
                    ? <CircularProgress size={16} sx={{ color: 'var(--color-text-inverse)' }} />
                    : <School />
            }
            onClick={handleEnroll}
            disabled={enrolling}
            sx={{
                backgroundColor: 'var(--color-surface-base)',
                fontWeight: 700,
                px: 4,
                fontSize: 'var(--font-size-md)',
                transition: `background-color var(--motion-duration-instant)`,
                '&:hover': {
                    backgroundColor: 'var(--color-text-tertiary)',
                },
                '&:focus-visible': focusVisibleOutline,
                '&.Mui-disabled': disabledSx,
            }}
        >
            {enrolling ? "Đang đăng ký..." : "Đăng ký khoá học"}
        </Button>
    );
}
