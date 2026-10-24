import { useState } from 'react';
import Button from '@mui/material/Button';
import TranslateIcon from '@mui/icons-material/Translate';
import RestoreIcon from '@mui/icons-material/Restore';
import CircularProgress from '@mui/material/CircularProgress';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTranslation } from '../hooks/useTranslation';
import { exportCurrentPageAsHTML } from '@/utils/exportUtils';

const TranslateButton = () => {
  const { isTranslated, toggleTranslation, isLoading } = useTranslation();
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleClick = async () => {
    await toggleTranslation();
  };

  const handleExport = async () => {
    try {
      setExportError(null);
      setExportSuccess(false);
      await exportCurrentPageAsHTML();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportError(error instanceof Error ? error.message : 'Failed to export page');
      setTimeout(() => setExportError(null), 5000);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleClick}
        disabled={isLoading}
        startIcon={
          isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : isTranslated ? (
            <RestoreIcon />
          ) : (
            <TranslateIcon />
          )
        }
        sx={{ py: 1.5 }}
      >
        {isLoading
          ? 'Translating...'
          : isTranslated
          ? 'Restore Original'
          : 'Translate to Esperanto'}
      </Button>

      {isTranslated && !isLoading && (
        <Button
          variant="outlined"
          size="medium"
          fullWidth
          onClick={handleExport}
          startIcon={<FileDownloadIcon />}
        >
          Export as HTML
        </Button>
      )}

      {exportError && (
        <Alert severity="error" onClose={() => setExportError(null)}>
          {exportError}
        </Alert>
      )}

      {exportSuccess && (
        <Alert severity="success" onClose={() => setExportSuccess(false)}>
          Page exported successfully!
        </Alert>
      )}
    </Box>
  );
};

export default TranslateButton;
