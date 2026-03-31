import { Button, Stack, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React from "react";

export default function AuthSection() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);

    if (loading) return null;

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // 👉 chưa login
    if (!isAuthenticated) {
        return (
            <Stack direction="row" spacing={1}>
                <Button component={Link} to="/signin">Login</Button>
                <Button variant="contained" component={Link} to="/register">
                    Sign Up
                </Button>
            </Stack>
        );
    }

    // 👉 đã login
    return (
        <>
            <IconButton onClick={handleOpen} size="small">
                <Avatar>{user.name?.[0]}</Avatar>
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem disabled>{user.name}</MenuItem>

                <MenuItem component={Link} to="/my-profile" onClick={handleClose}>
                    My Profile
                </MenuItem>

                <MenuItem component={Link} to="/my-courses" onClick={handleClose}>
                    My Courses
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        logout();
                        handleClose();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}