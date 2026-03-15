import { Box, Grid } from "@mui/material";
import CourseCard from "./CourseCard";

const placeholderCourses = [
  {
    id: 1,
    title: "React for Beginners",
    instructor: "John Doe",
    level: "Beginner",
    rating: 4.5,
    students: 1200,
    thumbnail:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    title: "Advanced JavaScript Mastery",
    instructor: "Jane Smith",
    level: "Advanced",
    rating: 4.8,
    students: 980,
    thumbnail:
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    title: "Fullstack MERN Bootcamp",
    instructor: "Alex Nguyen",
    level: "Intermediate",
    rating: 4.7,
    students: 2150,
    thumbnail:
      "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function CourseList({ courses }) {
  const data = courses && courses.length ? courses : placeholderCourses;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {data.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}