import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsIcon from '@mui/icons-material/Settings';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from '../hooks/useTranslation';
import { getLanguageName } from '../../utils/languageNames';

interface StatusIndicatorProps {
  onSettingsClick: () => void;
}

const StatusIndicator = ({ onSettingsClick }: StatusIndicatorProps) => {
  const { status, detectedLanguage, isTranslated } = useTranslation();

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'error':
        return 'error';
      case 'translating':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ready':
        return <CheckCircleIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'translating':
        return <CircularProgress size={16} />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'ready':
        return isTranslated ? 'Translated' : 'Ready';
      case 'error':
        return 'Error';
      case 'translating':
        return 'Translating...';
      case 'idle':
        return 'Idle';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header with title and status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TranslateIcon color="primary" />
              <Typography variant="h6" component="div">
                Esperanto Translator
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getStatusLabel()}
                color={getStatusColor()}
                size="small"
                {...(getStatusIcon() && { icon: getStatusIcon()! })}
              />
              <IconButton
                size="small"
                onClick={onSettingsClick}
                aria-label="settings"
                sx={{ ml: 0.5 }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Language detection section */}
          {detectedLanguage && (
            <>
              <Divider />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <LanguageIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Detected Language
                  </Typography>
                </Box>
                <Box sx={{ pl: 3.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {getLanguageName(detectedLanguage)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Language code: {detectedLanguage.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {/* Translation target info */}
          {isTranslated && (
            <Box sx={{
              bgcolor: 'success.light',
              p: 1.5,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.dark' }} />
              <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 500 }}>
                Page translated to Esperanto
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatusIndicator;
