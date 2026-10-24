/**
 * Cache Settings Component
 * Manages in-memory and offline cache configuration
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Alert,
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  LinearProgress,
  Stack,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Storage as StorageIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  CleaningServices as CleaningServicesIcon,
} from '@mui/icons-material';
import { useSettings } from '@/popup/hooks/useSettings';

export const CacheSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [memoryStats, setMemoryStats] = useState<{
    size: number;
    maxSize: number;
    utilization: number;
  } | null>(null);
  const [offlineStats, setOfflineStats] = useState<{
    entryCount: number;
    storageSizeMB: number;
    maxStorageMB: number;
    utilizationPercent: number;
    oldestEntry: string | null;
    newestEntry: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load cache statistics
  const loadStats = async () => {
    try {
      // Request stats from background script
      const response = await chrome.runtime.sendMessage({
        type: 'GET_CACHE_STATS',
      });

      if (response.success) {
        setMemoryStats(response.memoryStats);
        setOfflineStats(response.offlineStats);
      }
    } catch (error) {
      console.error('Failed to load cache stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
    // Refresh stats every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClearMemoryCache = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CLEAR_CACHE',
        payload: { cacheType: 'memory' },
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Memory cache cleared successfully' });
        await loadStats();
      } else {
        setMessage({ type: 'error', text: 'Failed to clear memory cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error clearing memory cache' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleClearOfflineCache = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CLEAR_CACHE',
        payload: { cacheType: 'offline' },
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Offline cache cleared successfully' });
        await loadStats();
      } else {
        setMessage({ type: 'error', text: 'Failed to clear offline cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error clearing offline cache' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSyncToOffline = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SYNC_OFFLINE_CACHE',
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: `Synced ${response.count} entries to offline cache`,
        });
        await loadStats();
      } else {
        setMessage({ type: 'error', text: 'Failed to sync to offline cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error syncing to offline cache' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCleanupOldEntries = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CLEANUP_OFFLINE_CACHE',
        payload: { daysOld: 90 },
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: `Cleaned up ${response.count} old entries`,
        });
        await loadStats();
      } else {
        setMessage({ type: 'error', text: 'Failed to cleanup old entries' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error cleaning up old entries' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleExportCache = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'EXPORT_OFFLINE_CACHE',
      });

      if (response.success) {
        // Create download link
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `esperanto-cache-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);

        setMessage({ type: 'success', text: 'Cache exported successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to export cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error exporting cache' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImportCache = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await chrome.runtime.sendMessage({
        type: 'IMPORT_OFFLINE_CACHE',
        payload: { entries: data },
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: `Imported ${response.count} cache entries`,
        });
        await loadStats();
      } else {
        setMessage({ type: 'error', text: 'Failed to import cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error importing cache - invalid file format' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
      event.target.value = '';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <StorageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Cache Settings
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Memory Cache Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Memory Cache</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.enableCache ?? true}
                  onChange={(e) => updateSettings({ enableCache: e.target.checked })}
                />
              }
              label="Enable memory cache"
            />

            <Box>
              <Typography gutterBottom>
                Max cache size: {settings?.cacheSize ?? 1000} entries
              </Typography>
              <Slider
                value={settings?.cacheSize ?? 1000}
                onChange={(_, value) => updateSettings({ cacheSize: value as number })}
                min={100}
                max={5000}
                step={100}
                marks={[
                  { value: 100, label: '100' },
                  { value: 2500, label: '2500' },
                  { value: 5000, label: '5000' },
                ]}
                disabled={!settings?.enableCache}
              />
            </Box>

            {memoryStats && (
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Statistics
                </Typography>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Entries: {memoryStats.size} / {memoryStats.maxSize}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={memoryStats.utilization}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Utilization: {memoryStats.utilization.toFixed(1)}%
                  </Typography>
                </Stack>
              </Paper>
            )}

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearMemoryCache}
              disabled={loading || !settings?.enableCache}
              fullWidth
            >
              Clear Memory Cache
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Offline Cache Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Offline Cache (IndexedDB)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Alert severity="info">
              <AlertTitle>Offline Cache</AlertTitle>
              Translations are stored locally for offline access using your browser's IndexedDB
              storage.
            </Alert>

            <FormControlLabel
              control={
                <Switch
                  checked={settings?.enableOfflineCache ?? true}
                  onChange={(e) => updateSettings({ enableOfflineCache: e.target.checked })}
                />
              }
              label="Enable offline cache"
            />

            <Box>
              <Typography gutterBottom>
                Max storage size: {settings?.offlineCacheSize ?? 50} MB
              </Typography>
              <Slider
                value={settings?.offlineCacheSize ?? 50}
                onChange={(_, value) => updateSettings({ offlineCacheSize: value as number })}
                min={10}
                max={200}
                step={10}
                marks={[
                  { value: 10, label: '10 MB' },
                  { value: 100, label: '100 MB' },
                  { value: 200, label: '200 MB' },
                ]}
                disabled={!settings?.enableOfflineCache}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={settings?.autoSyncOfflineCache ?? false}
                  onChange={(e) => updateSettings({ autoSyncOfflineCache: e.target.checked })}
                  disabled={!settings?.enableOfflineCache}
                />
              }
              label="Auto-sync memory cache to offline storage"
            />

            {offlineStats && (
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Statistics
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Entries: {offlineStats.entryCount}
                  </Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Storage: {offlineStats.storageSizeMB.toFixed(2)} MB /{' '}
                      {offlineStats.maxStorageMB} MB
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={offlineStats.utilizationPercent}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Utilization: {offlineStats.utilizationPercent.toFixed(1)}%
                  </Typography>
                  {offlineStats.oldestEntry && (
                    <Typography variant="body2" color="text.secondary">
                      Oldest entry: {new Date(offlineStats.oldestEntry).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            )}

            <Divider />

            <Typography variant="subtitle2">Cache Management</Typography>

            <Stack spacing={1}>
              <Button
                variant="outlined"
                startIcon={<SyncIcon />}
                onClick={handleSyncToOffline}
                disabled={loading || !settings?.enableOfflineCache}
                fullWidth
              >
                Sync Memory to Offline
              </Button>

              <Button
                variant="outlined"
                startIcon={<CleaningServicesIcon />}
                onClick={handleCleanupOldEntries}
                disabled={loading || !settings?.enableOfflineCache}
                fullWidth
              >
                Cleanup Old Entries (90+ days)
              </Button>

              <Button
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                onClick={handleExportCache}
                disabled={loading || !settings?.enableOfflineCache}
                fullWidth
              >
                Export Cache
              </Button>

              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={loading || !settings?.enableOfflineCache}
                fullWidth
              >
                Import Cache
                <input type="file" hidden accept=".json" onChange={handleImportCache} />
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearOfflineCache}
                disabled={loading || !settings?.enableOfflineCache}
                fullWidth
              >
                Clear Offline Cache
              </Button>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};
