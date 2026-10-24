import { memo } from 'react';
import { Button, Stack, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { KEYBOARD_ROWS } from '../constants';
import type { GamePhase } from '../types';

interface KeyButtonProps {
  letter: string;
  onClick: (letter: string) => void;
  isGuessed: boolean;
  isWrong: boolean;
  disabled: boolean;
}

const KeyButton = memo(({ letter, onClick, isGuessed, isWrong, disabled }: KeyButtonProps) => {
  const { t } = useTranslation();
  const variant = isGuessed || isWrong ? 'outlined' : 'contained';
  const color = isWrong ? 'error' : isGuessed ? 'success' : 'primary';

  return (
    <Button
      onClick={() => onClick(letter)}
      size='small'
      variant={variant}
      color={color}
      disabled={disabled || isGuessed || isWrong}
      aria-label={t('games.hangman.letterLabel', { letter, defaultValue: 'letter {{letter}}' })}
      sx={{
        minWidth: 40,
        height: 40,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
    >
      {letter}
    </Button>
  );
});

KeyButton.displayName = 'KeyButton';

interface KeyboardEOProps {
  guessed: ReadonlySet<string>;
  wrong: ReadonlySet<string>;
  phase: GamePhase;
  onGuess: (letter: string) => void;
}

/**
 * On-screen keyboard with the 28 letters of the Esperanto alphabet.
 */
const KeyboardEO = ({ guessed, wrong, phase, onGuess }: KeyboardEOProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={1} sx={{ my: 3 }} role='group' aria-label={t('games.hangman.keyboardLabel', 'Esperanto keyboard')}>
      {KEYBOARD_ROWS.map(row => (
        <Box key={row.join('')} sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          {row.map(letter => (
            <KeyButton
              key={letter}
              letter={letter}
              onClick={onGuess}
              isGuessed={guessed.has(letter)}
              isWrong={wrong.has(letter)}
              disabled={phase !== 'playing'}
            />
          ))}
        </Box>
      ))}
    </Stack>
  );
};

export default memo(KeyboardEO);
