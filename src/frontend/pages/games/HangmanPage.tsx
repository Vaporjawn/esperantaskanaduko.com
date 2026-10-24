import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { SportsEsports } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '../../../theme/theme';
import { SEO } from '../../../components/SEO';
import { useHangman } from '../../../features/hangman/useHangman';
import { useKeyboardInput } from '../../../features/hangman/useKeyboardInput';
import HangmanFigure from '../../../features/hangman/components/HangmanFigure';
import WordSlots from '../../../features/hangman/components/WordSlots';
import KeyboardEO from '../../../features/hangman/components/KeyboardEO';
import StatusBar from '../../../features/hangman/components/StatusBar';
import Controls from '../../../features/hangman/components/Controls';

/**
 * Pendumulo — hangman for the 28-letter Esperanto alphabet.
 *
 * Letters can be picked on the on-screen keyboard or typed; the x-notation
 * (cx, gx, hx, jx, sx, ux) types the accented letters.
 */
const HangmanPage = () => {
  const { t } = useTranslation();
  const game = useHangman();

  useKeyboardInput(game.guess, game.phase === 'playing');

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #001a00 50%, #000000 100%)',
          paddingY: { xs: '1rem', md: '2rem' },
        }}
      >
        <SEO
          title={t('seo.pages.hangman.title', 'Pendumulo - Esperanto Hangman Game')}
          description={t(
            'seo.pages.hangman.description',
            'Play Pendumulo, a hangman game for the Esperanto alphabet. Practise vocabulary and the letters ĉ, ĝ, ĥ, ĵ, ŝ and ŭ.'
          )}
          keywords={['Esperanto game', 'Esperanto hangman', 'pendumulo', 'learn Esperanto vocabulary']}
          canonical='https://esperantaskanaduko.com/games/pendumulo'
          type='website'
        />

        <Container maxWidth='sm'>
          <Box sx={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Typography
              variant='h1'
              sx={{
                color: '#00ff00',
                fontSize: { xs: '2.5rem', sm: '3.5rem' },
                fontFamily: 'Copperplate',
                textTransform: 'uppercase',
              }}
            >
              <SportsEsports sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' }, verticalAlign: 'middle', mr: 1 }} />
              {t('games.hangman.title', 'Pendumulo')}
            </Typography>
            <Typography variant='h6' sx={{ color: 'text.secondary', mt: 1 }}>
              {t('games.hangman.subtitle', 'Guess the Esperanto word before the figure is complete.')}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              backgroundColor: 'rgba(18, 20, 21, 0.9)',
              border: '1px solid rgba(0, 255, 0, 0.2)',
            }}
          >
            <Stack spacing={2}>
              <StatusBar phase={game.phase} secret={game.secret} />
              <HangmanFigure mistakeCount={game.wrong.size} />
              <WordSlots secret={game.secret} guessed={game.guessed} phase={game.phase} />
              <Controls
                mistakeCount={game.wrong.size}
                maxMistakes={game.maxMistakes}
                stats={game.stats}
                onNewGame={game.newGame}
              />
              <KeyboardEO guessed={game.guessed} wrong={game.wrong} phase={game.phase} onGuess={game.guess} />
            </Stack>
          </Paper>

          <Typography variant='body2' sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
            {t('games.hangman.keyboardHint', 'Tip: type cx, gx, hx, jx, sx or ux to enter ĉ, ĝ, ĥ, ĵ, ŝ or ŭ.')}
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HangmanPage;
