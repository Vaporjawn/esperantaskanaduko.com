import {
  DetailedError,
  ErrorCode,
  ErrorCategory,
  ErrorSeverity,
  ErrorContext,
  ERROR_TEMPLATES,
} from '@/types/errors';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface ErrorLogEntry {
  error: DetailedError;
  timestamp: string;
  resolved: boolean;
}

class Logger {
  private isDebugMode: boolean;
  private errorHistory: ErrorLogEntry[] = [];
  private maxErrorHistory = 100;

  constructor() {
    this.isDebugMode = import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true';
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.isDebugMode && level === 'debug') {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  /**
   * Create a detailed error from an error code and context
   */
  createDetailedError(
    errorCode: ErrorCode,
    originalError?: Error,
    additionalContext?: Record<string, any>
  ): DetailedError {
    const template = ERROR_TEMPLATES[errorCode] || ERROR_TEMPLATES[ErrorCode.UNKNOWN_ERROR];

    // Get current context
    const context: ErrorContext = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      extensionVersion: chrome.runtime.getManifest().version,
      stackTrace: originalError?.stack || new Error().stack,
      additionalData: additionalContext,
    };

    // Add URL if available
    if (typeof window !== 'undefined') {
      context.url = window.location?.href;
    }

    const detailedError: DetailedError = {
      ...template,
      context,
      originalError,
      originalMessage: originalError?.message,
    };

    // Log to history
    this.addToErrorHistory(detailedError);

    // Log to console with full details
    this.logDetailedError(detailedError);

    return detailedError;
  }

  /**
   * Create detailed error from generic Error object
   */
  createDetailedErrorFromException(
    error: Error,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    additionalContext?: Record<string, any>
  ): DetailedError {
    // Try to identify error code from error message
    const errorCode = this.identifyErrorCode(error);

    if (errorCode !== ErrorCode.UNKNOWN_ERROR) {
      return this.createDetailedError(errorCode, error, additionalContext);
    }

    // Create custom detailed error for unknown exceptions
    const context: ErrorContext = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      extensionVersion: chrome.runtime.getManifest().version,
      stackTrace: error.stack,
      additionalData: {
        ...additionalContext,
        errorName: error.name,
        errorConstructor: error.constructor.name,
      },
    };

    const detailedError: DetailedError = {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || 'Unknown error occurred',
      category,
      severity: ErrorSeverity.MEDIUM,
      userMessage: `An unexpected error occurred: ${error.message || 'Unknown error'}. Please try again.`,
      technicalDetails: `Exception: ${error.name}: ${error.message}\nStack: ${error.stack?.substring(0, 500) || 'No stack trace'}`,
      context,
      recoveryActions: [
        {
          label: 'Retry',
          action: 'retry',
          description: 'Try the operation again',
          autoExecutable: true,
        },
        {
          label: 'Report Bug',
          action: 'contact',
          description: 'Report this error with details',
        },
      ],
      isRecoverable: true,
      originalError: error,
      originalMessage: error.message,
    };

    this.addToErrorHistory(detailedError);
    this.logDetailedError(detailedError);

    return detailedError;
  }

  /**
   * Attempt to identify error code from error message patterns
   */
  private identifyErrorCode(error: Error): ErrorCode {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('fetch failed') || message.includes('failed to fetch')) {
      if (message.includes('timeout')) return ErrorCode.NET_TIMEOUT;
      if (message.includes('dns')) return ErrorCode.NET_DNS_FAILED;
      if (message.includes('refused')) return ErrorCode.NET_CONNECTION_REFUSED;
      if (message.includes('ssl') || message.includes('certificate')) return ErrorCode.NET_SSL_ERROR;
      return ErrorCode.NET_NO_CONNECTION;
    }

    // API errors
    if (message.includes('api key')) {
      if (message.includes('invalid')) return ErrorCode.API_KEY_INVALID;
      if (message.includes('missing') || message.includes('required')) return ErrorCode.API_KEY_MISSING;
    }
    if (message.includes('quota') && message.includes('exceeded')) return ErrorCode.API_QUOTA_EXCEEDED;
    if (message.includes('rate limit')) return ErrorCode.API_RATE_LIMITED;
    if (message.includes('unauthorized') || message.includes('401')) return ErrorCode.API_UNAUTHORIZED;
    if (message.includes('400') || message.includes('bad request')) return ErrorCode.API_BAD_REQUEST;
    if (message.includes('500') || message.includes('server error')) return ErrorCode.API_SERVER_ERROR;

    // Storage errors
    if (message.includes('quota') || message.includes('storage')) {
      if (message.includes('exceeded') || message.includes('full')) return ErrorCode.STOR_QUOTA_EXCEEDED;
      if (message.includes('permission')) return ErrorCode.STOR_PERMISSION_DENIED;
      if (message.includes('corrupt')) return ErrorCode.STOR_CORRUPTED_DATA;
      if (message.includes('blocked')) return ErrorCode.STOR_DB_BLOCKED;
    }

    // Parsing errors
    if (message.includes('json') && (message.includes('parse') || message.includes('syntax'))) {
      return ErrorCode.PARSE_JSON_FAILED;
    }
    if (message.includes('html') && message.includes('parse')) return ErrorCode.PARSE_HTML_FAILED;

    // DOM errors
    if (message.includes('dom') || message.includes('node')) {
      if (message.includes('not found')) return ErrorCode.DOM_NODE_NOT_FOUND;
      if (message.includes('readonly')) return ErrorCode.DOM_READONLY_NODE;
      if (message.includes('injection') || message.includes('csp')) return ErrorCode.DOM_INJECTION_BLOCKED;
    }

    // Permission errors
    if (message.includes('permission') || message.includes('access denied')) {
      if (message.includes('tab')) return ErrorCode.PERM_TAB_ACCESS_DENIED;
      if (message.includes('host')) return ErrorCode.PERM_HOST_ACCESS_DENIED;
      if (message.includes('storage')) return ErrorCode.PERM_STORAGE_ACCESS_DENIED;
    }

    return ErrorCode.UNKNOWN_ERROR;
  }

  /**
   * Log detailed error with formatted output
   */
  private logDetailedError(error: DetailedError): void {
    const divider = '═'.repeat(80);
    const minorDivider = '─'.repeat(80);

    console.group(`%c🚨 ${error.severity} ERROR: ${error.code}`, this.getSeverityStyle(error.severity));

    console.log(`%c${divider}`, 'color: #ff6b6b');
    console.log(`%c📋 ERROR DETAILS`, 'color: #4dabf7; font-weight: bold; font-size: 14px');
    console.log(`%c${minorDivider}`, 'color: #868e96');

    console.log(`%cCode:`, 'font-weight: bold', error.code);
    console.log(`%cCategory:`, 'font-weight: bold', error.category);
    console.log(`%cSeverity:`, 'font-weight: bold', error.severity);
    console.log(`%cRecoverable:`, 'font-weight: bold', error.isRecoverable ? 'Yes ✓' : 'No ✗');

    console.log(`\n%c💬 USER MESSAGE`, 'color: #51cf66; font-weight: bold');
    console.log(`%c${minorDivider}`, 'color: #868e96');
    console.log(error.userMessage);

    console.log(`\n%c🔧 TECHNICAL DETAILS`, 'color: #ffd43b; font-weight: bold');
    console.log(`%c${minorDivider}`, 'color: #868e96');
    console.log(error.technicalDetails);

    if (error.originalMessage) {
      console.log(`\n%c📝 ORIGINAL ERROR MESSAGE`, 'color: #ff8787; font-weight: bold');
      console.log(`%c${minorDivider}`, 'color: #868e96');
      console.log(error.originalMessage);
    }

    console.log(`\n%c🛠️ RECOVERY ACTIONS`, 'color: #74c0fc; font-weight: bold');
    console.log(`%c${minorDivider}`, 'color: #868e96');
    error.recoveryActions.forEach((action, index) => {
      const autoLabel = action.autoExecutable ? ' [AUTO]' : '';
      console.log(`${index + 1}. ${action.label}${autoLabel}: ${action.description}`);
    });

    console.log(`\n%c⏰ CONTEXT`, 'color: #da77f2; font-weight: bold');
    console.log(`%c${minorDivider}`, 'color: #868e96');
    console.log('Timestamp:', error.context.timestamp);
    console.log('Extension Version:', error.context.extensionVersion);
    if (error.context.url) console.log('URL:', error.context.url);
    if (error.context.tabId) console.log('Tab ID:', error.context.tabId);

    if (error.context.additionalData) {
      console.log('\n%c📊 ADDITIONAL DATA', 'color: #95d5b2; font-weight: bold');
      console.log(`%c${minorDivider}`, 'color: #868e96');
      console.log(error.context.additionalData);
    }

    if (error.context.stackTrace) {
      console.log(`\n%c📚 STACK TRACE`, 'color: #868e96; font-weight: bold');
      console.log(`%c${minorDivider}`, 'color: #868e96');
      console.log(error.context.stackTrace);
    }

    if (error.helpUrl) {
      console.log(`\n%c📖 HELP`, 'color: #ffc078; font-weight: bold');
      console.log(`%c${minorDivider}`, 'color: #868e96');
      console.log(`Documentation: ${error.helpUrl}`);
    }

    if (error.relatedErrors && error.relatedErrors.length > 0) {
      console.log(`\n%c🔗 RELATED ERRORS`, 'color: #ffa8a8; font-weight: bold');
      console.log(`%c${minorDivider}`, 'color: #868e96');
      console.log(error.relatedErrors.join(', '));
    }

    console.log(`%c${divider}`, 'color: #ff6b6b');
    console.groupEnd();
  }

  /**
   * Get console style based on severity
   */
  private getSeverityStyle(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'color: white; background-color: #c92a2a; padding: 4px 8px; font-weight: bold; font-size: 14px';
      case ErrorSeverity.HIGH:
        return 'color: white; background-color: #e67700; padding: 4px 8px; font-weight: bold; font-size: 14px';
      case ErrorSeverity.MEDIUM:
        return 'color: white; background-color: #fab005; padding: 4px 8px; font-weight: bold; font-size: 14px';
      case ErrorSeverity.LOW:
        return 'color: white; background-color: #74b816; padding: 4px 8px; font-weight: bold; font-size: 14px';
      case ErrorSeverity.INFO:
        return 'color: white; background-color: #1c7ed6; padding: 4px 8px; font-weight: bold; font-size: 14px';
      default:
        return 'color: white; background-color: #495057; padding: 4px 8px; font-weight: bold; font-size: 14px';
    }
  }

  /**
   * Add error to history
   */
  private addToErrorHistory(error: DetailedError): void {
    this.errorHistory.unshift({
      error,
      timestamp: error.context.timestamp,
      resolved: false,
    });

    // Keep only recent errors
    if (this.errorHistory.length > this.maxErrorHistory) {
      this.errorHistory = this.errorHistory.slice(0, this.maxErrorHistory);
    }
  }

  /**
   * Get error history
   */
  getErrorHistory(): ErrorLogEntry[] {
    return [...this.errorHistory];
  }

  /**
   * Mark error as resolved
   */
  markErrorResolved(errorCode: string, timestamp: string): void {
    const entry = this.errorHistory.find(
      e => e.error.code === errorCode && e.timestamp === timestamp
    );
    if (entry) {
      entry.resolved = true;
    }
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorHistory.length,
      resolved: this.errorHistory.filter(e => e.resolved).length,
      unresolved: this.errorHistory.filter(e => !e.resolved).length,
      byCategory: {} as Record<ErrorCategory, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      mostCommon: [] as { code: string; count: number }[],
    };

    // Count by category
    this.errorHistory.forEach(entry => {
      const category = entry.error.category;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

      const severity = entry.error.severity;
      stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;
    });

    // Find most common errors
    const errorCounts: Record<string, number> = {};
    this.errorHistory.forEach(entry => {
      errorCounts[entry.error.code] = (errorCounts[entry.error.code] || 0) + 1;
    });

    stats.mostCommon = Object.entries(errorCounts)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return stats;
  }

  /**
   * Export error history for debugging
   */
  exportErrorHistory(): string {
    return JSON.stringify({
      exported: new Date().toISOString(),
      extensionVersion: chrome.runtime.getManifest().version,
      errorHistory: this.errorHistory,
      stats: this.getErrorStats(),
    }, null, 2);
  }
}

export const logger = new Logger();
