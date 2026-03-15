import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "Users", to: "/users" },
  ];

  return (
    <Box
      sx={{
        width: 260,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e0e0e0",
        minHeight: "100%",
        position: "sticky",
        top: 64,
        alignSelf: "flex-start",
      }}
    >
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                selected={isActive}
                sx={{
                  borderLeft: isActive ? "3px solid #1976d2" : "3px solid transparent",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.12)",
                    },
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
