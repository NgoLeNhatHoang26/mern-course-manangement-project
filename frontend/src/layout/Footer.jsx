import { Box, Typography, Stack } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                px: { xs: 2, md: 4 },
                py: 2,
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            bgcolor: 'primary.main',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.6rem' }}>
                            F8
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                        © 2026 F8 Course Management
                    </Typography>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                    Built for developers &amp; technical teams
                </Typography>
            </Stack>
        </Box>
    );
};

export default Footer;
