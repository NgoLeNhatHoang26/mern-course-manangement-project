import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/ImageURL.js";
import { memo } from "react";
import { StarRounded, PersonRounded } from "@mui/icons-material";

const LEVEL_STYLE = {
    'Cơ bản':    { bgcolor: '#dcfce7', color: '#15803d' },
    'Trung bình':{ bgcolor: '#fef3c7', color: '#b45309' },
    'Nâng cao':  { bgcolor: '#fee2e2', color: '#b91c1c' },
};

const CourseCard = memo(({ course }) => {
    const { _id, title, instructor, level, ratingAverage, studentCount, thumbnail } = course;
    const navigate = useNavigate();
    if (!course) return null;

    const levelStyle = LEVEL_STYLE[level] ?? LEVEL_STYLE['Cơ bản'];

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
            }}
        >
            <CardActionArea
                onClick={() => _id && navigate(`/courses/${_id}`)}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 2,
                    },
                }}
            >
                {/* Thumbnail */}
                <Box
                    sx={{
                        position: 'relative',
                        pt: '56.25%',   /* 16:9 */
                        overflow: 'hidden',
                        bgcolor: 'grey.100',
                        flexShrink: 0,
                    }}
                >
                    <Box
                        component="img"
                        src={getImageUrl(thumbnail)}
                        alt={title}
                        loading="lazy"
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 300ms ease',
                            '.MuiCardActionArea-root:hover &': { transform: 'scale(1.03)' },
                        }}
                    />
                    {/* Level badge */}
                    <Chip
                        label={level}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            fontWeight: 600,
                            fontSize: '0.6875rem',
                            height: 22,
                            ...levelStyle,
                        }}
                    />
                </Box>

                <CardContent sx={{ flex: 1, p: 2, pb: '12px !important' }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                            fontSize: '0.9375rem',
                            lineHeight: 1.4,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: 'text.primary',
                        }}
                    >
                        {title}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
                        <PersonRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {instructor}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarRounded sx={{ fontSize: 14, color: '#f59e0b' }} />
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                            {ratingAverage?.toFixed(1) ?? '—'}
                        </Typography>
                        {studentCount > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                ({studentCount?.toLocaleString()} học viên)
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>

            <CardActions sx={{ px: 2, pb: 2, pt: 0.5 }}>
                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => _id && navigate(`/courses/${_id}`)}
                    sx={{ fontWeight: 500 }}
                >
                    Xem khoá học
                </Button>
            </CardActions>
        </Card>
    );
});

export default CourseCard;
