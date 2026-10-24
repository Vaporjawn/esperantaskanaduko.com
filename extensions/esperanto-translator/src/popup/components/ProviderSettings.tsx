/**
 * Provider Settings Component - Configure multiple translation providers
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { ProviderConfig, ProviderType } from '@/types/provider';
import { getTranslationServiceV2 } from '@/services/translationServiceV2';

interface ProviderSettingsProps {
  providers: ProviderConfig[];
  onUpdate: (providers: ProviderConfig[]) => void;
}

const PROVIDER_INFO: Record<ProviderType, { name: string; description: string; requiresKey: boolean }> = {
  google: {
    name: 'Google Translate',
    description: 'Best accuracy, excellent Esperanto support',
    requiresKey: true,
  },
  microsoft: {
    name: 'Microsoft Translator',
    description: 'Good accuracy, limited Esperanto support',
    requiresKey: true,
  },
  libre: {
    name: 'LibreTranslate',
    description: 'Open source, free, supports Esperanto',
    requiresKey: false,
  },
  deepl: {
    name: 'DeepL',
    description: 'High quality, no Esperanto support yet',
    requiresKey: true,
  },
};

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({ providers, onUpdate }) => {
  const [localProviders, setLocalProviders] = useState<ProviderConfig[]>(providers);
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalProviders(providers);
  }, [providers]);

  const handleProviderChange = (type: ProviderType, field: keyof ProviderConfig, value: string | number | boolean | undefined) => {
    const updated = localProviders.map(p =>
      p.type === type ? { ...p, [field]: value } : p
    );
    setLocalProviders(updated);
    onUpdate(updated);
  };

  const handleTestProvider = async (type: ProviderType) => {
    setTesting(prev => ({ ...prev, [type]: true }));

    try {
      const service = getTranslationServiceV2();
      const result = await service.testProvider(type);
      setTestResults(prev => ({ ...prev, [type]: result }));
    } catch (error) {
      console.error(`Failed to test provider ${type}:`, error);
      setTestResults(prev => ({ ...prev, [type]: false }));
    } finally {
      setTesting(prev => ({ ...prev, [type]: false }));
    }
  };

  const getProviderStatus = (type: ProviderType) => {
    const provider = localProviders.find(p => p.type === type);
    if (!provider?.enabled) {
      return { color: 'default' as const, label: 'Disabled' };
    }

    const testResult = testResults[type];
    if (testResult === true) {
      return { color: 'success' as const, label: 'Working' };
    }
    if (testResult === false) {
      return { color: 'error' as const, label: 'Failed' };
    }

    return { color: 'default' as const, label: 'Not Tested' };
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Translation Providers
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure multiple translation providers with automatic fallback
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Providers are used in priority order (1 = highest). If a provider fails, the next one is tried automatically.
      </Alert>

      <Stack spacing={2}>
        {localProviders.map(provider => {
          const info = PROVIDER_INFO[provider.type];
          const status = getProviderStatus(provider.type);
          const isTesting = testing[provider.type];

          return (
            <Accordion key={provider.type}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                  <Typography sx={{ flexGrow: 1 }}>
                    {info.name}
                  </Typography>
                  <Chip
                    label={status.label}
                    color={status.color}
                    size="small"
                    icon={
                      status.label === 'Working' ? <CheckCircleIcon /> :
                      status.label === 'Failed' ? <ErrorIcon /> :
                      undefined
                    }
                  />
                  <Switch
                    checked={provider.enabled}
                    onChange={(e) => handleProviderChange(provider.type, 'enabled', e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>

                  <TextField
                    label="Priority"
                    type="number"
                    size="small"
                    value={provider.priority}
                    onChange={(e) => handleProviderChange(provider.type, 'priority', parseInt(e.target.value))}
                    helperText="Lower number = higher priority (1 is highest)"
                    inputProps={{ min: 1, max: 10 }}
                  />

                  {info.requiresKey && (
                    <TextField
                      label="API Key"
                      type="password"
                      size="small"
                      fullWidth
                      value={provider.apiKey || ''}
                      onChange={(e) => handleProviderChange(provider.type, 'apiKey', e.target.value)}
                      helperText="Required for this provider"
                    />
                  )}

                  {provider.type === 'libre' && (
                    <TextField
                      label="API Endpoint (Optional)"
                      size="small"
                      fullWidth
                      value={provider.apiEndpoint || ''}
                      onChange={(e) => handleProviderChange(provider.type, 'apiEndpoint', e.target.value)}
                      helperText="Use custom LibreTranslate server (default: libretranslate.com)"
                      placeholder="https://libretranslate.com"
                    />
                  )}

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleTestProvider(provider.type)}
                      disabled={!provider.enabled || isTesting}
                      startIcon={isTesting ? <CircularProgress size={16} /> : <RefreshIcon />}
                    >
                      {isTesting ? 'Testing...' : 'Test Connection'}
                    </Button>

                    {testResults[provider.type] !== undefined && (
                      <Typography variant="body2" color={testResults[provider.type] ? 'success.main' : 'error.main'}>
                        {testResults[provider.type] ? '✓ Test passed' : '✗ Test failed'}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
};
