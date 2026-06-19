import { createTheme } from '@mui/material/styles';

/**
 * F8 Course Management – MUI Theme
 * All values derived from the F8 design token specification.
 *
 * Token reference (from index.css / DESIGN_Course_Management.md):
 *   surface.base    = #000000  → primary accent (buttons, active borders)
 *   text.tertiary   = #292929  → default body/heading text
 *   text.secondary  = #a9b3bb  → muted / placeholder text
 *   text.inverse    = #ffffff  → text on dark backgrounds
 *   surface.raised  = #e8ebed  → hover background, subtle fill
 *   surface.strong  = #f0f0f0  → section backgrounds, skeleton
 *   radius.xs       = 4px      → default border radius
 */

export const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#000000',       // surface.base
      light: '#292929',      // text.tertiary (slightly lighter black)
      dark: '#000000',
      contrastText: '#ffffff',
    },

    secondary: {
      main: '#292929',       // text.tertiary – used for secondary actions
      contrastText: '#ffffff',
    },

    text: {
      primary: '#292929',    // text.tertiary
      secondary: '#a9b3bb',  // text.secondary
      disabled: '#c4c4c4',
    },

    background: {
      default: '#f8fafc',    // clean off-white page background
      paper: '#ffffff',
    },

    divider: '#e8ebed',      // surface.raised

    grey: {
      50:  '#fafafa',
      100: '#f5f5f5',
      200: '#e8ebed',        // surface.raised
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#a9b3bb',        // text.secondary
      600: '#6b7280',
      700: '#374151',
      800: '#292929',        // text.tertiary
      900: '#111827',
    },

    // Semantic level colors for course difficulty chips
    success: { main: '#16a34a', light: '#dcfce7', contrastText: '#fff' },
    warning: { main: '#d97706', light: '#fef3c7', contrastText: '#fff' },
    error:   { main: '#dc2626', light: '#fee2e2', contrastText: '#fff' },
    info:    { main: '#2563eb', light: '#dbeafe', contrastText: '#fff' },
  },

  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    fontSize: 14,           // font.size.md = 14px
    fontWeightLight:   300,
    fontWeightRegular: 400, // font.weight.base
    fontWeightMedium:  500,
    fontWeightBold:    700,
    lineHeight: 1.5,

    h1: { fontSize: '2rem',   fontWeight: 700, letterSpacing: '-0.02em', color: '#292929' },
    h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#292929' },
    h3: { fontSize: '1.25rem',fontWeight: 700, color: '#292929' },
    h4: { fontSize: '1.1rem', fontWeight: 700, color: '#292929' },   // 24px → 1.5rem but scale down for compact UI
    h5: { fontSize: '1rem',   fontWeight: 600, color: '#292929' },
    h6: { fontSize: '0.9375rem', fontWeight: 600, color: '#292929' },

    body1: { fontSize: '0.875rem', lineHeight: 1.6 },  // 14px
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },  // 13px
    caption:  { fontSize: '0.8125rem', color: '#a9b3bb' },
    overline: { fontSize: '0.75rem',  fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
    button:   { fontSize: '0.875rem', fontWeight: 500, textTransform: 'none' },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 500 },
  },

  shape: {
    borderRadius: 4,         // radius.xs
  },

  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.06), 0px 1px 2px rgba(0,0,0,0.04)',
    '0px 4px 6px rgba(0,0,0,0.06), 0px 2px 4px rgba(0,0,0,0.04)',
    '0px 10px 15px rgba(0,0,0,0.06), 0px 4px 6px rgba(0,0,0,0.04)',
    '0px 20px 25px rgba(0,0,0,0.06), 0px 10px 10px rgba(0,0,0,0.03)',
    '0px 25px 50px rgba(0,0,0,0.08)',
    ...Array(19).fill('none'),
  ],

  transitions: {
    duration: {
      shortest:  150,
      shorter:   200,   // motion.duration.instant
      short:     250,   // motion.duration.fast
      standard:  300,
      complex:   375,
      enteringScreen: 225,
      leavingScreen:  195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut:   'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
      sharp:     'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: { backgroundColor: '#f8fafc', color: '#292929' },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: '0.875rem',
          transition: 'background-color 200ms ease, box-shadow 200ms ease',
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
        contained: {
          '&:hover': { backgroundColor: '#292929' },
        },
        outlined: {
          borderColor: '#e8ebed',
          '&:hover': { borderColor: '#292929', backgroundColor: 'rgba(0,0,0,0.03)' },
        },
        text: {
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            fontSize: '0.875rem',
            backgroundColor: '#ffffff',
            '& fieldset': { borderColor: '#e8ebed' },
            '&:hover fieldset': { borderColor: '#a9b3bb' },
            '&.Mui-focused fieldset': { borderColor: '#000000', borderWidth: 2 },
          },
          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #e8ebed',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.06), 0px 1px 2px rgba(0,0,0,0.04)',
          transition: 'box-shadow 200ms ease, transform 200ms ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.10)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 500 },
        sizeSmall: { fontSize: '0.75rem', height: 22 },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e8ebed',
          color: '#292929',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 8 },
        outlined: { borderColor: '#e8ebed' },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '1px 8px',
          width: 'calc(100% - 16px)',
          fontSize: '0.875rem',
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0,0,0,0.06)',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' },
          },
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
        },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: '#e8ebed' } },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#292929',
          fontSize: '0.75rem',
          borderRadius: 4,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#e8ebed',
          color: '#292929',
          fontSize: '0.875rem',
          fontWeight: 600,
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px !important',
          fontSize: '0.8125rem',
          fontWeight: 500,
          border: '1px solid #e8ebed',
          color: '#292929',
          transition: 'background-color 200ms ease',
          '&:hover': { backgroundColor: '#f0f0f0' },
          '&.Mui-selected': {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#292929' },
          },
          '&:focus-visible': { outline: '2px solid #000000', outlineOffset: 2 },
        },
      },
    },
  },
});
