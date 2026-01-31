import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #ddd",
        minHeight: "100%",
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/courses">
            <ListItemText primary="Courses" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/users">
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
