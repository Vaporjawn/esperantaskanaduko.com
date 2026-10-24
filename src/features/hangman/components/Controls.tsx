import { Button, Chip, Stack, Box, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { GameStats } from '../types';

interface ControlsProps {
  mistakeCount: number;
  maxMistakes: number;
  stats: GameStats;
  onNewGame: () => void;
}

/**
 * New-game button, mistake counter and lifetime statistics.
 */
const Controls = ({ mistakeCount, maxMistakes, stats, onNewGame }: ControlsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ my: 3 }}>
      <Stack direction='row' spacing={2} justifyContent='center' alignItems='center' flexWrap='wrap'>
        <Button
          variant='contained'
          color='primary'
          size='large'
          startIcon={<RefreshIcon />}
          onClick={onNewGame}
          sx={{ fontWeight: 'bold' }}
        >
          {t('games.hangman.newGame', 'New game')}
        </Button>

        <Chip
          label={t('games.hangman.mistakes', {
            count: mistakeCount,
            max: maxMistakes,
            defaultValue: 'Mistakes: {{count}}/{{max}}',
          })}
          color={mistakeCount >= maxMistakes ? 'error' : 'default'}
          sx={{ fontSize: '1rem', px: 1 }}
        />
      </Stack>

      {stats.games > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            {t('games.hangman.stats', {
              games: stats.games,
              wins: stats.wins,
              streak: stats.streak,
              defaultValue: 'Games: {{games}} | Wins: {{wins}} | Streak: {{streak}}',
            })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Controls;
