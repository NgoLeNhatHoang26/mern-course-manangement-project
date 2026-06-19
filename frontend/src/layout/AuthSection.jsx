import { Button, Stack, Avatar, IconButton, Menu, MenuItem, Typography, Divider } from "@mui/material";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuthState, useAuthActions } from "@features/auth";
import React from "react";
import { ROUTES } from "../constants/routes";

export default function AuthSection() {
    const { user, loading } = useAuthState();
    const { logout } = useAuthActions();
    const [anchorEl, setAnchorEl] = React.useState(null);
    if (loading) return null;

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    if (!user) {
        return (
            <Stack direction="row" spacing={1}>
                <Button
                    component={Link}
                    to={ROUTES.SIGNIN}
                    variant="text"
                    size="small"
                    sx={{ fontWeight: 500, color: 'text.primary' }}
                >
                    Đăng nhập
                </Button>
                <Button
                    variant="contained"
                    component={Link}
                    to={ROUTES.SIGNUP}
                    size="small"
                    sx={{ fontWeight: 600 }}
                >
                    Đăng ký
                </Button>
            </Stack>
        );
    }

    return (
        <>
            <Button
                onClick={handleOpen}
                size="small"
                endIcon={<KeyboardArrowDownRounded sx={{ fontSize: 16 }} />}
                sx={{
                    gap: 1,
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: 99,
                    px: 1,
                    py: 0.5,
                    '&:hover': { bgcolor: 'grey.100' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                }}
            >
                <Avatar
                    sx={{
                        width: 28,
                        height: 28,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                    }}
                >
                    {user.userName?.[0]?.toUpperCase()}
                </Avatar>
                <Typography
                    sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: { xs: 'none', sm: 'block' },
                        maxWidth: 120,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {user.userName}
                </Typography>
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        elevation: 2,
                        sx: { mt: 0.5, minWidth: 180, borderRadius: 2, border: '1px solid', borderColor: 'divider' },
                    },
                }}
            >
                <MenuItem disabled sx={{ opacity: 1, pb: 1 }}>
                    <Stack spacing={0}>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                            {user.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user.email}
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to={ROUTES.MY_PROFILE} onClick={handleClose} sx={{ fontSize: '0.875rem', py: 1 }}>
                    Hồ sơ cá nhân
                </MenuItem>
                <MenuItem component={Link} to={ROUTES.MY_COURSES} onClick={handleClose} sx={{ fontSize: '0.875rem', py: 1 }}>
                    Khoá học của tôi
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => { logout(); handleClose(); }}
                    sx={{ fontSize: '0.875rem', py: 1, color: 'error.main' }}
                >
                    Đăng xuất
                </MenuItem>
            </Menu>
        </>
    );
}
