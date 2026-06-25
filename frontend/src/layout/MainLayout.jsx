import { Box } from "@mui/material";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Header />

            <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                <Sidebar />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        width: 0,         
                        minWidth: 0,
                        overflowY: 'auto',
                        bgcolor: 'background.default',
                        px: { xs: 2, sm: 3, md: 4 },
                        py: 3,
                    }}
                >
                    <Outlet />
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}
