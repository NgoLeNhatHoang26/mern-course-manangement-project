import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../theme/CustomIcon.jsx';
import { useNavigate } from 'react-router-dom';
import { authService } from '@features/auth';
import { useAuthActions } from '@features/auth';
import { authSchemas } from '@features/auth/schemas/authSchemas';
import { ROUTES } from '../constants/routes';

/* ── Styled Components ──────────────────────────────────────────────────────
 * Elevation shadow: color.surface.base (#000000) at 5% opacity
 *   replaces raw hsla(220, 30%, 5%, 0.05) / hsla(220, 25%, 10%, 0.05)
 * Border radius: radius.xs = 4px
 * ──────────────────────────────────────────────────────────────────────── */
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
        width: '450px',
    },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

/* ── Reusable sx snippets (WCAG 2.2 AA states) ──────────────────────────── */

// focus-visible: 2px solid outline with space.2 (2px) offset — keyboard-first
const focusVisibleOutline = {
    outline: '2px solid var(--color-surface-base)',
    outlineOffset: 'var(--space-2)',
};

// Primary (contained) button states
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

// Outlined button states (social sign-in)
const outlinedButtonSx = {
    fontSize: 'var(--font-size-md)',
    borderRadius: 'var(--radius-xs)',
    transition: `background-color var(--motion-duration-instant)`,
    '&:hover': {
        backgroundColor: 'var(--color-surface-raised)',  // color.surface.raised = #e8ebed
    },
    '&:focus-visible': focusVisibleOutline,
};

// TextField input states
const fieldSx = {
    '& .MuiInputBase-root': {
        fontSize: 'var(--font-size-md)',
        borderRadius: 'var(--radius-xs)',
    },
    '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-text-tertiary)',   // color.text.tertiary = #292929
        borderWidth: '2px',
    },
    '& .MuiFormHelperText-root': {
        fontSize: 'var(--font-size-sm)',             // font.size.sm = 13px
    },
};

// Shared FormLabel sx
const labelSx = {
    fontSize: 'var(--font-size-sm)',                 // font.size.sm = 13px
    color: 'var(--color-text-tertiary)',             // color.text.tertiary = #292929
};

export default function SignUp() {
    const [formValues, setFormValues] = React.useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const navigate = useNavigate();
    const { login } = useAuthActions();

    const validateInputs = () => {
        const errors = authSchemas.register(formValues);
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

        if (errors.confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage(errors.confirmPassword);
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }
        if (errors.userName) {
            setNameError(true);
            setNameErrorMessage(errors.userName);
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateInputs()) return;

        const payload = { ...formValues };
        try {
            await authService.register(payload);
            // Tự động đăng nhập sau khi đăng ký thành công
            const loginResult = await login({
                email: payload.email,
                password: payload.password,
            });

            if (loginResult.success) {
                navigate(ROUTES.HOME, { replace: true });
                return;
            }

            // Nếu không login được, điều hướng về page đăng nhập
            navigate(ROUTES.SIGNIN, { replace: true });
        } catch (error) {
            console.error(error);
            const errorMessage = error?.response?.data?.message || 'Không thể kết nối tới server. Vui lòng thử lại.';
            setAlertMessage(errorMessage);
            setAlertOpen(true);
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage(errorMessage);
        }
    };

    return (
        <>
            <CssBaseline />

            <SignUpContainer direction="column" justifyContent="center">
                <Card variant="outlined">
                    <SitemarkIcon />

                    {/* font.size.4xl = 24px replaces clamp(2rem, 10vw, 2.15rem) */}
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'var(--font-size-4xl)' }}
                    >
                        Sign up
                    </Typography>

                    {alertOpen && (
                        <Alert severity="error" onClose={() => setAlertOpen(false)}>
                            {alertMessage}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="userName" sx={labelSx}>
                                Full name
                            </FormLabel>
                            <TextField
                                name="userName"
                                required
                                fullWidth
                                id="userName"
                                placeholder="Jon Snow"
                                value={formValues.userName}
                                onChange={(e) => setFormValues((prev) => ({ ...prev, userName: e.target.value }))}
                                error={nameError}
                                helperText={nameErrorMessage}
                                sx={fieldSx}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="email" sx={labelSx}>
                                Email
                            </FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                placeholder="your@email.com"
                                value={formValues.email}
                                onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
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
                                required
                                fullWidth
                                name="password"
                                type="password"
                                id="password"
                                placeholder="••••••"
                                value={formValues.password}
                                onChange={(e) => setFormValues((prev) => ({ ...prev, password: e.target.value }))}
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                sx={fieldSx}
                            />
                        </FormControl>

                        <FormControl>
                            {/* Fixed: htmlFor now matches id="confirmPassword" */}
                            <FormLabel htmlFor="confirmPassword" sx={labelSx}>
                                Confirm Password
                            </FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••"
                                value={formValues.confirmPassword}
                                onChange={(e) => setFormValues((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                error={confirmPasswordError}
                                helperText={confirmPasswordErrorMessage}
                                sx={fieldSx}
                            />
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="allowExtraEmails"
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
                                    I want to receive updates via email.
                                </Typography>
                            }
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={primaryButtonSx}
                        >
                            Sign up
                        </Button>
                    </Box>

                    <Divider>
                        {/* color.text.secondary = #a9b3bb */}
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
                            Sign up with Google
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FacebookIcon />}
                            sx={outlinedButtonSx}
                        >
                            Sign up with Facebook
                        </Button>

                        <Typography sx={{ textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>
                            Already have an account?{' '}
                            <Link
                                href={ROUTES.SIGNIN}
                                variant="body2"
                                sx={{
                                    fontSize: 'var(--font-size-sm)',
                                    '&:focus-visible': {
                                        ...focusVisibleOutline,
                                        borderRadius: 'var(--radius-xs)',
                                    },
                                }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </>
    );
}
