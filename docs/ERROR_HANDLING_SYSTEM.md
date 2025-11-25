# Comprehensive Error Handling System

## Overview

This document provides a complete guide to the error handling system implemented in the Esperanto Translator extension. The system provides **super in-depth error messages** that ensure you always know exactly what's wrong, how to fix it, and what caused the issue.

## Architecture

### 1. Error Type System (`src/types/errors.ts`)

Comprehensive error definitions with **60+ specific error codes** covering all failure scenarios:

- **ErrorCategory**: Classifies errors into domains (NETWORK, API, STORAGE, CACHE, DOM, PERMISSION, CONFIGURATION, etc.)
- **ErrorSeverity**: Rates impact (CRITICAL, HIGH, MEDIUM, LOW, INFO)
- **ErrorCode**: Specific codes for precise error identification (e.g., `API_KEY_INVALID`, `NET_TIMEOUT`, `STOR_QUOTA_EXCEEDED`)
- **DetailedError**: Complete error information including user messages, technical details, recovery actions, and context
- **ERROR_TEMPLATES**: Pre-configured detailed information for every error code

### 2. Logger System (`src/utils/logger.ts`)

Enhanced logging with comprehensive error tracking:

**Key Features**:
- **createDetailedError()**: Creates DetailedError from error codes with all metadata
- **createDetailedErrorFromException()**: Wraps generic Error objects with detailed context
- **identifyErrorCode()**: Intelligent pattern matching to identify 30+ error types automatically
- **logDetailedError()**: Beautifully formatted console output with colors, dividers, and sections
- **Error History**: Tracks all errors with resolution status, statistics, and export capabilities
- **Error Analytics**: getErrorStats() provides counts by category, severity, and most common errors

**Usage Example**:
```typescript
import { logger } from '@/utils/logger';
import { ErrorCode } from '@/types/errors';

// Create error from code
const error = logger.createDetailedError(
  ErrorCode.API_KEY_INVALID,
  originalError,
  { apiEndpoint: '/translate', requestId: '12345' }
);

// Or let logger identify the error
const error = logger.createDetailedErrorFromException(
  new Error('Invalid API key provided'),
  ErrorCategory.API,
  { context: 'translation request' }
);
```

### 3. Error Handler Service (`src/services/errorHandler.ts`)

Specialized error handling for different error types:

**Methods**:
- `handleNetworkError()`: Analyzes fetch/network failures (timeout, DNS, SSL, CORS, etc.)
- `handleAPIError()`: Parses HTTP responses for API-specific errors (invalid key, quota, rate limits)
- `handleStorageError()`: Detects IndexedDB/storage issues (quota exceeded, permission denied, corruption)
- `handleCacheError()`: Identifies cache-related failures (initialization, read, write, sync errors)
- `handleParsingError()`: Handles JSON/HTML/response parsing failures
- `handleValidationError()`: Creates errors for validation failures with field/value/reason
- `handleDOMError()`: Identifies DOM manipulation issues (node not found, read-only, injection blocked)
- `handlePermissionError()`: Creates permission-related errors (tab access, host access, storage)
- `handleConfigError()`: Configuration and initialization errors
- `wrapAsync()` / `wrapSync()`: Wrapper functions for automatic error handling
- `isRecoverable()` / `getRecoverySuggestions()`: Error recovery analysis

**Usage Example**:
```typescript
import { ErrorHandler } from '@/services/errorHandler';

try {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    const error = await ErrorHandler.handleAPIError(response, {
      operation: 'translate',
      textLength: text.length,
    });
    throw error;
  }
} catch (error) {
  if (error instanceof Error) {
    const detailedError = ErrorHandler.handleNetworkError(error, {
      endpoint: apiUrl,
      method: 'POST',
    });
    logger.error(detailedError.userMessage, detailedError.context);
  }
}
```

### 4. Error Display Component (`src/popup/components/ErrorDisplay.tsx`)

Beautiful UI for displaying errors with recovery actions:

**Features**:
- User-friendly error messages with severity indicators
- Error code and category display
- Recovery action buttons with descriptions
- Technical details in expandable section
- Copy error details to clipboard
- Stack trace and context information
- Help link integration

**Usage Example**:
```tsx
import { ErrorDisplay } from '@/popup/components/ErrorDisplay';

<ErrorDisplay
  error={detailedError}
  onClose={() => handleDismiss()}
  onRetry={() => retryOperation()}
  onConfigure={() => openSettings()}
  showTechnicalDetails={true}
/>
```

### 5. Error Notification System (`src/popup/contexts/ErrorNotificationContext.tsx`)

Global error notification with toast and detailed displays:

**Features**:
- Toast notifications for quick errors
- Detailed error displays for critical issues
- Auto-dismiss with configurable duration
- Recovery action integration
- Multiple notification stacking
- Simple error notifications for basic messages

**Usage Example**:
```typescript
import { useErrorNotification } from '@/popup/hooks/useErrorNotification';

const { showError, showSimpleError, dismissError, dismissAll } = useErrorNotification();

// Show detailed error
showError(detailedError, {
  type: 'detailed',
  onRetry: () => retryTranslation(),
  onConfigure: () => openSettings(),
});

// Show simple toast
showSimpleError('Translation completed successfully', 'success');
```

## Error Codes Reference

### Network Errors (NET_*)
- `NET_NO_CONNECTION`: No network connection available
- `NET_TIMEOUT`: Request timed out
- `NET_DNS_FAILED`: DNS resolution failed
- `NET_CONNECTION_REFUSED`: Connection refused by server
- `NET_SSL_ERROR`: SSL/TLS certificate error
- `NET_CORS_ERROR`: CORS policy violation

### API Errors (API_*)
- `API_KEY_INVALID`: Invalid or malformed API key
- `API_KEY_MISSING`: API key not configured
- `API_QUOTA_EXCEEDED`: Translation quota exceeded
- `API_RATE_LIMITED`: Too many requests
- `API_UNAUTHORIZED`: Authentication failed
- `API_BAD_REQUEST`: Invalid request format
- `API_SERVER_ERROR`: API server error
- `API_LANGUAGE_NOT_SUPPORTED`: Language not supported

### Storage Errors (STOR_*)
- `STOR_QUOTA_EXCEEDED`: Storage quota exceeded
- `STOR_WRITE_FAILED`: Failed to write data
- `STOR_READ_FAILED`: Failed to read data
- `STOR_PERMISSION_DENIED`: Storage access denied
- `STOR_DB_VERSION_ERROR`: Database version mismatch
- `STOR_DB_BLOCKED`: Database blocked by another tab
- `STOR_CORRUPTED_DATA`: Data corruption detected

### Cache Errors (CACHE_*)
- `CACHE_INITIALIZATION_FAILED`: Cache system failed to initialize
- `CACHE_WRITE_FAILED`: Failed to write to cache
- `CACHE_READ_FAILED`: Failed to read from cache
- `CACHE_CORRUPTED`: Cache data corrupted
- `CACHE_SYNC_FAILED`: Cache synchronization failed

### DOM Errors (DOM_*)
- `DOM_NODE_NOT_FOUND`: DOM node not found
- `DOM_INJECTION_BLOCKED`: Content injection blocked by CSP
- `DOM_READONLY_NODE`: Cannot modify read-only node
- `DOM_MUTATION_FAILED`: DOM mutation failed
- `DOM_TRAVERSAL_FAILED`: DOM traversal error

### Permission Errors (PERM_*)
- `PERM_TAB_ACCESS_DENIED`: Tab access denied
- `PERM_HOST_ACCESS_DENIED`: Host permission denied
- `PERM_STORAGE_ACCESS_DENIED`: Storage permission denied
- `PERM_CONTEXT_MENU_DENIED`: Context menu permission denied

### Configuration Errors (CFG_*)
- `CFG_MISSING_API_KEY`: API key not configured
- `CFG_INVALID_SETTINGS`: Invalid settings format
- `CFG_INITIALIZATION_FAILED`: Extension initialization failed
- `CFG_VERSION_MISMATCH`: Configuration version mismatch

### Validation Errors (VAL_*)
- `VAL_EMPTY_TEXT`: Text cannot be empty
- `VAL_INVALID_LANGUAGE_CODE`: Invalid language code
- `VAL_INVALID_URL`: Invalid URL format
- `VAL_INVALID_DOMAIN`: Invalid domain format
- `VAL_SETTINGS_SCHEMA`: Settings validation failed

### Parsing Errors (PARSE_*)
- `PARSE_JSON_FAILED`: JSON parsing failed
- `PARSE_HTML_FAILED`: HTML parsing failed
- `PARSE_INVALID_RESPONSE`: Invalid API response
- `PARSE_INVALID_SETTINGS`: Invalid settings format

## Error Context

Every error includes rich context for debugging:

```typescript
interface ErrorContext {
  timestamp: string;           // When the error occurred
  userAgent?: string;          // Browser information
  extensionVersion?: string;   // Extension version
  url?: string;                // Page URL where error occurred
  tabId?: number;              // Chrome tab ID
  settings?: Record<string, any>; // Current settings
  stackTrace?: string;         // JavaScript stack trace
  additionalData?: Record<string, any>; // Custom context data
}
```

## Recovery Actions

Errors include actionable recovery steps:

```typescript
interface ErrorRecoveryAction {
  label: string;                  // Button label (e.g., "Retry")
  action: 'retry' | 'reload' | 'configure' | 'contact' | 'ignore' | 'clearCache';
  description: string;            // What the action does
  autoExecutable?: boolean;       // Can be automatically executed
}
```

## Integration Guide

### Step 1: Wrap Service Methods with Error Handling

```typescript
import { ErrorHandler } from '@/services/errorHandler';
import { ErrorCategory } from '@/types/errors';

class TranslationService {
  async translate(text: string): Promise<string> {
    return await ErrorHandler.wrapAsync(
      async () => {
        // Your translation logic
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
          throw await ErrorHandler.handleAPIError(response, {
            operation: 'translate',
            textLength: text.length,
          });
        }
        return await response.json();
      },
      ErrorCategory.API,
      { method: 'translate', text: text.substring(0, 50) }
    );
  }
}
```

### Step 2: Display Errors in UI

```tsx
import { useErrorNotification } from '@/popup/hooks/useErrorNotification';

function TranslationButton() {
  const { showError } = useErrorNotification();

  const handleTranslate = async () => {
    try {
      await translationService.translate(text);
    } catch (error) {
      if (error?.detailedError) {
        showError(error.detailedError, {
          type: 'toast',
          duration: 6000,
          onRetry: handleTranslate,
        });
      }
    }
  };
}
```

### Step 3: Add Error Notification Provider

```tsx
import { ErrorNotificationProvider } from '@/popup/contexts/ErrorNotificationContext';

function App() {
  return (
    <ErrorNotificationProvider>
      {/* Your app components */}
    </ErrorNotificationProvider>
  );
}
```

## Best Practices

1. **Always Provide Context**: Include operation details, parameters, and state in error context
2. **Use Specific Error Codes**: Choose the most specific error code for better debugging
3. **Include Recovery Actions**: Provide actionable steps for users to resolve issues
4. **Log All Errors**: Use logger.error() or logger.createDetailedError() for tracking
5. **Test Error Scenarios**: Verify error messages are helpful and recovery actions work
6. **Monitor Error History**: Use logger.getErrorStats() to identify common issues
7. **Export for Debugging**: Use logger.exportErrorHistory() when troubleshooting

## Error History & Analytics

Track and analyze errors over time:

```typescript
// Get error statistics
const stats = logger.getErrorStats();
console.log(`Total errors: ${stats.total}`);
console.log(`Unresolved: ${stats.unresolved}`);
console.log(`By category:`, stats.byCategory);
console.log(`Most common:`, stats.mostCommon);

// Export for debugging
const history = logger.exportErrorHistory();
console.log(JSON.stringify(history, null, 2));

// Mark errors as resolved
logger.markErrorResolved(errorId, 'User cleared cache and retried');
```

## Troubleshooting

### Issue: Errors not displaying in UI
**Solution**: Verify ErrorNotificationProvider wraps your app components

### Issue: Generic error messages
**Solution**: Use specific error codes instead of ErrorCode.UNKNOWN

### Issue: Missing context information
**Solution**: Pass additionalData to error creation methods

### Issue: Recovery actions not working
**Solution**: Verify onRetry/onConfigure callbacks are passed to showError()

## Future Enhancements

- [ ] Automatic error reporting to analytics service
- [ ] Error trend analysis and alerting
- [ ] Automatic recovery for common errors
- [ ] Error localization for multilingual support
- [ ] Integration with crash reporting services
- [ ] Machine learning for error pattern detection

## Summary

This comprehensive error handling system ensures you **always know exactly what's wrong**:

✅ **60+ specific error codes** covering all failure scenarios
✅ **Rich context** with timestamps, stack traces, and environment details
✅ **User-friendly messages** explaining what happened in plain language
✅ **Technical details** for debugging with exact error analysis
✅ **Recovery actions** with step-by-step guidance for resolution
✅ **Beautiful UI** for displaying errors with severity indicators
✅ **Error tracking** with history, statistics, and analytics
✅ **Automatic detection** of error types from exception messages
✅ **Export capabilities** for comprehensive debugging
✅ **Integration ready** with wrapper functions and context providers
