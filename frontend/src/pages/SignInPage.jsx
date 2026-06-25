import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../layout/ForgotPassword.jsx';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../theme/CustomIcon.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@features/auth';
import { ROUTES } from '../constants/routes';
import { authSchemas } from '@features/auth/schemas/authSchemas';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    borderRadius: 'var(--radius-xs)',
    boxShadow:
        'rgba(var(--color-surface-base-rgb), 0.05) 0px 5px 15px 0px, rgba(var(--color-surface-base-rgb), 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100vh',
    padding: theme.spacing(2),
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, var(--color-surface-strong), var(--color-text-inverse))',
        backgroundRepeat: 'no-repeat',
    },
}));

const focusVisibleOutline = {
    outline: '2px solid var(--color-surface-base)',
    outlineOffset: 'var(--space-2)',
};

const primaryButtonSx = {
    fontSize: 'var(--font-size-md)',
    transition: `background-color var(--motion-duration-instant)`,
    '&:focus-visible': focusVisibleOutline,
    '&.Mui-disabled': {
        opacity: 0.38,
        pointerEvents: 'all',
        cursor: 'not-allowed',
    },
};

const outlinedButtonSx = {
    fontSize: 'var(--font-size-md)',
    borderRadius: 'var(--radius-xs)',
    transition: `background-color var(--motion-duration-instant)`,
    '&:hover': {
        backgroundColor: 'var(--color-surface-raised)',
    },
    '&:focus-visible': focusVisibleOutline,
};
const fieldSx = {
    '& .MuiInputBase-root': {
        fontSize: 'var(--font-size-md)',
        borderRadius: 'var(--radius-xs)',
    },
    '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-text-tertiary)',  
        borderWidth: '2px',
    },
    '& .MuiFormHelperText-root': {
        fontSize: 'var(--font-size-sm)',            
    },
};

const labelSx = {
    fontSize: 'var(--font-size-sm)',                 
    color: 'var(--color-text-tertiary)',             
};

export default function SignIn() {
    const [formValues, setFormValues] = React.useState({ email: '', password: '' });
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();
    const { login } = useAuthActions();

    const validateInputs = () => {
        const errors = authSchemas.login(formValues);
        if (errors.email) {
            setEmailError(true);
            setEmailErrorMessage(errors.email);
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (errors.password) {
            setPasswordError(true);
            setPasswordErrorMessage(errors.password);
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateInputs()) {
            return;
        }

        try {
            const result = await login({
                email: formValues.email,
                password: formValues.password,
            });

            if (result.success) {
                navigate(ROUTES.HOME, { replace: true });
                return;
            }

            setAlertMessage(result.message || 'Email hoặc mật khẩu không đúng');
            setAlertOpen(true);
            setPasswordError(true);
            setPasswordErrorMessage(result.message || 'Wrong password.');
        } catch (error) {
            console.error(error);
            setAlertMessage('Đã có lỗi xảy ra, vui lòng thử lại.');
            setAlertOpen(true);
            setPasswordError(true);
            setPasswordErrorMessage('Wrong password.');
        }
    };

    return (
        <>
            <CssBaseline />

            <SignInContainer direction="column" justifyContent="center">
                <Card variant="outlined">
                    <SitemarkIcon />

                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'var(--font-size-4xl)' }}
                    >
                        Sign in
                    </Typography>

                    {alertOpen && (
                        <Alert severity="error" onClose={() => setAlertOpen(false)}>
                            {alertMessage}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email" sx={labelSx}>
                                Email
                            </FormLabel>
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                value={formValues.email}
                                onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                                required
                                fullWidth
                                error={emailError}
                                helperText={emailErrorMessage}
                                sx={fieldSx}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="password" sx={labelSx}>
                                Password
                            </FormLabel>
                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••"
                                autoComplete="current-password"
                                value={formValues.password}
                                onChange={(e) => setFormValues((prev) => ({ ...prev, password: e.target.value }))}
                                required
                                fullWidth
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                sx={fieldSx}
                            />
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="remember"
                                    sx={{
                                        '&:focus-visible': {
                                            ...focusVisibleOutline,
                                            borderRadius: 'var(--radius-xs)',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: 'var(--font-size-sm)' }}>
                                    Remember me
                                </Typography>
                            }
                        />

                        <ForgotPassword open={open} handleClose={handleClose} />

                        <Button type="submit" fullWidth variant="contained" sx={primaryButtonSx}>
                            Sign in
                        </Button>

                        <Link
                            component="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{
                                alignSelf: 'center',
                                fontSize: 'var(--font-size-sm)',
                                '&:focus-visible': {
                                    ...focusVisibleOutline,
                                    borderRadius: 'var(--radius-xs)',
                                },
                            }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>

                    <Divider>
                        <Typography
                            sx={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)',
                            }}
                        >
                            or
                        </Typography>
                    </Divider>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            sx={outlinedButtonSx}
                        >
                            Sign in with Google
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FacebookIcon />}
                            sx={outlinedButtonSx}
                        >
                            Sign in with Facebook
                        </Button>

                        <Typography sx={{ textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>
                            Don&apos;t have an account?{' '}
                            <Link
                                href={ROUTES.SIGNUP}
                                variant="body2"
                                sx={{
                                    fontSize: 'var(--font-size-sm)',
                                    '&:focus-visible': {
                                        ...focusVisibleOutline,
                                        borderRadius: 'var(--radius-xs)',
                                    },
                                }}
                            >
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
}
