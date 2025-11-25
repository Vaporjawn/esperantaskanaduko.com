import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  Description as DescriptionIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { translationHistoryService } from '@/services/historyService';
import type { TranslationHistoryEntry } from '@/types/history';
import {
  exportHistoryAsJSON,
  exportHistoryAsCSV,
  exportTranslationAsHTML,
} from '@/utils/exportUtils';

interface HistoryViewerProps {
  open: boolean;
  onClose: () => void;
}

export default function HistoryViewer({ open, onClose }: HistoryViewerProps) {
  const [history, setHistory] = useState<TranslationHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TranslationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load history when drawer opens
  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  // Filter history when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = history.filter(
        entry =>
          entry.originalText.toLowerCase().includes(query) ||
          entry.translatedText.toLowerCase().includes(query) ||
          entry.pageTitle?.toLowerCase().includes(query) ||
          entry.url?.toLowerCase().includes(query)
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await translationHistoryService.getHistory();
      setHistory(data);
      setFilteredHistory(data);
    } catch (err) {
      setError('Failed to load translation history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const success = await translationHistoryService.deleteHistoryEntry(id);
      if (success) {
        setHistory(prev => prev.filter(entry => entry.id !== id));
        setSuccess('Translation deleted');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete translation');
      }
    } catch (err) {
      setError('Failed to delete translation');
      console.error('Error deleting entry:', err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all translation history?')) {
      return;
    }

    try {
      const success = await translationHistoryService.clearHistory();
      if (success) {
        setHistory([]);
        setFilteredHistory([]);
        setSuccess('History cleared successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to clear history');
      }
    } catch (err) {
      setError('Failed to clear history');
      console.error('Error clearing history:', err);
    }
  };

  const handleExportJSON = () => {
    try {
      exportHistoryAsJSON(history);
      setSuccess('History exported as JSON');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to export history');
      console.error('Error exporting history:', err);
    }
    setExportMenuAnchor(null);
  };

  const handleExportCSV = () => {
    try {
      exportHistoryAsCSV(history);
      setSuccess('History exported as CSV');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to export history');
      console.error('Error exporting history:', err);
    }
    setExportMenuAnchor(null);
  };

  const handleExportSingleEntry = (entry: TranslationHistoryEntry) => {
    try {
      exportTranslationAsHTML(entry);
      setSuccess('Translation exported as HTML');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to export translation');
      console.error('Error exporting entry:', err);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 450, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon /> Translation History
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search and Actions */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search translations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={e => setExportMenuAnchor(e.currentTarget)}
              disabled={history.length === 0}
              fullWidth
            >
              Export
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearAll}
              disabled={history.length === 0}
              fullWidth
            >
              Clear All
            </Button>
          </Box>

          {/* Export Menu */}
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
          >
            <MenuItem onClick={handleExportJSON}>
              <FileDownloadIcon sx={{ mr: 1 }} fontSize="small" />
              Export as JSON
            </MenuItem>
            <MenuItem onClick={handleExportCSV}>
              <FileDownloadIcon sx={{ mr: 1 }} fontSize="small" />
              Export as CSV
            </MenuItem>
          </Menu>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ m: 2, mb: 0 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ m: 2, mb: 0 }}>
            {success}
          </Alert>
        )}

        {/* History List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredHistory.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {searchQuery ? 'No matching translations found' : 'No translation history yet'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredHistory.map((entry, index) => (
                <Box key={entry.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      py: 2,
                    }}
                  >
                    {/* Entry Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Chip
                          label={entry.translationType}
                          size="small"
                          color={entry.translationType === 'page' ? 'primary' : 'secondary'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Chip
                          icon={<LanguageIcon />}
                          label={`${entry.sourceLang} → ${entry.targetLang}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(entry.timestamp)}
                      </Typography>
                    </Box>

                    {/* Page Title & URL */}
                    {entry.pageTitle && (
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {entry.pageTitle}
                      </Typography>
                    )}
                    {entry.url && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {entry.url}
                      </Typography>
                    )}

                    {/* Translated Text */}
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 1, bgcolor: 'action.hover' }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                        Esperanto:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {truncateText(entry.translatedText, 150)}
                      </Typography>
                    </Paper>

                    {/* Original Text */}
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Original:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {truncateText(entry.originalText, 150)}
                      </Typography>
                    </Paper>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Tooltip title="Export as HTML">
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleExportSingleEntry(entry)}
                          variant="outlined"
                          sx={{ flex: 1 }}
                        >
                          Export
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete this translation">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {entry.charCount.toLocaleString()} characters
                      </Typography>
                    </Box>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Box>

        {/* Footer Stats */}
        {history.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {filteredHistory.length !== history.length
                ? `Showing ${filteredHistory.length} of ${history.length} translations`
                : `${history.length} translation${history.length !== 1 ? 's' : ''} total`}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
