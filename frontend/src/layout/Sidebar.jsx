import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
} from "@mui/material";
import {
    HomeRounded,
    SchoolRounded,
    PeopleRounded,
    DashboardRounded,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthState } from "@features/auth";
import { ROUTES } from "../constants/routes";

const NAV_ITEMS = [
    { label: 'Trang chủ',    to: ROUTES.HOME,       icon: <HomeRounded fontSize="small" /> },
    { label: 'Khoá học',     to: ROUTES.MY_COURSES,  icon: <SchoolRounded fontSize="small" /> },
];

const ADMIN_ITEMS = [
    { label: 'Người dùng',  to: ROUTES.USERS,     icon: <PeopleRounded fontSize="small" /> },
    { label: 'Dashboard',   to: ROUTES.DASHBOARD, icon: <DashboardRounded fontSize="small" /> },
];

function NavSection({ title, items, location }) {
    return (
        <Box>
            {title && (
                <Typography
                    variant="overline"
                    sx={{
                        px: 2,
                        py: 1,
                        display: 'block',
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                    }}
                >
                    {title}
                </Typography>
            )}
            <List dense disablePadding>
                {items.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <ListItem key={item.to} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.to}
                                selected={isActive}
                                sx={{
                                    borderLeft: isActive
                                        ? '2px solid'
                                        : '2px solid transparent',
                                    borderLeftColor: isActive ? 'primary.main' : 'transparent',
                                    borderRadius: '0 6px 6px 0',
                                    mx: 0,
                                    width: '100%',
                                    pl: 2,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 34,
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? 'text.primary' : 'text.secondary',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuthState();

    return (
        <Box
            component="nav"
            sx={{
                width: 240,
                flexShrink: 0,
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                py: 1.5,
            }}
        >
            <NavSection items={NAV_ITEMS} location={location} />

            {user?.role === 'admin' && (
                <>
                    <Divider sx={{ my: 1.5 }} />
                    <NavSection title="Quản trị" items={ADMIN_ITEMS} location={location} />
                </>
            )}
        </Box>
    );
};

export default Sidebar;
