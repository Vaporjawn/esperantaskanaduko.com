/**
 * Error Notification Context
 * Provides global error notification system with toast notifications
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor, IconButton, Portal } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DetailedError, ErrorSeverity } from '@/types/errors';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { logger } from '@/utils/logger';

interface ErrorNotification {
  id: string;
  error: DetailedError;
  type: 'toast' | 'detailed';
  duration?: number;
}

interface ErrorNotificationContextType {
  showError: (error: DetailedError, options?: ErrorNotificationOptions) => void;
  showSimpleError: (message: string, severity?: AlertColor) => void;
  dismissError: (id: string) => void;
  dismissAll: () => void;
}

interface ErrorNotificationOptions {
  type?: 'toast' | 'detailed';
  duration?: number;
  onRetry?: () => void;
  onConfigure?: () => void;
}

interface ErrorCallbacks {
  onRetry?: () => void;
  onConfigure?: () => void;
}

// Global window interface extension
declare global {
  interface Window {
    __errorCallbacks?: Record<string, ErrorCallbacks>;
  }
}

export const ErrorNotificationContext = createContext<ErrorNotificationContextType | null>(null);

interface ErrorNotificationProviderProps {
  children: ReactNode;
}

export const ErrorNotificationProvider: React.FC<ErrorNotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);
  const [simpleNotification, setSimpleNotification] = useState<{
    message: string;
    severity: AlertColor;
  } | null>(null);

  const showError = useCallback((
    error: DetailedError,
    options: ErrorNotificationOptions = {}
  ) => {
    const {
      type = 'toast',
      duration = 6000,
      onRetry,
      onConfigure,
    } = options;

    const id = `error-${Date.now()}-${Math.random()}`;

    const notification: ErrorNotification = {
      id,
      error,
      type,
      duration: type === 'toast' ? duration : undefined,
    };

    setNotifications((prev) => [...prev, notification]);

    // Log the error
    logger.error(`Error ${error.code}: ${error.userMessage}`, {
      code: error.code,
      category: error.category,
      severity: error.severity,
    });

    // Auto-dismiss toast notifications
    if (type === 'toast' && duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }

    // Store callbacks for recovery actions
    if (onRetry || onConfigure) {
      window.__errorCallbacks = window.__errorCallbacks || {};
      window.__errorCallbacks[id] = { onRetry, onConfigure };
    }
  }, []);

  const showSimpleError = useCallback((message: string, severity: AlertColor = 'error') => {
    setSimpleNotification({ message, severity });

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setSimpleNotification(null);
    }, 6000);
  }, []);

  const dismissError = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // Clean up callbacks
    if (window.__errorCallbacks?.[id]) {
      delete window.__errorCallbacks[id];
    }
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
    setSimpleNotification(null);
    window.__errorCallbacks = {};
  }, []);

  const getSeverityColor = (severity: ErrorSeverity): AlertColor => {
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

  const getCallbacks = (id: string): ErrorCallbacks => {
    return window.__errorCallbacks?.[id] || {};
  };

  return (
    <ErrorNotificationContext.Provider value={{ showError, showSimpleError, dismissError, dismissAll }}>
      {children}

      {/* Toast Notifications */}
      <Portal>
        {notifications
          .filter((n) => n.type === 'toast')
          .map((notification, index) => (
            <Snackbar
              key={notification.id}
              open
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                mt: index * 8,
                maxWidth: 400,
              }}
            >
              <Alert
                severity={getSeverityColor(notification.error.severity)}
                onClose={() => dismissError(notification.id)}
                variant="filled"
                action={
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => dismissError(notification.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ width: '100%' }}
              >
                <strong>{notification.error.userMessage}</strong>
                {notification.error.technicalDetails && (
                  <div style={{ marginTop: 4, fontSize: '0.85em', opacity: 0.9 }}>
                    {notification.error.technicalDetails.substring(0, 100)}
                    {notification.error.technicalDetails.length > 100 && '...'}
                  </div>
                )}
              </Alert>
            </Snackbar>
          ))}

        {/* Simple Notifications */}
        {simpleNotification && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={6000}
            onClose={() => setSimpleNotification(null)}
          >
            <Alert
              severity={simpleNotification.severity}
              onClose={() => setSimpleNotification(null)}
              variant="filled"
            >
              {simpleNotification.message}
            </Alert>
          </Snackbar>
        )}
      </Portal>

      {/* Detailed Error Displays */}
      <Portal>
        {notifications
          .filter((n) => n.type === 'detailed')
          .map((notification) => {
            const callbacks = getCallbacks(notification.id);
            return (
              <div
                key={notification.id}
                style={{
                  position: 'fixed',
                  top: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10000,
                  maxWidth: 600,
                  width: '90%',
                }}
              >
                <ErrorDisplay
                  error={notification.error}
                  onClose={() => dismissError(notification.id)}
                  onRetry={callbacks.onRetry}
                  onConfigure={callbacks.onConfigure}
                  showTechnicalDetails
                />
              </div>
            );
          })}
      </Portal>
    </ErrorNotificationContext.Provider>
  );
};

export default ErrorNotificationProvider;
