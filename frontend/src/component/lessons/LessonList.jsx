import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import LessonCard from './LessonCard';

export default function LessonList({ lessons }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {
          lessons.map((lesson, index) => (
            <Box key={index}>
              <LessonCard courseOrder={lesson.courseOrder} lesson_name={lesson.lesson_name} duration={lesson.duration} />
            </Box>
          ))
        }
      </Stack>
    </Box>
  );
}