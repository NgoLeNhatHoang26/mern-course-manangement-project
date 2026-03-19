import {
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ReviewList from "../reviews/ReviewList";
import LessonModule from "../lessons/LessonModule";
export default function CourseLayout({ course, lessonModules, reviews }) {
  if (!course) return null;

  const resolvedLessonModules = lessonModules ?? course?.modules ?? [];
  const resolvedReviews = reviews ?? course?.reviews ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Title */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Instructor: <Box component="span" sx={{ fontWeight: 600 }}>{course.instructor}</Box>
          </Typography>
        </Box>

        <Divider />

        {/* Description */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {course.description}
          </Typography>
        </Paper>

        {/* Lessons */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Lessons
          </Typography>
          <Stack spacing={1}>
            {resolvedLessonModules.map((module) => (
              <LessonModule Module={module} key={module.id ?? module._id} />
            ))}
          </Stack>
        </Paper>

        {/* Reviews */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Reviews
          </Typography>
          <ReviewList reviews={resolvedReviews} />
        </Paper>
      </Stack>
    </Container>
  );
}