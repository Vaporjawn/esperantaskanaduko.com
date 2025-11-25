import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import { useTranslation } from '../hooks/useTranslation';

const ProgressIndicator = () => {
  const { progress } = useTranslation();

  if (!progress) {
    return null;
  }

  return (
    <Fade in={!!progress}>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress.percentage}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                  backgroundColor: 'primary.main',
                },
              }}
            />
          </Box>
          <Box sx={{ minWidth: 45 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 'medium' }}
            >
              {`${progress.percentage}%`}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          {progress.status}
        </Typography>
      </Box>
    </Fade>
  );
};

export default ProgressIndicator;
