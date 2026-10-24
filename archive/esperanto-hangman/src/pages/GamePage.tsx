import { Stack } from '@mui/material';
import { AppShell, HangmanFigure, WordSlots, KeyboardEO, StatusBar, Controls } from '../components';
import { useGame } from '../store/game';

const GamePage = () => {
  const mistakeCount = useGame(state => state.wrong.size);

  return (
    <AppShell>
      <Stack spacing={2}>
        <StatusBar />
        <HangmanFigure mistakeCount={mistakeCount} />
        <WordSlots />
        <Controls />
        <KeyboardEO />
      </Stack>
    </AppShell>
  );
};

export default GamePage;
