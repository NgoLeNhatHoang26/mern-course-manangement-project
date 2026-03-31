import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LessonCard from './LessonCard';
import { memo } from 'react';
const LessonList = memo(({ lessons }) => {
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
})
export default LessonList;