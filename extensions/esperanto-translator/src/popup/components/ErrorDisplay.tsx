/**
 * Error Display Component
 * Beautiful UI for displaying detailed errors with recovery actions
 */

import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  IconButton,
  Typography,
  Stack,
  Chip,
  Link,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { DetailedError, ErrorSeverity } from '@/types/errors';
import { logger } from '@/utils/logger';

interface ErrorDisplayProps {
  error: DetailedError;
  onClose?: () => void;
  onRetry?: () => void;
  onConfigure?: () => void;
  showTechnicalDetails?: boolean;
}

const getSeverityColor = (severity: ErrorSeverity): 'error' | 'warning' | 'info' | 'success' => {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.HIGH:
      return 'error';
    case ErrorSeverity.MEDIUM:
      return 'warning';
    case ErrorSeverity.LOW:
    case ErrorSeverity.INFO:
      return 'info';
    default:
      return 'error';
  }
};

const getSeverityLabel = (severity: ErrorSeverity): string => {
  return severity.charAt(0) + severity.slice(1).toLowerCase();
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onClose,
  onRetry,
  onConfigure,
  showTechnicalDetails = false,
}) => {
  const [expanded, setExpanded] = useState(showTechnicalDetails);
  const [copied, setCopied] = useState(false);

  const handleCopyError = async () => {
    const errorText = `
Error Code: ${error.code}
Message: ${error.message}
User Message: ${error.userMessage}
Category: ${error.category}
Severity: ${error.severity}
Technical Details: ${error.technicalDetails}
Context: ${JSON.stringify(error.context, null, 2)}
Stack Trace: ${error.context.stackTrace || 'N/A'}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error to clipboard:', err);
    }
  };

  const handleRecoveryAction = (actionType: string) => {
    logger.info(`Executing recovery action: ${actionType}`, {
      errorCode: error.code,
      timestamp: Date.now(),
    });

    switch (actionType) {
      case 'retry':
        onRetry?.();
        break;
      case 'reload':
        window.location.reload();
        break;
      case 'configure':
        onConfigure?.();
        break;
      case 'clearCache':
        // Clear cache and reload
        chrome.runtime.sendMessage({ type: 'clearCache' }, () => {
          window.location.reload();
        });
        break;
      case 'contact':
        // Open support/contact page
        if (error.helpUrl) {
          window.open(error.helpUrl, '_blank');
        }
        break;
      case 'ignore':
        onClose?.();
        break;
      default:
        logger.warn(`Unknown recovery action: ${actionType}`);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'retry':
        return <RefreshIcon />;
      case 'configure':
        return <SettingsIcon />;
      case 'reload':
        return <RefreshIcon />;
      default:
        return null;
    }
  };

  return (
    <Alert
      severity={getSeverityColor(error.severity)}
      onClose={onClose}
      action={
        onClose && (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        )
      }
      sx={{ mb: 2 }}
    >
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle1" component="span" fontWeight="bold">
          {error.userMessage}
        </Typography>
        <Chip
          label={getSeverityLabel(error.severity)}
          size="small"
          color={getSeverityColor(error.severity)}
          sx={{ height: 20 }}
        />
      </AlertTitle>

      {/* Error Code and Category */}
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Error Code: <strong>{error.code}</strong> | Category: <strong>{error.category}</strong>
        </Typography>
      </Box>

      {/* Recovery Actions */}
      {error.recoveryActions.length > 0 && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Suggested Actions:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {error.recoveryActions.map((action, index) => (
              <Button
                key={index}
                size="small"
                variant="outlined"
                startIcon={getActionIcon(action.action)}
                onClick={() => handleRecoveryAction(action.action)}
                title={action.description}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* Help Link */}
      {error.helpUrl && (
        <Box sx={{ mt: 1 }}>
          <Link
            href={error.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            Learn more <OpenIcon sx={{ fontSize: 14 }} />
          </Link>
        </Box>
      )}

      {/* Technical Details (Expandable) */}
      <Box sx={{ mt: 2 }}>
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          endIcon={
            <ExpandMoreIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          }
        >
          Technical Details
        </Button>

        <Collapse in={expanded}>
          <Paper
            variant="outlined"
            sx={{
              mt: 1,
              p: 2,
              bgcolor: 'grey.50',
              position: 'relative',
            }}
          >
            <IconButton
              size="small"
              onClick={handleCopyError}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              title={copied ? 'Copied!' : 'Copy error details'}
            >
              <CopyIcon fontSize="small" />
            </IconButton>

            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              <strong>Technical Description:</strong>
              <Box component="pre" sx={{ mt: 0.5, fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                {error.technicalDetails}
              </Box>
            </Typography>

            {error.context.url && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>URL:</strong> {error.context.url}
              </Typography>
            )}

            {error.context.tabId && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Tab ID:</strong> {error.context.tabId}
              </Typography>
            )}

            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Timestamp:</strong> {new Date(error.context.timestamp).toLocaleString()}
            </Typography>

            {error.context.extensionVersion && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Extension Version:</strong> {error.context.extensionVersion}
              </Typography>
            )}

            {error.context.additionalData && Object.keys(error.context.additionalData).length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Additional Context:</strong>
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    fontSize: '0.7rem',
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  {JSON.stringify(error.context.additionalData, null, 2)}
                </Box>
              </Box>
            )}

            {error.context.stackTrace && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Stack Trace:</strong>
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    fontSize: '0.65rem',
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 150,
                  }}
                >
                  {error.context.stackTrace}
                </Box>
              </Box>
            )}

            {/* Recoverable Status */}
            <Box sx={{ mt: 2 }}>
              <Chip
                label={error.isRecoverable ? 'Recoverable' : 'Non-Recoverable'}
                size="small"
                color={error.isRecoverable ? 'success' : 'error'}
              />
            </Box>
          </Paper>
        </Collapse>
      </Box>
    </Alert>
  );
};

export default ErrorDisplay;
