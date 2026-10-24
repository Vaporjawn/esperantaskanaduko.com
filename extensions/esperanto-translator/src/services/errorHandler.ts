/**
 * Comprehensive Error Handler Service
 * Provides centralized error handling with detailed logging and recovery
 */

import { logger } from '@/utils/logger';
import { ErrorCode, DetailedError, ErrorCategory, ErrorRecoveryAction } from '@/types/errors';

// Type-safe context for error handling
type ErrorContext = Record<string, string | number | boolean | null | undefined>;

// Enhanced error with detailed error attached
interface EnhancedError extends Error {
  detailedError?: DetailedError;
}

export class ErrorHandler {
  /**
   * Handle fetch/network errors with detailed analysis
   */
  static handleNetworkError(error: Error, context?: ErrorContext): DetailedError {
    let errorCode = ErrorCode.NET_NO_CONNECTION;

    const message = error.message.toLowerCase();

    if (message.includes('timeout')) {
      errorCode = ErrorCode.NET_TIMEOUT;
    } else if (message.includes('dns') || message.includes('enotfound')) {
      errorCode = ErrorCode.NET_DNS_FAILED;
    } else if (message.includes('refused') || message.includes('econnrefused')) {
      errorCode = ErrorCode.NET_CONNECTION_REFUSED;
    } else if (message.includes('ssl') || message.includes('certificate') || message.includes('tls')) {
      errorCode = ErrorCode.NET_SSL_ERROR;
    } else if (message.includes('cors')) {
      errorCode = ErrorCode.NET_CORS_ERROR;
    }

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'NetworkError',
      timestamp: Date.now(),
    });
  }

  /**
   * Handle API errors with HTTP status code analysis
   */
  static async handleAPIError(response: Response, context?: ErrorContext): Promise<DetailedError> {
    let errorCode = ErrorCode.API_SERVER_ERROR;
    let apiErrorDetails = '';

    try {
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        apiErrorDetails = JSON.stringify(errorData, null, 2);

        // Parse error messages for specific codes
        if (errorData.error?.message) {
          const msg = errorData.error.message.toLowerCase();
          if (msg.includes('api key')) {
            if (msg.includes('invalid') || msg.includes('not valid')) {
              errorCode = ErrorCode.API_KEY_INVALID;
            } else if (msg.includes('missing') || msg.includes('required')) {
              errorCode = ErrorCode.API_KEY_MISSING;
            }
          } else if (msg.includes('quota')) {
            errorCode = ErrorCode.API_QUOTA_EXCEEDED;
          } else if (msg.includes('rate limit')) {
            errorCode = ErrorCode.API_RATE_LIMITED;
          } else if (msg.includes('language') && msg.includes('not supported')) {
            errorCode = ErrorCode.API_LANGUAGE_NOT_SUPPORTED;
          }
        }
      } catch {
        apiErrorDetails = responseText;
      }
    } catch {
      apiErrorDetails = 'Unable to read response body';
    }

    // Determine error code from HTTP status if not already set
    if (errorCode === ErrorCode.API_SERVER_ERROR) {
      switch (response.status) {
        case 400:
          errorCode = ErrorCode.API_BAD_REQUEST;
          break;
        case 401:
        case 403:
          errorCode = ErrorCode.API_UNAUTHORIZED;
          break;
        case 429:
          errorCode = ErrorCode.API_RATE_LIMITED;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorCode = ErrorCode.API_SERVER_ERROR;
          break;
      }
    }

    const error = new Error(`API Error ${response.status}: ${response.statusText}`);

    return logger.createDetailedError(errorCode, error, {
      ...context,
      httpStatus: response.status,
      httpStatusText: response.statusText,
      apiErrorDetails,
      requestUrl: response.url,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle storage/IndexedDB errors
   */
  static handleStorageError(error: Error, context?: ErrorContext): DetailedError {
    let errorCode = ErrorCode.STOR_WRITE_FAILED;

    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (message.includes('quota') || name.includes('quota')) {
      errorCode = ErrorCode.STOR_QUOTA_EXCEEDED;
    } else if (message.includes('permission') || name.includes('security')) {
      errorCode = ErrorCode.STOR_PERMISSION_DENIED;
    } else if (message.includes('version')) {
      errorCode = ErrorCode.STOR_DB_VERSION_ERROR;
    } else if (message.includes('blocked')) {
      errorCode = ErrorCode.STOR_DB_BLOCKED;
    } else if (message.includes('not found') || name.includes('notfound')) {
      errorCode = ErrorCode.STOR_DB_NOT_FOUND;
    } else if (message.includes('corrupt')) {
      errorCode = ErrorCode.STOR_CORRUPTED_DATA;
    } else if (message.includes('read')) {
      errorCode = ErrorCode.STOR_READ_FAILED;
    }

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'StorageError',
      storageType: context?.storageType || 'unknown',
      operation: context?.operation || 'unknown',
      timestamp: Date.now(),
    });
  }

  /**
   * Handle cache errors
   */
  static handleCacheError(error: Error, context?: ErrorContext): DetailedError {
    let errorCode = ErrorCode.CACHE_WRITE_FAILED;

    const message = error.message.toLowerCase();

    if (message.includes('initialization') || message.includes('init')) {
      errorCode = ErrorCode.CACHE_INITIALIZATION_FAILED;
    } else if (message.includes('read')) {
      errorCode = ErrorCode.CACHE_READ_FAILED;
    } else if (message.includes('corrupt')) {
      errorCode = ErrorCode.CACHE_CORRUPTED;
    } else if (message.includes('sync')) {
      errorCode = ErrorCode.CACHE_SYNC_FAILED;
    }

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'CacheError',
      cacheType: context?.cacheType || 'unknown',
      timestamp: Date.now(),
    });
  }

  /**
   * Handle parsing errors (JSON, HTML, etc.)
   */
  static handleParsingError(error: Error, dataType: string, context?: ErrorContext): DetailedError {
    let errorCode = ErrorCode.PARSE_JSON_FAILED;

    if (dataType.toLowerCase().includes('html')) {
      errorCode = ErrorCode.PARSE_HTML_FAILED;
    } else if (dataType.toLowerCase().includes('settings')) {
      errorCode = ErrorCode.PARSE_INVALID_SETTINGS;
    } else if (dataType.toLowerCase().includes('response')) {
      errorCode = ErrorCode.PARSE_INVALID_RESPONSE;
    }

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'ParsingError',
      dataType,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(
    field: string,
    value: unknown,
    reason: string,
    context?: ErrorContext
  ): DetailedError {
    let errorCode = ErrorCode.VAL_SETTINGS_SCHEMA;

    if (field.includes('language')) {
      errorCode = ErrorCode.VAL_INVALID_LANGUAGE_CODE;
    } else if (field.includes('text') && !value) {
      errorCode = ErrorCode.VAL_EMPTY_TEXT;
    } else if (field.includes('url')) {
      errorCode = ErrorCode.VAL_INVALID_URL;
    } else if (field.includes('domain')) {
      errorCode = ErrorCode.VAL_INVALID_DOMAIN;
    }

    const error = new Error(`Validation failed for ${field}: ${reason}`);

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'ValidationError',
      field,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      reason,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle DOM manipulation errors
   */
  static handleDOMError(error: Error, context?: ErrorContext): DetailedError {
    let errorCode = ErrorCode.DOM_TRAVERSAL_FAILED;

    const message = error.message.toLowerCase();

    if (message.includes('not found') || message.includes('null')) {
      errorCode = ErrorCode.DOM_NODE_NOT_FOUND;
    } else if (message.includes('readonly') || message.includes('read-only')) {
      errorCode = ErrorCode.DOM_READONLY_NODE;
    } else if (message.includes('security') || message.includes('csp') || message.includes('injection')) {
      errorCode = ErrorCode.DOM_INJECTION_BLOCKED;
    } else if (message.includes('mutation')) {
      errorCode = ErrorCode.DOM_MUTATION_FAILED;
    }

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'DOMError',
      timestamp: Date.now(),
    });
  }

  /**
   * Handle permission errors
   */
  static handlePermissionError(permissionType: string, context?: ErrorContext): DetailedError {
    let errorCode = ErrorCode.PERM_TAB_ACCESS_DENIED;

    if (permissionType.includes('host')) {
      errorCode = ErrorCode.PERM_HOST_ACCESS_DENIED;
    } else if (permissionType.includes('storage')) {
      errorCode = ErrorCode.PERM_STORAGE_ACCESS_DENIED;
    } else if (permissionType.includes('context') || permissionType.includes('menu')) {
      errorCode = ErrorCode.PERM_CONTEXT_MENU_DENIED;
    }

    const error = new Error(`Permission denied: ${permissionType}`);

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'PermissionError',
      permissionType,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle configuration errors
   */
  static handleConfigError(issue: string, context?: ErrorContext): DetailedError {
    let errorCode = ErrorCode.CFG_INVALID_SETTINGS;

    if (issue.toLowerCase().includes('api key')) {
      if (issue.toLowerCase().includes('missing')) {
        errorCode = ErrorCode.CFG_MISSING_API_KEY;
      }
    } else if (issue.toLowerCase().includes('initialization')) {
      errorCode = ErrorCode.CFG_INITIALIZATION_FAILED;
    } else if (issue.toLowerCase().includes('version')) {
      errorCode = ErrorCode.CFG_VERSION_MISMATCH;
    }

    const error = new Error(`Configuration error: ${issue}`);

    return logger.createDetailedError(errorCode, error, {
      ...context,
      errorType: 'ConfigurationError',
      issue,
      timestamp: Date.now(),
    });
  }

  /**
   * Wrap async function with comprehensive error handling
   */
  static async wrapAsync<T>(
    fn: () => Promise<T>,
    errorCategory: ErrorCategory,
    context?: ErrorContext
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        const detailedError = logger.createDetailedErrorFromException(error, errorCategory, context);

        // Rethrow with detailed error attached
        const enhancedError: EnhancedError = new Error(detailedError.userMessage);
        enhancedError.detailedError = detailedError;
        throw enhancedError;
      }
      throw error;
    }
  }

  /**
   * Wrap sync function with comprehensive error handling
   */
  static wrapSync<T>(
    fn: () => T,
    errorCategory: ErrorCategory,
    context?: ErrorContext
  ): T {
    try {
      return fn();
    } catch (error) {
      if (error instanceof Error) {
        const detailedError = logger.createDetailedErrorFromException(error, errorCategory, context);

        // Rethrow with detailed error attached
        const enhancedError: EnhancedError = new Error(detailedError.userMessage);
        enhancedError.detailedError = detailedError;
        throw enhancedError;
      }
      throw error;
    }
  }

  /**
   * Create user-friendly error notification
   */
  static createErrorNotification(error: DetailedError): {
    title: string;
    message: string;
    severity: string;
    actions: string[];
  } {
    return {
      title: `Error: ${error.code}`,
      message: error.userMessage,
      severity: error.severity,
      actions: error.recoveryActions.map(a => a.label),
    };
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: unknown): boolean {
    if (error && typeof error === 'object' && 'detailedError' in error) {
      return (error as EnhancedError).detailedError?.isRecoverable ?? true;
    }
    return true; // Default to recoverable for unknown errors
  }

  /**
   * Get recovery suggestions for an error
   */
  static getRecoverySuggestions(error: unknown): string[] {
    if (error && typeof error === 'object' && 'detailedError' in error) {
      const enhancedError = error as EnhancedError;
      if (enhancedError.detailedError) {
        return enhancedError.detailedError.recoveryActions.map(
          (action: ErrorRecoveryAction) => `${action.label}: ${action.description}`
        );
      }
    }
    return ['Try the operation again', 'Check your settings', 'Contact support if the issue persists'];
  }
}

export default ErrorHandler;
