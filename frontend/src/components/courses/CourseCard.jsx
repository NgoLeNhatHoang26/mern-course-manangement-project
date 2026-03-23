import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import {getImageUrl} from "../../utils/ImageURL.js";

export default function CourseCard({ course }) {
  const {
    _id,
    title,
    instructor,
    level,
    ratingAverage,
    studentCount,
    thumbnail,
  } = course;
  const navigate = useNavigate();
  const handlClick = (e) => {
    if (!_id)
      return;
    navigate(`/courses/${_id}`)
  }
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea 
        sx={{ alignItems: "stretch" }}
        onClick={handlClick}
      >
          <Box sx={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}> {/* 16:9 */}
              <Box
                  component="img"
                  src={getImageUrl(thumbnail)}
                  alt={title}
                  sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // ← cắt ảnh giữ tỉ lệ, không stretch
                  }}
              />
          </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Chip
            label={level}
            size="small"
            color="primary"
            sx={{ mb: 1, textTransform: "uppercase", fontSize: 10 }}
          />
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
              {instructor?.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {instructor}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Rating
              name="course-rating"
              value={ratingAverage}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {ratingAverage?.toFixed(1) || "0.0"} ({studentCount?.toLocaleString() || 0} studentCount)
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" size="small" fullWidth>
          View Course
        </Button>
      </CardActions>
    </Card>
  );
}