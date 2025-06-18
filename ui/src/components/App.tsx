import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { AppProvider } from '../contexts/AppContext';
import { ErrorBoundary } from './common/ErrorBoundary';
import Dashboard from './dashboard/Dashboard';
import { useWebSocket } from '../hooks/useWebSocket';

function App() {
  // Detect system preference for dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [prefersDarkMode],
  );

  function AppContent() {
    useWebSocket(); // Hook handles auto-connect internally

    return (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;