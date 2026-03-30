import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Review from './ReviewCourse';

export default function ReviewList({Reviews, onSuccess}) {
    const reviews = Reviews || []
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {
          reviews.map((review, index) => (
            <Box key={index}>
              <Review review={review} onSuccess={onSuccess}/>
            </Box>
          ))
        }
      </Stack>
    </Box>
  );
}