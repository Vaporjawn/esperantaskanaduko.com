import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { History as HistoryIcon } from '@mui/icons-material';
import { theme } from './theme';
import TranslateButton from './components/TranslateButton';
import StatusIndicator from './components/StatusIndicator';
import ProgressIndicator from './components/ProgressIndicator';
import SettingsDrawer from './components/SettingsDrawer';
import HistoryViewer from './components/HistoryViewer';
import { TranslationProvider } from './contexts/TranslationContext';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsProvider>
        <TranslationProvider>
          <Container maxWidth="sm">
            <Box
              sx={{
                minWidth: 400,
                minHeight: 500,
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <StatusIndicator onSettingsClick={() => setSettingsOpen(true)} />
              <TranslateButton />
              <ProgressIndicator />

              {/* History Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Tooltip title="View translation history">
                  <IconButton
                    onClick={() => setHistoryOpen(true)}
                    color="primary"
                    size="large"
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
              <HistoryViewer open={historyOpen} onClose={() => setHistoryOpen(false)} />
            </Box>
          </Container>
        </TranslationProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
