/**
 * Popup Component for Esperanto Page Translator
 * Material-UI interface for translating and reverting pages
 */

import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import UndoIcon from '@mui/icons-material/Undo';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // Green for Esperanto
    },
    secondary: {
      main: '#1976d2',
    },
  },
});

interface PopupState {
  loading: boolean;
  message: string;
  error: string | null;
  isTranslated: boolean;
}

function Popup() {
  const [state, setState] = useState<PopupState>({
    loading: false,
    message: '',
    error: null,
    isTranslated: false,
  });

  const handleTranslate = async () => {
    setState({ loading: true, message: '', error: null, isTranslated: false });

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error('No active tab found');
      }

      chrome.tabs.sendMessage(
        tab.id,
        { action: 'translate' },
        (response: { success: boolean; message?: string; error?: string }) => {
          if (chrome.runtime.lastError) {
            setState({
              loading: false,
              message: '',
              error: chrome.runtime.lastError.message || 'Unknown error',
              isTranslated: false,
            });
          } else if (response?.success) {
            setState({
              loading: false,
              message: 'Page translated to Esperanto!',
              error: null,
              isTranslated: true,
            });
          } else {
            setState({
              loading: false,
              message: '',
              error: response?.error || 'Translation failed',
              isTranslated: false,
            });
          }
        }
      );
    } catch (error) {
      setState({
        loading: false,
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        isTranslated: false,
      });
    }
  };

  const handleRevert = async () => {
    setState({ loading: true, message: '', error: null, isTranslated: true });

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error('No active tab found');
      }

      chrome.tabs.sendMessage(
        tab.id,
        { action: 'revert' },
        (response: { success: boolean; message?: string; error?: string }) => {
          if (chrome.runtime.lastError) {
            setState({
              loading: false,
              message: '',
              error: chrome.runtime.lastError.message || 'Unknown error',
              isTranslated: true,
            });
          } else if (response?.success) {
            setState({
              loading: false,
              message: 'Page reverted to original text!',
              error: null,
              isTranslated: false,
            });
          } else {
            setState({
              loading: false,
              message: '',
              error: response?.error || 'Revert failed',
              isTranslated: true,
            });
          }
        }
      );
    } catch (error) {
      setState({
        loading: false,
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        isTranslated: true,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper elevation={0} sx={{ width: 300, p: 2 }}>
        <Box>
          <Typography variant="h6" component="h1" gutterBottom align="center">
            Esperanto Page Translator
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                state.loading ? <CircularProgress size={20} /> : <TranslateIcon />
              }
              onClick={handleTranslate}
              disabled={state.loading || state.isTranslated}
            >
              Translate to Esperanto
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={state.loading ? <CircularProgress size={20} /> : <UndoIcon />}
              onClick={handleRevert}
              disabled={state.loading || !state.isTranslated}
            >
              Revert to Original
            </Button>

            {state.message && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {state.message}
              </Alert>
            )}

            {state.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {state.error}
              </Alert>
            )}
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
            sx={{ mt: 2 }}
          >
            Powered by LibreTranslate
          </Typography>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
