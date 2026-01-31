import Box from '@mui/material';
import Grid from '@mui/material';
import CourseCard from './CourseCard';

export default function CourseList({courses}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {courses.map((course) => (  
            <Grid 
                item xs={6} md={4}
                key={course.id}
            >
                <CourseCard image={course.image} title={course.title} description={course.description} />
            </Grid>
        ))}
      </Grid>
    </Box>
  );
}