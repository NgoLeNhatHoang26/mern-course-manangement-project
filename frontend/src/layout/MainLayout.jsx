import { Box } from "@mui/material";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {

    return(
        <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}
        >
            {/* HEADER */}
            <Header />
            <Box sx={{ height: 20 }} />

            <Box
                sx={{
                flex: 1,
                display: "flex",
                }}
            >
                {/* MENU */}
                <Sidebar />

                {/* MAIN CONTENT */}
                <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'auto',
                    backgroundColor: "#f5f5f5",
                }}
                >
                <Outlet />
                </Box>
            </Box>

            {/* FOOTER */}
            <Footer />
        </Box>
    );
} 