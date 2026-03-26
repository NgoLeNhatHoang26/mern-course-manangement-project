import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import LessonVideo from "../components/lessons/LessonVideo.jsx";
import LessonContent from "../components/lessons/LessonContent.jsx";
import LessonSidebar from "../components/lessons/LessonSidebar.jsx";
import LessonNavFooter from "../components/lessons/LessonNavFooter.jsx";
import { useLessonDetail } from "../hooks/useLessonDetail.ts";

export default function LessonPage() {
    const { courseId, lessonId } = useParams();

    // moduleId có thể lấy từ params nếu route có, hoặc để undefined
    const { lesson, modules, loading, prevLesson, nextLesson } = useLessonDetail(
        courseId,
        lessonId,
    );

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f8fafc" }}>
            <Header />

            {/* Main content */}
            <Box sx={{ flex: 1, overflow: "hidden", display: "flex" }}>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        height: "calc(100vh - 64px - 65px)",
                    }}
                >
                    {/* Left: video + content — 2/3 */}
                    <Box
                        sx={{
                            flex: "0 0 66.666%",
                            height: "100%",
                            overflowY: "auto",
                            borderRight: "1px solid #e2e8f0",
                        }}
                    >
                        <Box sx={{ p: { xs: 2, md: 3 } }}>
                            <LessonVideo videoUrl={lesson?.videoUrl} />
                            <LessonContent lesson={lesson} />
                        </Box>
                    </Box>

                    {/* Right: sidebar — 1/3 */}
                    <Box
                        sx={{
                            flex: "0 0 33.333%",
                            height: "100%",
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                        }}
                    >
                        <LessonSidebar
                            modules={modules}
                            activeLessonId={lessonId}
                            courseId={courseId}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Footer navigation */}
            <LessonNavFooter
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                courseId={courseId}
            />
        </Box>
    );
}