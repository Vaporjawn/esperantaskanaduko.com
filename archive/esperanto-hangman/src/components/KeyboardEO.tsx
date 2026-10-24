import { memo } from 'react';
import { Button, Stack, Box } from '@mui/material';
import { useGame } from '../store/game';
import { KEYBOARD_ROWS } from '../constants/game';

interface KeyButtonProps {
  letter: string;
  onClick: (letter: string) => void;
  isGuessed: boolean;
  isWrong: boolean;
  disabled: boolean;
}

const KeyButton = memo(({ letter, onClick, isGuessed, isWrong, disabled }: KeyButtonProps) => {
  const variant = isGuessed || isWrong ? 'outlined' : 'contained';
  const color = isWrong ? 'error' : isGuessed ? 'success' : 'primary';

  return (
    <Button
      onClick={() => onClick(letter)}
      size="small"
      variant={variant}
      color={color}
      disabled={disabled || isGuessed || isWrong}
      aria-label={`litero ${letter}`}
      aria-pressed={isGuessed || isWrong}
      sx={{
        minWidth: 40,
        height: 40,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&:focus': {
          outline: '3px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      {letter}
    </Button>
  );
});

KeyButton.displayName = 'KeyButton';

const KeyboardEO = () => {
  const guess = useGame(state => state.guess);
  const guessed = useGame(state => state.guessed);
  const wrong = useGame(state => state.wrong);
  const phase = useGame(state => state.phase);

  const disabled = phase !== 'playing';

  return (
    <Stack spacing={1} sx={{ my: 3 }} role="group" aria-label="Klavaro Esperanta">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            gap: 0.5,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {row.map(letter => (
            <KeyButton
              key={letter}
              letter={letter}
              onClick={guess}
              isGuessed={guessed.has(letter)}
              isWrong={wrong.has(letter)}
              disabled={disabled}
            />
          ))}
        </Box>
      ))}
    </Stack>
  );
};

export default KeyboardEO;
