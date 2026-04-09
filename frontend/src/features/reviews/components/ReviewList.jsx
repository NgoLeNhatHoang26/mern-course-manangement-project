import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Review from './ReviewCourse';
import { memo } from 'react';
const ReviewList = memo(({ Reviews, onSuccess }) => {
    const reviews = Reviews || []
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {
          reviews.map((review) => (
            <Box key={review._id || review.id}>
              <Review review={review} onSuccess={onSuccess}/>
            </Box>
          ))
        }
      </Stack>
    </Box>
  );
})
export default ReviewList;