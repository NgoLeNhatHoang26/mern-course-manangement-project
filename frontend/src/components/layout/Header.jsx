import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* LOGO / BRAND */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", mr: 4 }}
        >
          <IconButton edge="start" color="primary" disableRipple sx={{ p: 0 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            F8 Learning
          </Typography>
        </Stack>

        {/* PRIMARY NAV LINKS */}
        <Stack
          direction="row"
          spacing={3}
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
          }}
        >
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/courses" color="inherit">
            Courses
          </Button>
          <Button component={Link} to="/my-courses" color="inherit">
            My Courses
          </Button>
        </Stack>

        {/* AUTH ACTIONS (PLACEHOLDER) */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2 }}>
          <Button variant="text" color="primary">
            Login
          </Button>
          <Button variant="contained" color="primary">
            Sign Up
          </Button>
        </Stack>

        {/* AVATAR DROPDOWN (PLACEHOLDER USER) */}
        <IconButton onClick={handleOpenMenu} size="small">
          <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem disabled>Signed in as John Doe</MenuItem>
          <MenuItem component={Link} to="/my-profile" onClick={handleCloseMenu}>
            My Profile
          </MenuItem>
          <MenuItem component={Link} to="/my-courses" onClick={handleCloseMenu}>
            My Courses
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
