import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 2,
        backgroundColor: "#1976d2",
        color: "white",
      }}
    >
      <Typography variant="body2">
        © 2026 Course Management System
      </Typography>
    </Box>
  );
};

export default Footer;
