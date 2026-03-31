import {Container, Box, Typography} from '@mui/material'

export default function LessonCard({courseOrder, lesson_name, duration}) {
    return (
        <Container
            sx={{
                display: 'flex',
                height: {
                    sm: '55px',
                    md: '75px',
                },
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    mr: 2,
                }}
            >
            <Typography variant="h6">{courseOrder}. {lesson_name}</Typography>
            <Typography variant="body2">{duration}</Typography>
            </Box>
            <Box>

            </Box>
        </Container>
    );
}