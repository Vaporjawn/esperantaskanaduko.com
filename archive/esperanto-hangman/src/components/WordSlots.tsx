import { memo, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useGame } from '../store/game';

/**
 * Individual letter slot component
 */
interface LetterSlotProps {
  letter: string;
  isError: boolean;
}

const LetterSlot = memo(({ letter, isError }: LetterSlotProps) => {
  const displayChar = letter === '_' ? '' : letter;
  const ariaLabel = letter === '_' ? 'nekonata litero' : `litero ${letter}`;

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
      aria-label={ariaLabel}
    >
      <Typography
        variant="h4"
        component="span"
        sx={{
          fontWeight: 'bold',
          color: isError ? 'error.main' : 'text.primary',
        }}
      >
        {displayChar}
      </Typography>
    </Box>
  );
});

LetterSlot.displayName = 'LetterSlot';

const WordSlots = () => {
  const secret = useGame(state => state.secret);
  const guessed = useGame(state => state.guessed);
  const phase = useGame(state => state.phase);

  // Compute masked word with useMemo to prevent unnecessary recalculations
  const slots = useMemo(() => {
    return [...secret].map((letter, index) => {
      const isGuessed = guessed.has(letter);
      const displayLetter = isGuessed || phase === 'lost' ? letter : '_';
      const isError = phase === 'lost' && !isGuessed;

      return {
        id: `${index}-${letter}`,
        letter: displayLetter,
        isError,
      };
    });
  }, [secret, guessed, phase]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        my: 3,
        flexWrap: 'wrap',
      }}
      role="region"
      aria-label="Vorto divenenda"
    >
      {slots.map(slot => (
        <LetterSlot key={slot.id} letter={slot.letter} isError={slot.isError} />
      ))}
    </Box>
  );
};

export default memo(WordSlots);
