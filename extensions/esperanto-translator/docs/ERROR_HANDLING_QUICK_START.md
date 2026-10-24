# Error Handling Quick Start Integration Guide

## Overview
This guide provides step-by-step instructions for integrating the comprehensive error handling system into your extension services and UI.

---

## Step 1: Add ErrorNotificationProvider to App

**File**: `src/popup/App.tsx`

```tsx
import { ErrorNotificationProvider } from '@/popup/contexts/ErrorNotificationContext';

function App() {
  return (
    <ErrorNotificationProvider>
      <ThemeProvider theme={theme}>
        <SettingsProvider>
          {/* Your existing app components */}
        </SettingsProvider>
      </ThemeProvider>
    </ErrorNotificationProvider>
  );
}

export default App;
```

**Why**: Enables global error notifications throughout the popup UI.

---

## Step 2: Integrate Error Handling in TranslationService

**File**: `src/services/translationService.ts` (or `translationServiceV2.ts`)

### Import Required Modules
```typescript
import { ErrorHandler } from './errorHandler';
import { ErrorCategory } from '@/types/errors';
import { logger } from '@/utils/logger';
```

### Wrap API Calls with Error Handling

**Before**:
```typescript
async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ text, source: sourceLang, target: targetLang }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
}
```

**After**:
```typescript
async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
  return await ErrorHandler.wrapAsync(
    async () => {
      // Validate input
      if (!text || text.trim().length === 0) {
        throw ErrorHandler.handleValidationError(
          'text',
          text,
          'Text cannot be empty',
          { operation: 'translate', sourceLang, targetLang }
        );
      }

      // Make API request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, source: sourceLang, target: targetLang }),
      });

      // Handle API errors
      if (!response.ok) {
        throw await ErrorHandler.handleAPIError(response, {
          operation: 'translate',
          textLength: text.length,
          sourceLang,
          targetLang,
          apiEndpoint: apiUrl,
        });
      }

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw ErrorHandler.handleParsingError(
          parseError,
          'json',
          {
            operation: 'translate',
            responseStatus: response.status,
            contentType: response.headers.get('content-type'),
          }
        );
      }

      // Validate response structure
      if (!data || !data.translation) {
        throw ErrorHandler.handleParsingError(
          new Error('Missing translation field in response'),
          'response',
          { responseData: JSON.stringify(data).substring(0, 200) }
        );
      }

      return data.translation;
    },
    ErrorCategory.API,
    {
      method: 'translate',
      provider: this.provider.name,
      sourceLang,
      targetLang,
      textPreview: text.substring(0, 50),
    }
  );
}
```

### Add Cache Error Handling

```typescript
private async getCachedTranslation(key: string): Promise<string | null> {
  try {
    const cached = await this.cache.get(key);
    return cached;
  } catch (error) {
    // Log cache read error but don't fail translation
    const detailedError = ErrorHandler.handleCacheError(error, {
      operation: 'read',
      cacheKey: key,
    });
    logger.error(detailedError.userMessage, detailedError.context);
    return null; // Fall through to API request
  }
}

private async setCachedTranslation(key: string, value: string): Promise<void> {
  try {
    await this.cache.set(key, value);
  } catch (error) {
    // Log cache write error but don't fail translation
    const detailedError = ErrorHandler.handleCacheError(error, {
      operation: 'write',
      cacheKey: key,
      valueLength: value.length,
    });
    logger.error(detailedError.userMessage, detailedError.context);
    // Translation still succeeded even if caching failed
  }
}
```

### Add Storage Error Handling

```typescript
async loadSettings(): Promise<Settings> {
  try {
    const result = await chrome.storage.sync.get('settings');
    return result.settings || this.getDefaultSettings();
  } catch (error) {
    const detailedError = ErrorHandler.handleStorageError(error, {
      operation: 'read',
      storageType: 'sync',
      key: 'settings',
    });
    logger.error(detailedError.userMessage, detailedError.context);
    throw detailedError;
  }
}

async saveSettings(settings: Settings): Promise<void> {
  try {
    await chrome.storage.sync.set({ settings });
  } catch (error) {
    const detailedError = ErrorHandler.handleStorageError(error, {
      operation: 'write',
      storageType: 'sync',
      key: 'settings',
      dataSize: JSON.stringify(settings).length,
    });
    logger.error(detailedError.userMessage, detailedError.context);
    throw detailedError;
  }
}
```

---

## Step 3: Display Errors in UI Components

**File**: `src/popup/components/TranslateButton.tsx` (example)

### Import Error Notification Hook
```typescript
import { useErrorNotification } from '@/popup/hooks/useErrorNotification';
```

### Use Hook in Component
```typescript
function TranslateButton() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { showError, showSimpleError } = useErrorNotification();

  const handleTranslate = async () => {
    if (!text.trim()) {
      showSimpleError('Please enter text to translate', 'warning');
      return;
    }

    setLoading(true);
    try {
      const translated = await translationService.translate(
        text,
        'en',
        'eo'
      );
      setResult(translated);
      showSimpleError('Translation successful!', 'success');
    } catch (error: any) {
      // Check if error has detailedError property
      if (error.detailedError) {
        showError(error.detailedError, {
          type: error.detailedError.severity === 'CRITICAL' ? 'detailed' : 'toast',
          duration: 8000,
          onRetry: handleTranslate, // Allow user to retry
          onConfigure: () => {
            // Navigate to settings
            window.location.hash = '#settings';
          },
        });
      } else {
        // Fallback for unknown errors
        showSimpleError(
          error.message || 'Translation failed',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
        multiline
        rows={4}
      />
      <Button
        onClick={handleTranslate}
        disabled={loading}
        variant="contained"
      >
        {loading ? 'Translating...' : 'Translate'}
      </Button>
      {result && (
        <Typography variant="body1">{result}</Typography>
      )}
    </div>
  );
}
```

---

## Step 4: Add Error Handling to Background Service Worker

**File**: `src/background/service-worker.ts`

### Import Error Handler
```typescript
import { ErrorHandler } from '@/services/errorHandler';
import { ErrorCategory } from '@/types/errors';
import { logger } from '@/utils/logger';
```

### Wrap Message Handlers
```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Wrap async handler with ErrorHandler
  (async () => {
    try {
      switch (message.type) {
        case 'TRANSLATE': {
          const result = await ErrorHandler.wrapAsync(
            async () => {
              return await translationService.translate(
                message.text,
                message.sourceLang,
                message.targetLang
              );
            },
            ErrorCategory.API,
            {
              messageType: message.type,
              tabId: sender.tab?.id,
              url: sender.tab?.url,
            }
          );
          sendResponse({ success: true, result });
          break;
        }

        case 'CLEAR_CACHE': {
          await ErrorHandler.wrapAsync(
            async () => {
              await cacheService.clear();
            },
            ErrorCategory.CACHE,
            { messageType: message.type }
          );
          sendResponse({ success: true });
          break;
        }

        default:
          sendResponse({
            success: false,
            error: 'Unknown message type'
          });
      }
    } catch (error: any) {
      // Log error with full context
      if (error.detailedError) {
        logger.error(error.detailedError.userMessage, error.detailedError.context);
        sendResponse({
          success: false,
          error: error.detailedError.userMessage,
          detailedError: error.detailedError,
        });
      } else {
        logger.error('Unknown error in message handler', { error: error.message });
        sendResponse({
          success: false,
          error: error.message || 'Unknown error occurred',
        });
      }
    }
  })();

  return true; // Keep message channel open for async response
});
```

---

## Step 5: Add DOM Error Handling to Content Scripts

**File**: `src/content/content-script.ts`

### Import Error Handler
```typescript
import { ErrorHandler } from '@/services/errorHandler';
import { logger } from '@/utils/logger';
```

### Wrap DOM Operations
```typescript
function translatePageElement(element: HTMLElement, translation: string) {
  try {
    // Validate element exists
    if (!element) {
      throw ErrorHandler.handleDOMError(
        new Error('Element not found'),
        {
          operation: 'translateElement',
          selector: element?.id || element?.className || 'unknown',
        }
      );
    }

    // Check if element is modifiable
    if (element.hasAttribute('contenteditable') &&
        element.getAttribute('contenteditable') === 'false') {
      throw ErrorHandler.handleDOMError(
        new Error('Cannot modify read-only element'),
        {
          operation: 'translateElement',
          elementType: element.tagName,
          isReadOnly: true,
        }
      );
    }

    // Apply translation
    element.textContent = translation;
    element.setAttribute('data-translated', 'true');

  } catch (error: any) {
    if (error.detailedError) {
      logger.error(error.detailedError.userMessage, error.detailedError.context);
    }
    // Don't throw - continue with other elements
  }
}

function findTranslatableElements(): HTMLElement[] {
  try {
    const elements = document.querySelectorAll<HTMLElement>(
      'p, h1, h2, h3, h4, h5, h6, span, div, li, td, th'
    );
    return Array.from(elements).filter(el => {
      return el.textContent && el.textContent.trim().length > 0;
    });
  } catch (error) {
    const detailedError = ErrorHandler.handleDOMError(error, {
      operation: 'findElements',
      url: window.location.href,
    });
    logger.error(detailedError.userMessage, detailedError.context);
    return []; // Return empty array on error
  }
}
```

---

## Step 6: Add Permission Error Handling

**File**: `src/background/messageHandler.ts` or similar

```typescript
async function ensureTabPermission(tabId: number): Promise<void> {
  try {
    await chrome.tabs.get(tabId);
  } catch (error) {
    throw ErrorHandler.handlePermissionError(
      'activeTab',
      {
        operation: 'getTab',
        tabId,
        error: error.message,
      }
    );
  }
}

async function injectContentScript(tabId: number): Promise<void> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-script.js'],
    });
  } catch (error) {
    if (error.message.includes('Cannot access')) {
      throw ErrorHandler.handlePermissionError(
        'host',
        {
          operation: 'injectScript',
          tabId,
          error: error.message,
        }
      );
    }
    throw error;
  }
}
```

---

## Step 7: Test Error Scenarios

### Test Network Errors
1. Disconnect from internet
2. Try to translate text
3. Verify error message shows: "No network connection available"
4. Verify retry button appears

### Test API Errors
1. Enter invalid API key in settings
2. Try to translate text
3. Verify error message shows: "Invalid or malformed API key"
4. Verify configure button opens settings

### Test Storage Errors
1. Fill storage quota (use chrome://extensions to see quota)
2. Try to save settings
3. Verify error message shows: "Storage quota exceeded"
4. Verify clear cache button appears

### Test Validation Errors
1. Try to translate empty text
2. Verify error message shows: "Text cannot be empty"
3. Try invalid language code
4. Verify error message shows: "Invalid language code"

### Test Recovery Actions
1. Trigger any error with recovery actions
2. Click "Retry" button - verify operation retries
3. Click "Configure" button - verify settings page opens
4. Click "Clear Cache" button - verify cache clears
5. Click copy icon - verify error details copied to clipboard

---

## Step 8: Monitor Errors in Production

### View Error History
```typescript
import { logger } from '@/utils/logger';

// Get error statistics
const stats = logger.getErrorStats();
console.log('Total errors:', stats.total);
console.log('Unresolved errors:', stats.unresolved);
console.log('Errors by category:', stats.byCategory);
console.log('Most common errors:', stats.mostCommon);

// Export error history for debugging
const history = logger.exportErrorHistory();
console.log(JSON.stringify(history, null, 2));

// Get errors from last hour
const recentErrors = logger.getErrorHistory(60); // Last 60 minutes
```

### Mark Errors as Resolved
```typescript
// After fixing an issue
logger.markErrorResolved(errorId, 'User cleared cache and retried');
```

---

## Common Patterns

### Pattern 1: Recoverable vs Non-Recoverable Errors

```typescript
try {
  await riskyOperation();
} catch (error: any) {
  if (error.detailedError) {
    if (ErrorHandler.isRecoverable(error)) {
      // Show toast with retry option
      showError(error.detailedError, {
        type: 'toast',
        duration: 6000,
        onRetry: riskyOperation,
      });
    } else {
      // Show detailed error modal
      showError(error.detailedError, {
        type: 'detailed',
        onConfigure: () => openSettings(),
      });
    }
  }
}
```

### Pattern 2: Silent Error Logging

```typescript
// For errors that shouldn't interrupt user flow
try {
  await backgroundSync();
} catch (error) {
  const detailedError = ErrorHandler.handleCacheError(error, {
    operation: 'backgroundSync',
  });
  logger.error(detailedError.userMessage, detailedError.context);
  // Don't show notification - just log it
}
```

### Pattern 3: Graceful Degradation

```typescript
async function translateWithFallback(text: string): Promise<string> {
  // Try primary provider
  try {
    return await primaryProvider.translate(text);
  } catch (error) {
    logger.error('Primary provider failed, trying fallback', { error });

    // Try fallback provider
    try {
      return await fallbackProvider.translate(text);
    } catch (fallbackError) {
      // Both failed - throw detailed error
      throw ErrorHandler.handleAPIError(fallbackError, {
        operation: 'translate',
        attemptedProviders: ['primary', 'fallback'],
      });
    }
  }
}
```

---

## Checklist

- [ ] Add ErrorNotificationProvider to App.tsx
- [ ] Integrate error handling in translationService.ts
- [ ] Add error handling to background service-worker.ts
- [ ] Add DOM error handling to content scripts
- [ ] Update all UI components to use useErrorNotification hook
- [ ] Test network error scenarios
- [ ] Test API error scenarios
- [ ] Test storage error scenarios
- [ ] Test validation error scenarios
- [ ] Test all recovery actions (retry, configure, clear cache)
- [ ] Verify error copying to clipboard works
- [ ] Test toast notifications auto-dismiss
- [ ] Test detailed error displays
- [ ] Set up error monitoring in production

---

## Quick Reference

### Show Error Toast
```typescript
const { showError } = useErrorNotification();
showError(detailedError, { type: 'toast', duration: 6000 });
```

### Show Detailed Error
```typescript
showError(detailedError, { type: 'detailed', onRetry: handleRetry });
```

### Show Simple Message
```typescript
const { showSimpleError } = useErrorNotification();
showSimpleError('Operation successful!', 'success');
```

### Wrap Async Function
```typescript
const result = await ErrorHandler.wrapAsync(
  async () => await operation(),
  ErrorCategory.API,
  { context: 'data' }
);
```

### Create Error from Exception
```typescript
const detailedError = ErrorHandler.handleNetworkError(error, {
  operation: 'fetch',
  url: apiUrl,
});
```

---

## Need Help?

- **System Documentation**: `docs/ERROR_HANDLING_SYSTEM.md`
- **Error Codes Reference**: `docs/ERROR_CODES_REFERENCE.md`
- **Implementation Summary**: `docs/ERROR_HANDLING_IMPLEMENTATION_SUMMARY.md`

**You now have comprehensive error handling that ensures you always know exactly what's wrong!** ✅
