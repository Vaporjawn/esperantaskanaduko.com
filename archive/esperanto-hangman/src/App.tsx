import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import { getTheme } from './config/theme';
import GamePage from './pages/GamePage';
import { useGame } from './store/game';
import { useKeyboardInput, useThemeMode } from './hooks';
import { ThemeModeProvider } from './components';

function AppContent() {
  const guess = useGame(state => state.guess);
  const phase = useGame(state => state.phase);
  const { mode } = useThemeMode();

  // Enable keyboard input only when game is in 'playing' phase
  useKeyboardInput(guess, phase === 'playing');

  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GamePage />
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  );
}

export default App;
