import { Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { GamePhase } from '../types';

interface StatusBarProps {
  phase: GamePhase;
  secret: string;
}

/**
 * Live-region banner announcing whether the game is running, won or lost.
 */
const StatusBar = ({ phase, secret }: StatusBarProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ my: 2 }} role='status' aria-live='polite'>
      {phase === 'playing' && (
        <Alert severity='info' sx={{ justifyContent: 'center' }}>
          {t('games.hangman.playing', 'Guess the word…')}
        </Alert>
      )}
      {phase === 'won' && (
        <Alert severity='success' sx={{ justifyContent: 'center', fontSize: '1.2rem' }}>
          {t('games.hangman.won', '🎉 You won!')}
        </Alert>
      )}
      {phase === 'lost' && (
        <Alert severity='error' sx={{ justifyContent: 'center', fontSize: '1.1rem' }}>
          {t('games.hangman.lostPrefix', 'You lost. The word was:')} <strong>{secret}</strong>
        </Alert>
      )}
    </Box>
  );
};

export default StatusBar;
