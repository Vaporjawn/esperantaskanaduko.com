import { Button, Chip, Stack, Box, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useGame } from '../store/game';

const Controls = () => {
  const newGame = useGame(state => state.newGame);
  const mistakeCount = useGame(state => state.wrong.size);
  const maxMistakes = useGame(state => state.maxMistakes);
  const stats = useGame(state => state.stats);

  return (
    <Box sx={{ my: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<RefreshIcon />}
          onClick={newGame}
          sx={{ fontWeight: 'bold' }}
        >
          Nova ludo
        </Button>

        <Chip
          label={`Eraroj: ${mistakeCount}/${maxMistakes}`}
          color={mistakeCount >= maxMistakes ? 'error' : 'default'}
          sx={{ fontSize: '1rem', px: 1 }}
        />
      </Stack>

      {/* Stats display */}
      {stats.games > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Ludoj: {stats.games} | Venkoj: {stats.wins} | Serio: {stats.streak}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Controls;
