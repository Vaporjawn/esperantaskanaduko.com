import { Alert, Box } from '@mui/material';
import { useGame } from '../store/game';

const StatusBar = () => {
  const phase = useGame(state => state.phase);
  const secret = useGame(state => state.secret);

  if (phase === 'playing') {
    return (
      <Box sx={{ my: 2 }} role="status" aria-live="polite">
        <Alert severity="info" sx={{ justifyContent: 'center' }}>
          Divenado…
        </Alert>
      </Box>
    );
  }

  if (phase === 'won') {
    return (
      <Box sx={{ my: 2 }} role="status" aria-live="polite">
        <Alert severity="success" sx={{ justifyContent: 'center', fontSize: '1.2rem' }}>
          🎉 Vi venkis!
        </Alert>
      </Box>
    );
  }

  if (phase === 'lost') {
    return (
      <Box sx={{ my: 2 }} role="status" aria-live="polite">
        <Alert severity="error" sx={{ justifyContent: 'center', fontSize: '1.1rem' }}>
          Vi malvenkis. Vorto estis: <strong>{secret}</strong>
        </Alert>
      </Box>
    );
  }

  return null;
};

export default StatusBar;
