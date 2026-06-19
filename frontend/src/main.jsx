import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { AuthProvider } from '@features/auth/context/AuthContext'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { theme } from './theme/theme.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
