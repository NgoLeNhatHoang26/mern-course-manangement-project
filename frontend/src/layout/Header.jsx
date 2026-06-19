import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import AuthSection from "./AuthSection.jsx";
import { ROUTES } from "../constants/routes";

export default function Header() {
    return (
        <AppBar position="sticky" color="default">
            <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 56, sm: 60 } }}>
                {/* Brand */}
                <Box
                    component={Link}
                    to={ROUTES.HOME}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        mr: 4,
                        '&:focus-visible': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                            outlineOffset: 2,
                            borderRadius: 1,
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.main',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'primary.contrastText',
                                fontWeight: 800,
                                fontSize: '0.875rem',
                                letterSpacing: '-0.5px',
                            }}
                        >
                            F8
                        </Typography>
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'text.primary',
                            letterSpacing: '-0.2px',
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        Course Management
                    </Typography>
                </Box>

                {/* Nav links */}
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
                >
                    {[
                        { label: 'Trang chủ', to: ROUTES.HOME },
                        { label: 'Khoá học của tôi', to: ROUTES.MY_COURSES },
                    ].map(({ label, to }) => (
                        <Box
                            key={to}
                            component={Link}
                            to={to}
                            sx={{
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'text.primary',
                                textDecoration: 'none',
                                transition: 'background-color 200ms ease',
                                '&:hover': { bgcolor: 'grey.100' },
                                '&:focus-visible': {
                                    outline: '2px solid',
                                    outlineColor: 'primary.main',
                                    outlineOffset: 2,
                                    borderRadius: 1,
                                },
                            }}
                        >
                            {label}
                        </Box>
                    ))}
                </Stack>

                <AuthSection />
            </Toolbar>
        </AppBar>
    );
}
