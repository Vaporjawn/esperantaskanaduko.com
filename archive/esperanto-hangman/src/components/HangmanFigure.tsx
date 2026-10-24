import { memo } from 'react';
import { Box } from '@mui/material';
import { HANGMAN_SVG } from '../constants/game';

interface HangmanFigureProps {
  mistakeCount: number;
}

const HangmanFigure = ({ mistakeCount }: HangmanFigureProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: HANGMAN_SVG.MIN_HEIGHT,
        userSelect: 'none',
      }}
      role="img"
      aria-label={`Pendumulo kun ${mistakeCount} eraroj`}
    >
      <svg
        width={HANGMAN_SVG.WIDTH}
        height={HANGMAN_SVG.HEIGHT}
        viewBox={`0 0 ${HANGMAN_SVG.WIDTH} ${HANGMAN_SVG.HEIGHT}`}
        aria-hidden="true"
      >
        {/* Gallows base */}
        <line x1="10" y1="230" x2="150" y2="230" stroke="#333" strokeWidth="4" />
        {/* Gallows vertical pole */}
        <line x1="50" y1="230" x2="50" y2="20" stroke="#333" strokeWidth="4" />
        {/* Gallows horizontal beam */}
        <line x1="50" y1="20" x2="130" y2="20" stroke="#333" strokeWidth="4" />
        {/* Gallows rope */}
        <line x1="130" y1="20" x2="130" y2="50" stroke="#333" strokeWidth="2" />

        {/* Head - shows at 1 mistake */}
        {mistakeCount >= 1 && (
          <circle cx="130" cy="70" r="20" stroke="#333" strokeWidth="3" fill="none" />
        )}

        {/* Body - shows at 2 mistakes */}
        {mistakeCount >= 2 && (
          <line x1="130" y1="90" x2="130" y2="150" stroke="#333" strokeWidth="3" />
        )}

        {/* Left arm - shows at 3 mistakes */}
        {mistakeCount >= 3 && (
          <line x1="130" y1="110" x2="100" y2="130" stroke="#333" strokeWidth="3" />
        )}

        {/* Right arm - shows at 4 mistakes */}
        {mistakeCount >= 4 && (
          <line x1="130" y1="110" x2="160" y2="130" stroke="#333" strokeWidth="3" />
        )}

        {/* Left leg - shows at 5 mistakes */}
        {mistakeCount >= 5 && (
          <line x1="130" y1="150" x2="110" y2="190" stroke="#333" strokeWidth="3" />
        )}

        {/* Right leg - shows at 6 mistakes (game over) */}
        {mistakeCount >= 6 && (
          <line x1="130" y1="150" x2="150" y2="190" stroke="#333" strokeWidth="3" />
        )}
      </svg>
    </Box>
  );
};

export default memo(HangmanFigure);
