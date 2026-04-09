import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AuthSection from "./AuthSection.jsx";
export default function Header() {

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
            IONP
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

        <AuthSection />
      </Toolbar>
    </AppBar>
  );
}
