import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { SEO } from '../../../components/SEO';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { SocialLinks } from '../../components/socialLinks/SocialLinks';
import { CONTRIBUTORS } from '../../../data/contributors';

// ─── Style helpers ────────────────────────────────────────────────────────────

const cardSx = {
  padding: { xs: 3, md: 4 },
  width: '100%',
  backgroundColor: 'rgba(18, 20, 21, 0.9)',
  border: '1px solid rgba(0, 255, 0, 0.2)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
};

const h2Sx = {
  fontSize: { xs: '1.5rem', md: '2rem' },
  color: '#00ff00',
  fontFamily: 'Copperplate',
  textTransform: 'uppercase' as const,
  marginBottom: '1rem',
};

const bodySx = {
  color: '#ffffff',
  fontSize: '1.1rem',
  lineHeight: 1.7,
};

// ─── Tech stack data (static — no i18n needed for tech names) ────────────────

interface TechItem {
  name: string;
  href: string;
}

const TECH_STACK: TechItem[] = [
  { name: 'React 18',        href: 'https://react.dev' },
  { name: 'TypeScript',      href: 'https://www.typescriptlang.org' },
  { name: 'Vite',            href: 'https://vitejs.dev' },
  { name: 'Material UI v7',  href: 'https://mui.com' },
  { name: 'Firebase',        href: 'https://firebase.google.com' },
  { name: 'i18next',         href: 'https://www.i18next.com' },
  { name: 'React Router',    href: 'https://reactrouter.com' },
  { name: 'GitHub Pages',    href: 'https://pages.github.com' },
];

// ─── Related projects data ────────────────────────────────────────────────────

interface Project {
  nameKey: string;
  descKey: string;
  href: string;
}

const RELATED_PROJECTS: Project[] = [
  {
    nameKey: 'about.sections.relatedProjects.esperantoAnalyzer.name',
    descKey: 'about.sections.relatedProjects.esperantoAnalyzer.description',
    href:    '/tools/analyzer',
  },
  {
    nameKey: 'about.sections.relatedProjects.pendumulo.name',
    descKey: 'about.sections.relatedProjects.pendumulo.description',
    href:    '/games/pendumulo',
  },
  {
    nameKey: 'about.sections.relatedProjects.extensions.name',
    descKey: 'about.sections.relatedProjects.extensions.description',
    href:    'https://github.com/Vaporjawn/esperantaskanaduko.com/tree/main/extensions',
  },
  {
    nameKey: 'about.sections.relatedProjects.mangaDex.name',
    descKey: 'about.sections.relatedProjects.mangaDex.description',
    href:    'https://mangadex.org/search?q=esperanto',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('about.page.title')}
        description={t('about.page.description')}
        keywords={['Esperanto library', 'public domain texts', 'Esperanto literature', 'translated texts', 'biblioteko', 'esperanto']}
      />

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#000000',
          background: 'linear-gradient(135deg, #000000 0%, #001a00 50%, #000000 100%)',
          paddingY: { xs: '1rem', md: '2rem' },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* ── Page heading ─────────────────────────────────────────── */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                color: '#00ff00',
                fontFamily: 'Copperplate',
                textTransform: 'uppercase',
                textAlign: 'center',
                letterSpacing: '0.04em',
              }}
            >
              {t('about.sections.website.title')}
            </Typography>

            {/* ── Website / Mission / License ──────────────────────────── */}
            <Paper elevation={3} sx={cardSx}>
              <Typography variant="body1" paragraph sx={bodySx}>
                {t('about.sections.website.body')}
              </Typography>

              <Divider sx={{ borderColor: 'rgba(0,255,0,0.15)', my: 3 }} />

              <Typography variant="h2" sx={h2Sx}>
                {t('about.sections.mission.title')}
              </Typography>
              <Typography variant="body1" paragraph sx={bodySx}>
                {t('about.sections.mission.body')}
              </Typography>

              <Divider sx={{ borderColor: 'rgba(0,255,0,0.15)', my: 3 }} />

              <Typography variant="h2" sx={h2Sx}>
                {t('about.sections.license.title')}
              </Typography>
              <Typography variant="body1" sx={bodySx}>
                {t('about.sections.license.body')}
              </Typography>
            </Paper>

            {/* ── Team / Contributors ───────────────────────────────────── */}
            <Paper elevation={3} sx={cardSx}>
              <Typography variant="h2" sx={h2Sx}>
                {t('about.sections.team.title')}
              </Typography>
              <Typography variant="body1" sx={{ ...bodySx, mb: 3 }}>
                {t('about.sections.team.body')}
              </Typography>

              <Grid container spacing={2}>
                {CONTRIBUTORS.map((contributor) => (
                  <Grid key={contributor.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      component={contributor.github || contributor.website ? 'a' : 'div'}
                      href={
                        contributor.github
                          ? `https://github.com/${contributor.github}`
                          : contributor.website
                      }
                      target={contributor.github || contributor.website ? '_blank' : undefined}
                      rel={contributor.github || contributor.website ? 'noopener noreferrer' : undefined}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2.5,
                        border: '1px solid rgba(0,255,0,0.15)',
                        borderRadius: 2,
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, background-color 0.2s',
                        '&:hover': {
                          borderColor: 'rgba(0,255,0,0.4)',
                          backgroundColor: 'rgba(0,255,0,0.04)',
                        },
                      }}
                    >
                      {/* Avatar: image or emoji fallback */}
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,255,0,0.08)',
                          border: '1px solid rgba(0,255,0,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {contributor.avatar ? (
                          <Box
                            component="img"
                            src={contributor.avatar}
                            alt={contributor.name}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box component="span" sx={{ fontSize: '1.5rem' }}>
                            {contributor.avatarEmoji ?? '🌱'}
                          </Box>
                        )}
                      </Box>

                      {/* Name + role */}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: '#00ff00',
                            fontWeight: 600,
                            fontSize: '1rem',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {contributor.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.85rem',
                            lineHeight: 1.4,
                            mt: 0.25,
                          }}
                        >
                          {contributor.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* ── Related Projects ──────────────────────────────────────── */}
            <Paper elevation={3} sx={cardSx}>
              <Typography variant="h2" sx={h2Sx}>
                {t('about.sections.relatedProjects.title')}
              </Typography>
              <Typography variant="body1" sx={{ ...bodySx, mb: 3 }}>
                {t('about.sections.relatedProjects.body')}
              </Typography>

              <Grid container spacing={2}>
                {RELATED_PROJECTS.map((project) => (
                  <Grid key={project.nameKey} size={{ xs: 12, sm: 6 }}>
                    <Box
                      {...(project.href.startsWith('/')
                        ? { component: RouterLink, to: project.href }
                        : { component: 'a', href: project.href, target: '_blank', rel: 'noopener noreferrer' })}
                      sx={{
                        display: 'block',
                        p: 2.5,
                        border: '1px solid rgba(0,255,0,0.2)',
                        borderRadius: 2,
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, background-color 0.2s',
                        '&:hover': {
                          borderColor: '#00ff00',
                          backgroundColor: 'rgba(0,255,0,0.05)',
                        },
                      }}
                    >
                      <Typography
                        sx={{ color: '#00ff00', fontWeight: 600, mb: 0.75 }}
                      >
                        {t(project.nameKey)}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {t(project.descKey)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* ── Contribute ────────────────────────────────────────────── */}
            <Paper elevation={3} sx={cardSx}>
              <Typography variant="h2" sx={h2Sx}>
                {t('about.sections.contribute.title')}
              </Typography>
              <Typography variant="body1" sx={{ ...bodySx, mb: 2 }}>
                {t('about.sections.contribute.body')}
              </Typography>

              <Box component="ul" sx={{ pl: 2.5, mb: 3, '& li': { color: '#ffffff', mb: 1, lineHeight: 1.7 } }}>
                <li>{t('about.sections.contribute.code')}</li>
                <li>{t('about.sections.contribute.translations')}</li>
                <li>{t('about.sections.contribute.resources')}</li>
              </Box>

              <Button
                component="a"
                href="https://github.com/Vaporjawn/esperantaskanaduko.com"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                sx={{
                  color: '#00ff00',
                  borderColor: 'rgba(0,255,0,0.5)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    borderColor: '#00ff00',
                    backgroundColor: 'rgba(0,255,0,0.08)',
                  },
                }}
              >
                {t('about.sections.contribute.cta')}
              </Button>
            </Paper>

            {/* ── Tech Stack ────────────────────────────────────────────── */}
            <Paper elevation={3} sx={cardSx}>
              <Typography variant="h2" sx={h2Sx}>
                {t('about.sections.techStack.title')}
              </Typography>
              <Typography variant="body1" sx={{ ...bodySx, mb: 3 }}>
                {t('about.sections.techStack.body')}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {TECH_STACK.map(({ name, href }) => (
                  <Chip
                    key={name}
                    label={name}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    sx={{
                      backgroundColor: 'rgba(0,255,0,0.08)',
                      color: '#00ff00',
                      border: '1px solid rgba(0,255,0,0.25)',
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: 'rgba(0,255,0,0.18)',
                        borderColor: '#00ff00',
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {/* ── Connect ───────────────────────────────────────────────── */}
            <Paper elevation={3} sx={cardSx}>
              <Typography variant="h2" sx={h2Sx}>
                {t('about.sections.connect.title')}
              </Typography>
              <Typography variant="body1" sx={{ ...bodySx, mb: 3 }}>
                {t('about.sections.connect.body')}
              </Typography>

              <SocialLinks
                variant="expanded"
                include={['github', 'mangadex', 'email']}
              />
            </Paper>

          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
