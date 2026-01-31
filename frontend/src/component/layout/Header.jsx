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

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* MENU ICON */}
        <IconButton
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* LOGO / TITLE */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          Course Management
        </Typography>

        {/* USER MENU */}
        <IconButton onClick={handleOpenMenu}>
          <Avatar sx={{ width: 32, height: 32 }}>H</Avatar>
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
          <MenuItem component={Link} to="/my-profile" onClick={handleCloseMenu}>My Profile</MenuItem>
          <MenuItem component={Link} to="/my-courses" onClick={handleCloseMenu}>My Courses</MenuItem>
          <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
