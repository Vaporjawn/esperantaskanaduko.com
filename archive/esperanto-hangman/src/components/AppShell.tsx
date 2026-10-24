import { Container, Paper, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { useThemeMode } from '../hooks';

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 4,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            position: 'relative',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Tooltip title={mode === 'light' ? 'Ŝalti malluman reĝimon' : 'Ŝalti helan reĝimon'}>
              <IconButton
                onClick={toggleTheme}
                color="primary"
                aria-label={mode === 'light' ? 'switch to dark mode' : 'switch to light mode'}
                sx={{
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                  },
                }}
              >
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 3,
            }}
          >
            Pendumulo — Esperanto
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AppShell;
