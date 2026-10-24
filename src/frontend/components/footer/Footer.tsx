import { Box, Typography, Link, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import GitHubLink from './gitHubLink/GitHubLink';
import { SocialLinks } from '../socialLinks/SocialLinks';
import { logAnalyticsEvent } from '../../../backend/firebase/analytics';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        padding: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: { xs: '1rem', md: '1.5rem' },
          marginBottom: { xs: '0.75rem', md: '1rem' },
        }}
      >
        {/* Social Links Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#00ff00',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {t('footer.social.title')}
          </Typography>
          <SocialLinks
            variant="compact"
            include={['mangadex', 'email', 'suggest']}
          />
        </Box>

        {/* Related Projects Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#00ff00',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {t('footer.projects.title')}
          </Typography>
          <Link
            component={RouterLink}
            to="/tools/analyzer"
            sx={{
              display: 'block',
              color: '#a0a0a0',
              textDecoration: 'none',
              transition: 'color 0.25s',
              '&:hover': { color: '#00ff00' },
            }}
          >
            <Typography sx={{ fontWeight: 500, marginBottom: '0.25rem', color: 'inherit' }}>
              {t('footer.projects.esperantoAnalyzer.title')}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'inherit' }}>
              {t('footer.projects.esperantoAnalyzer.description')}
            </Typography>
          </Link>
        </Box>

        {/* Support Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#00ff00',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {t('navigation.donate')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link
              href="https://www.paypal.com/donate?business=FSQHDN6NA2AJA&item_name=financado+por+Esperanta+Skanaduko&currency_code=USD"
              target="_blank"
              rel="noreferrer"
              onClick={() => logAnalyticsEvent('donate_initiated', { platform: 'paypal' })}
              sx={{
                color: '#a0a0a0',
                textDecoration: 'none',
                transition: 'color 0.25s',
                '&:hover': { color: '#00ff00' },
              }}
            >
              PayPal
            </Link>
            <Link
              href="https://buymeacoffee.com/Vaporjawn"
              target="_blank"
              rel="noreferrer"
              onClick={() => logAnalyticsEvent('donate_initiated', { platform: 'buymeacoffee' })}
              sx={{
                color: '#a0a0a0',
                textDecoration: 'none',
                transition: 'color 0.25s',
                '&:hover': { color: '#00ff00' },
              }}
            >
              Buy Me a Coffee
            </Link>
            <Link
              href="https://www.patreon.com/c/u64402381"
              target="_blank"
              rel="noreferrer"
              onClick={() => logAnalyticsEvent('donate_initiated', { platform: 'patreon' })}
              sx={{
                color: '#a0a0a0',
                textDecoration: 'none',
                transition: 'color 0.25s',
                '&:hover': { color: '#00ff00' },
              }}
            >
              Patreon
            </Link>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.1)', marginY: { xs: '0.5rem', md: '0.75rem' } }} />

      {/* Copyright Section */}
      <Typography
        component="p"
        sx={{
          textAlign: 'center',
          color: '#a0a0a0',
          fontSize: '0.9rem',
        }}
      >
        {t('footer.legal.developedBy')} <GitHubLink />
      </Typography>
      <Typography
        component="p"
        sx={{
          textAlign: 'center',
          color: '#a0a0a0',
          fontSize: '0.85rem',
          marginTop: '0.5rem',
        }}
      >
        © {new Date().getFullYear()} Esperanta Skanaduko · {t('footer.legal.copyright')}
      </Typography>
    </Box>
  );
};

export default Footer;
