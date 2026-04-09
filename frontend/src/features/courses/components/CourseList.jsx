import { Box, Grid, Typography } from "@mui/material";
import CourseCard from "./CourseCard";


const CourseList = ({ courses }) => {

  if (!courses || courses.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="textSecondary">
          Không tìm thấy khóa học nào phù hợp.
        </Typography>
      </Box>
    );
  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {courses.filter(course => course).map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Box sx={{ height: "100%" }}>
                  <CourseCard 
                    course={course}
                  />
              </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CourseList;