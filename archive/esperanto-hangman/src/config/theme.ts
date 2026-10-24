import { createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';

/**
 * Material-UI theme configuration with Esperanto color scheme
 * Supports both light and dark modes with optimized color palettes
 */
export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2e7d32' : '#66bb6a', // Deep green for light, lighter green for dark
        light: '#60ad5e',
        dark: '#005005',
      },
      secondary: {
        main: mode === 'light' ? '#1976d2' : '#42a5f5',
        light: '#4791db',
        dark: '#115293',
      },
      error: {
        main: mode === 'light' ? '#c62828' : '#ef5350',
        light: '#ff5f52',
        dark: '#8e0000',
      },
      success: {
        main: mode === 'light' ? '#388e3c' : '#66bb6a',
        light: '#6abf69',
        dark: '#00600f',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Noto Sans", "Segoe UI", sans-serif',
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove default MUI dark mode gradient
          },
        },
      },
    },
  });
