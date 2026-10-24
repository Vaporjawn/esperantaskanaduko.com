import { memo, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { GamePhase } from '../types';

interface LetterSlotProps {
  letter: string;
  isError: boolean;
}

const LetterSlot = memo(({ letter, isError }: LetterSlotProps) => {
  const { t } = useTranslation();
  const hidden = letter === '_';
  const ariaLabel = hidden
    ? t('games.hangman.unknownLetter', 'unknown letter')
    : t('games.hangman.letterLabel', { letter, defaultValue: 'letter {{letter}}' });

  return (
    <Box
      sx={{
        width: 40,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '3px solid',
        borderColor: 'primary.main',
      }}
      role='img'
      aria-label={ariaLabel}
    >
      <Typography
        variant='h4'
        component='span'
        aria-hidden='true'
        sx={{ fontWeight: 'bold', color: isError ? 'error.main' : 'text.primary' }}
      >
        {hidden ? '' : letter}
      </Typography>
    </Box>
  );
});

LetterSlot.displayName = 'LetterSlot';

interface WordSlotsProps {
  secret: string;
  guessed: ReadonlySet<string>;
  phase: GamePhase;
}

/**
 * One underlined slot per letter of the secret word; unguessed letters stay
 * blank until the game is lost, when they are revealed in red.
 */
const WordSlots = ({ secret, guessed, phase }: WordSlotsProps) => {
  const { t } = useTranslation();

  const slots = useMemo(
    () =>
      [...secret].map((letter, index) => {
        const isGuessed = guessed.has(letter);
        return {
          id: `${index}-${letter}`,
          letter: isGuessed || phase === 'lost' ? letter : '_',
          isError: phase === 'lost' && !isGuessed,
        };
      }),
    [secret, guessed, phase]
  );

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 3, flexWrap: 'wrap' }}
      role='group'
      aria-label={t('games.hangman.wordLabel', 'Word to guess')}
    >
      {slots.map(slot => (
        <LetterSlot key={slot.id} letter={slot.letter} isError={slot.isError} />
      ))}
    </Box>
  );
};

export default memo(WordSlots);
