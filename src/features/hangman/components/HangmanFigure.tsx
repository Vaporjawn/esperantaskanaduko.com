import { memo } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HANGMAN_SVG } from '../constants';

interface HangmanFigureProps {
  /** Number of wrong guesses so far (0-6); each one draws another body part. */
  mistakeCount: number;
}

/**
 * SVG gallows that grows one body part per mistake.
 * Strokes use `currentColor`, so the figure follows the site's light/dark theme.
 */
const HangmanFigure = ({ mistakeCount }: HangmanFigureProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: HANGMAN_SVG.MIN_HEIGHT,
        userSelect: 'none',
        color: 'text.primary',
      }}
      role='img'
      aria-label={t('games.hangman.figureLabel', {
        count: mistakeCount,
        defaultValue: 'Hangman with {{count}} mistakes',
      })}
    >
      <svg
        width={HANGMAN_SVG.WIDTH}
        height={HANGMAN_SVG.HEIGHT}
        viewBox={`0 0 ${HANGMAN_SVG.WIDTH} ${HANGMAN_SVG.HEIGHT}`}
        aria-hidden='true'
        stroke='currentColor'
        fill='none'
        strokeLinecap='round'
      >
        {/* Gallows base, pole, beam and rope */}
        <line x1='10' y1='230' x2='150' y2='230' strokeWidth='4' />
        <line x1='50' y1='230' x2='50' y2='20' strokeWidth='4' />
        <line x1='50' y1='20' x2='130' y2='20' strokeWidth='4' />
        <line x1='130' y1='20' x2='130' y2='50' strokeWidth='2' />

        {/* Head (1), body (2), arms (3, 4), legs (5, 6) */}
        {mistakeCount >= 1 && <circle cx='130' cy='70' r='20' strokeWidth='3' />}
        {mistakeCount >= 2 && <line x1='130' y1='90' x2='130' y2='150' strokeWidth='3' />}
        {mistakeCount >= 3 && <line x1='130' y1='110' x2='100' y2='130' strokeWidth='3' />}
        {mistakeCount >= 4 && <line x1='130' y1='110' x2='160' y2='130' strokeWidth='3' />}
        {mistakeCount >= 5 && <line x1='130' y1='150' x2='110' y2='190' strokeWidth='3' />}
        {mistakeCount >= 6 && <line x1='130' y1='150' x2='150' y2='190' strokeWidth='3' />}
      </svg>
    </Box>
  );
};

export default memo(HangmanFigure);
