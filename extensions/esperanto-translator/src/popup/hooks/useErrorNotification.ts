/**
 * Error Notification Hook
 * Separate file for hook to enable Fast Refresh
 */

import { useContext } from 'react';
import { AlertColor } from '@mui/material';
import { DetailedError } from '@/types/errors';

interface ErrorNotificationOptions {
  type?: 'toast' | 'detailed';
  duration?: number;
  onRetry?: () => void;
  onConfigure?: () => void;
}

interface ErrorNotificationContextType {
  showError: (error: DetailedError, options?: ErrorNotificationOptions) => void;
  showSimpleError: (message: string, severity?: AlertColor) => void;
  dismissError: (id: string) => void;
  dismissAll: () => void;
}

// Context will be imported from ErrorNotificationContext
import { ErrorNotificationContext } from '../contexts/ErrorNotificationContext';

export const useErrorNotification = (): ErrorNotificationContextType => {
  const context = useContext(ErrorNotificationContext);
  if (!context) {
    throw new Error('useErrorNotification must be used within ErrorNotificationProvider');
  }
  return context;
};
