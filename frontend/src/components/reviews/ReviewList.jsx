import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Review from './ReviewCourse';

export default function ReviewList({courseReviews}) {
    const reviews = courseReviews || []
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {
          reviews.map((review, index) => (
            <Box key={index}>
              <Review AvatarSrc={review.avatar} RatingValue={review.rating} Comment={review.comment} />
            </Box>
          ))
        }
      </Stack>
    </Box>
  );
}