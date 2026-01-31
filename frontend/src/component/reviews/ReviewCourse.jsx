import { Avatar, Container, Box, Rating, Typography } from '@mui/material';

export default function Review({AvatarSrc, RatingValue, Comment}) {
  return (
    <Container>
      <Avatar
        alt="Remy Sharp"
        src={AvatarSrc}
        sx={{ width: 56, height: 56 }}
      />
      <Box
        sx={{
            display:'flex',
            flexDirection:'column',
            gap: 2,
        }}
      >
        <Rating name="size-medium" defaultValue={2} value={RatingValue} size='small'/>
        <Typography variant="body2" color="text.secondary">
          {Comment}
        </Typography>
      </Box>
      
    </Container>
  );
}