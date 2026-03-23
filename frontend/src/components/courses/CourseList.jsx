import { Box, Grid } from "@mui/material";
import CourseCard from "./CourseCard";


export default function CourseList({ courses }) {
  const data = courses ?? [];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {data.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Box sx={{ height: "100%" }}>
                  <CourseCard course={course} />
              </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}