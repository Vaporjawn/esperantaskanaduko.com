import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Spellcheck } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '../../../theme/theme';
import { analyzeSentence, type AnalysisResult } from '@esperanto-analyzer';
import { SEO } from '../../../components/SEO';

/** Longest text analysed at once; keeps typing responsive. */
const MAX_TEXT_LENGTH = 2000;

const SAMPLE_TEXT = 'Mi legas la belan libron en la ĝardeno.';

/**
 * Describe the grammatical features the analyzer found for one word,
 * e.g. ["plural", "accusative", "past tense"].
 */
const describeFeatures = (word: AnalysisResult, t: (key: string, fallback: string) => string): string[] => {
  const { morphology } = word;
  const features: string[] = [];
  if (!morphology) return features;
  if (morphology.isPlural) features.push(t('analyzer.features.plural', 'plural'));
  if (morphology.isAccusative) features.push(t('analyzer.features.accusative', 'accusative'));
  if (morphology.isPossessive) features.push(t('analyzer.features.possessive', 'possessive'));
  if (morphology.tense) features.push(morphology.tense);
  if (morphology.mood) features.push(morphology.mood);
  return features;
};

/**
 * Morphological analyzer for Esperanto text — the in-site home of the
 * former standalone esperanto-analyzer package (packages/esperanto-analyzer).
 */
const AnalyzerPage = () => {
  const { t } = useTranslation();
  const [text, setText] = useState(SAMPLE_TEXT);

  const analysis = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? analyzeSentence(trimmed) : null;
  }, [text]);

  const tr = (key: string, fallback: string) => t(key, fallback);

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
          title={t('seo.pages.analyzer.title', 'Esperanto Analyzer - Parts of Speech & Grammar')}
          description={t(
            'seo.pages.analyzer.description',
            'Paste Esperanto text and see the part of speech, number, case and verb tense of every word.'
          )}
          keywords={['Esperanto analyzer', 'Esperanto grammar', 'Esperanto parts of speech', 'morphology']}
          canonical='https://esperantaskanaduko.com/tools/analyzer'
          type='website'
        />

        <Container maxWidth='md'>
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
              <Spellcheck sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' }, verticalAlign: 'middle', mr: 1 }} />
              {t('analyzer.title', 'Analyzer')}
            </Typography>
            <Typography variant='h6' sx={{ color: 'text.secondary', mt: 1 }}>
              {t('analyzer.subtitle', 'See the grammar of every word in an Esperanto text.')}
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
            <TextField
              fullWidth
              multiline
              minRows={3}
              value={text}
              onChange={event => setText(event.target.value.slice(0, MAX_TEXT_LENGTH))}
              label={t('analyzer.inputLabel', 'Esperanto text')}
              helperText={t('analyzer.inputHelp', {
                count: text.length,
                max: MAX_TEXT_LENGTH,
                defaultValue: '{{count}} / {{max}} characters',
              })}
              slotProps={{ htmlInput: { lang: 'eo' } }}
            />

            {analysis && analysis.words.length > 0 && (
              <>
                <Stack
                  direction='row'
                  gap={1}
                  flexWrap='wrap'
                  sx={{ mt: 3 }}
                  aria-label={t('analyzer.summary', 'Summary')}
                >
                  {Object.entries(analysis.statistics.partOfSpeechCounts).map(([pos, count]) => (
                    <Chip
                      key={pos}
                      label={`${tr(`analyzer.pos.${pos}`, pos)}: ${count}`}
                      variant='outlined'
                      color='primary'
                    />
                  ))}
                </Stack>

                <TableContainer sx={{ mt: 2 }}>
                  <Table size='small' aria-label={t('analyzer.tableLabel', 'Word analysis')}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('analyzer.columns.word', 'Word')}</TableCell>
                        <TableCell>{t('analyzer.columns.partOfSpeech', 'Part of speech')}</TableCell>
                        <TableCell>{t('analyzer.columns.features', 'Features')}</TableCell>
                        <TableCell align='right'>{t('analyzer.columns.confidence', 'Confidence')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysis.words.map((word, index) => (
                        <TableRow key={`${index}-${word.word}`}>
                          <TableCell sx={{ fontWeight: 'bold' }} lang='eo'>
                            {word.word}
                          </TableCell>
                          <TableCell>{tr(`analyzer.pos.${word.partOfSpeech}`, word.partOfSpeech)}</TableCell>
                          <TableCell>{describeFeatures(word, tr).join(', ') || '—'}</TableCell>
                          <TableCell align='right'>{Math.round((word.confidence ?? 0) * 100)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AnalyzerPage;
