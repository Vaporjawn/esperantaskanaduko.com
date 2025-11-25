# TranslationService Error Handling - Testing Guide

## Quick Test Scenarios

This guide helps you systematically test all error handling paths in translationService.ts to verify that errors are properly caught, logged, and displayed with rich context.

## Prerequisites

1. **Build the extension:**
   ```bash
   npm run build
   ```

2. **Load in Chrome:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

3. **Open Chrome DevTools:**
   - Right-click extension popup → Inspect
   - Go to Console tab to see logger output
   - Go to Application → IndexedDB to inspect offline cache
   - Go to Application → Storage → chrome.storage to see settings

## Test Scenarios

### 1. Validation Errors (HIGH PRIORITY)

#### Test 1.1: Empty Text Translation
**Steps:**
1. Open extension popup
2. Leave text field empty
3. Click "Translate"

**Expected Result:**
- ❌ Error displayed: `VAL_EMPTY_TEXT`
- Message: "Text cannot be empty"
- Severity: MEDIUM
- Context shows: `operation: 'translate'`, `field: 'text'`
- Recovery action: "Enter text to translate"
- Console shows DetailedError with full context

**Validation:**
```javascript
// Check console for:
{
  errorCode: 'VAL_EMPTY_TEXT',
  severity: 'MEDIUM',
  category: 'VALIDATION',
  context: {
    operation: 'translate',
    field: 'text',
    value: '',
    reason: 'Text cannot be empty'
  }
}
```

#### Test 1.2: Missing Target Language
**Steps:**
1. Open extension popup
2. Enter text: "Hello world"
3. Clear target language selector (if possible via dev tools)
4. Click "Translate"

**Expected Result:**
- ❌ Error: `VAL_MISSING_REQUIRED_FIELD`
- Message: "Target language is required"
- Context shows: `field: 'targetLang'`

#### Test 1.3: Empty Batch Array
**Steps:**
1. Open Chrome DevTools console
2. Get background page service worker context
3. Run:
   ```javascript
   // Access translationService and call batchTranslate
   translationService.batchTranslate([], 'es')
   ```

**Expected Result:**
- ❌ Error: `VAL_EMPTY_TEXT`
- Message indicates empty array

---

### 2. Network Errors (CRITICAL)

#### Test 2.1: No Internet Connection
**Steps:**
1. Disconnect from internet (turn off Wi-Fi/unplug ethernet)
2. Enter text: "Hello world"
3. Select target language: Spanish
4. Click "Translate"

**Expected Result:**
- ❌ Error: `NET_NO_CONNECTION` or `NET_TIMEOUT`
- Message: "Network request failed" or "Network request timed out"
- Severity: HIGH
- Context shows:
  - `operation: 'translate'`
  - `url: 'https://translation.googleapis.com/...'`
  - `method: 'POST'`
  - `text: 'Hello world'` (truncated if longer)
  - `targetLang: 'es'`
- Recovery actions: "Retry", "Check Network", "Help"
- Console shows full error with stack trace

**Validation:**
```javascript
// Console should show:
{
  errorCode: 'NET_NO_CONNECTION',
  severity: 'HIGH',
  category: 'NETWORK',
  isRecoverable: true,
  context: {
    operation: 'translate',
    url: 'https://translation.googleapis.com/language/translate/v2',
    method: 'POST',
    text: 'Hello world',
    targetLang: 'es'
  },
  recoveryActions: [
    { type: 'retry', description: 'Try again' },
    { type: 'help', description: 'View troubleshooting' }
  ]
}
```

#### Test 2.2: Request Timeout
**Steps:**
1. Use Chrome DevTools Network throttling
2. Set to "Slow 3G" or "Offline" briefly during request
3. Enter text and translate

**Expected Result:**
- ❌ Error: `NET_TIMEOUT`
- Timeout detection in error context

---

### 3. API Errors (CRITICAL)

#### Test 3.1: Invalid API Key
**Steps:**
1. Open extension popup
2. Go to Settings
3. Set API key to: `invalid_key_12345`
4. Save settings
5. Try translating: "Hello world" → Spanish

**Expected Result:**
- ❌ Error: `API_KEY_INVALID`
- Message: "The provided API key is invalid or has been revoked"
- Severity: HIGH
- Status code: 403 (Forbidden)
- Context shows:
  - `operation: 'api_request'`
  - `endpoint: '/language/translate/v2'`
  - `statusCode: 403`
  - `statusText: 'Forbidden'`
  - `apiKey: '****2345'` (masked, last 4 chars only)
  - `text: 'Hello world'`
  - `targetLang: 'es'`
- Recovery actions: "Configure API Key", "Verify API Key", "Help"

**Validation:**
```javascript
// Console should show:
{
  errorCode: 'API_KEY_INVALID',
  severity: 'HIGH',
  category: 'API',
  context: {
    statusCode: 403,
    apiKey: '****2345',
    endpoint: '/language/translate/v2'
  },
  recoveryActions: [
    { type: 'configure', description: 'Update API key' }
  ]
}
```

#### Test 3.2: Missing API Key
**Steps:**
1. Open Settings
2. Clear API key (set to empty string)
3. Save settings
4. Try translating

**Expected Result:**
- ❌ Error: `CONF_MISSING_API_KEY`
- Message: "Translation API key is not configured"
- Severity: HIGH
- Error thrown before network request
- Recovery action: "Configure" opens settings

#### Test 3.3: Rate Limit (If Possible)
**Steps:**
1. Make rapid translation requests (10+ in quick succession)
2. Continue until rate limited

**Expected Result:**
- ❌ Error: `API_RATE_LIMITED`
- Status code: 429
- Message about rate limiting
- Recovery action: "Wait and retry"

#### Test 3.4: Quota Exceeded (If Possible)
**Steps:**
1. Translate until daily quota exceeded (requires heavy usage or limited quota)

**Expected Result:**
- ❌ Error: `API_QUOTA_EXCEEDED` or `API_RATE_LIMITED`
- Status code: 403 or 429
- Message about quota exceeded
- Recovery action: "Upgrade plan" or "Wait until reset"

---

### 4. Cache Errors (NON-BLOCKING)

#### Test 4.1: IndexedDB Disabled
**Steps:**
1. Open Chrome DevTools
2. Application → Storage → IndexedDB
3. Right-click → Delete database (or disable in browser settings)
4. Try translating text

**Expected Result:**
- ⚠️ Warning logged: `CACHE_INITIALIZATION_FAILED`
- Translation **still succeeds** (non-blocking)
- Console shows error with `cacheType: 'offline'`
- User receives translation despite cache failure
- No cache entries created in IndexedDB

**Validation:**
```javascript
// Console shows warning but translation succeeds:
logger.error('Failed to initialize offline cache', {
  errorCode: 'CACHE_INITIALIZATION_FAILED',
  cacheType: 'offline'
})

// Translation still returned:
{ text: 'Hola mundo', detectedSourceLanguage: 'en' }
```

#### Test 4.2: Storage Quota Exceeded
**Steps:**
1. Fill chrome.storage.sync quota (100KB limit):
   ```javascript
   // Fill storage to trigger quota error
   const largeData = 'x'.repeat(100000);
   chrome.storage.sync.set({ test: largeData });
   ```
2. Try translating and saving to cache

**Expected Result:**
- ⚠️ Warning: `STOR_QUOTA_EXCEEDED` or `CACHE_WRITE_FAILED`
- Translation succeeds but cache write fails
- Non-blocking error

#### Test 4.3: Cache Read Error
**Steps:**
1. Corrupt IndexedDB data manually in DevTools
2. Try translating previously cached text

**Expected Result:**
- ⚠️ Warning: `CACHE_READ_FAILED`
- Falls through to API request
- Translation succeeds via API
- Non-blocking error

---

### 5. Parsing Errors (BLOCKING)

#### Test 5.1: Invalid JSON Response (Mock Required)
**Steps:**
1. Use network interception (e.g., Chrome DevTools → Network → Right-click response → Override content)
2. Replace valid JSON response with invalid JSON: `{invalid json`
3. Try translating

**Expected Result:**
- ❌ Error: `PARSE_JSON_FAILED`
- Message: "Failed to parse API response"
- Severity: HIGH
- Context shows: `operation: 'parse_api_response'`
- Partial response data included for debugging

#### Test 5.2: Missing Translation Field (Mock Required)
**Steps:**
1. Mock API response with structure:
   ```json
   {
     "data": {
       "translations": [
         { "missingField": "value" }
       ]
     }
   }
   ```
2. Try translating

**Expected Result:**
- ❌ Error: `PARSE_JSON_FAILED`
- Message about invalid response structure
- Context shows expected vs received structure

#### Test 5.3: Batch Array Length Mismatch (Mock Required)
**Steps:**
1. Request batch translation of 5 texts
2. Mock response with only 3 translations
3. Try batch translate

**Expected Result:**
- ❌ Error: `PARSE_JSON_FAILED`
- Message about array length mismatch
- Context shows: `expected: 5, received: 3`

---

### 6. Glossary Errors (NON-BLOCKING)

#### Test 6.1: Glossary Application Failure
**Steps:**
1. Add glossary terms in settings
2. Corrupt glossary data structure manually (if accessible)
3. Try translating text with glossary terms

**Expected Result:**
- ⚠️ Warning logged: Glossary application failed
- Translation **still succeeds** without glossary
- Original translation returned (without term replacement)
- Non-blocking error

---

### 7. Initialization Errors (NON-BLOCKING)

#### Test 7.1: Settings Load Failure
**Steps:**
1. Corrupt chrome.storage.sync settings
2. Reload extension
3. Check initialization

**Expected Result:**
- ⚠️ Warning: `STOR_CHROME_STORAGE_ERROR`
- Service uses default settings
- Extension continues functioning
- Non-blocking error

#### Test 7.2: Cache Initialization Failure
**Steps:**
1. Disable IndexedDB in browser
2. Reload extension

**Expected Result:**
- ⚠️ Warning: `CACHE_INITIALIZATION_FAILED` for offline cache
- Service continues with memory cache only
- Non-blocking error

---

### 8. Batch Translation Special Cases

#### Test 8.1: Batch with Mixed Cache State
**Steps:**
1. Cache 2 translations locally
2. Request batch of 5 texts (including the 2 cached ones)
3. Monitor which come from cache vs API

**Expected Result:**
- 2 cached texts retrieved instantly
- 3 texts fetched from API
- All 5 returned successfully
- Cache read errors (if any) are non-blocking

#### Test 8.2: Batch Partial Success
**Steps:**
1. Request batch translation
2. Simulate network failure mid-batch (difficult without mocking)

**Expected Result:**
- Falls back to returning original texts array
- Error logged with batch context
- No partial results returned

---

### 9. Language Detection

#### Test 9.1: Detect Language - Empty Text
**Steps:**
1. Call `detectLanguage('')`

**Expected Result:**
- ❌ Error: `VAL_EMPTY_TEXT`
- Blocks operation

#### Test 9.2: Detect Language - Network Error
**Steps:**
1. Disconnect internet
2. Try detecting language

**Expected Result:**
- ❌ Error: `NET_NO_CONNECTION`
- Falls back to returning `'unknown'`

---

### 10. Utility Methods

#### Test 10.1: Clear Cache Error
**Steps:**
1. Disable IndexedDB
2. Call `translationService.clearCache()`

**Expected Result:**
- ⚠️ Warning: `CACHE_OPERATION_FAILED` with `operation: 'cache_clear'`
- Non-blocking error
- Method completes without throwing

#### Test 10.2: Get Cache Size Error
**Steps:**
1. Corrupt IndexedDB
2. Call `translationService.getOfflineCacheSize()`

**Expected Result:**
- ⚠️ Warning logged
- Returns `0` as fallback
- Non-blocking error

#### Test 10.3: Export Cache Error
**Steps:**
1. Disable IndexedDB
2. Call `translationService.exportOfflineCache()`

**Expected Result:**
- ⚠️ Warning logged
- Returns `[]` empty array as fallback
- Non-blocking error

---

## Automated Testing Checklist

### DevTools Console Tests

Run these in Chrome DevTools console after loading the extension:

```javascript
// 1. Test empty text validation
translationService.translate('', 'es')
  .catch(err => console.log('✅ Validation error:', err.errorCode));

// 2. Test missing target language
translationService.translate('Hello', '')
  .catch(err => console.log('✅ Validation error:', err.errorCode));

// 3. Test valid translation (with valid API key)
translationService.translate('Hello world', 'es')
  .then(result => console.log('✅ Translation success:', result))
  .catch(err => console.log('❌ Translation error:', err));

// 4. Test batch translation
translationService.batchTranslate(['Hello', 'World', 'Test'], 'es')
  .then(results => console.log('✅ Batch success:', results))
  .catch(err => console.log('❌ Batch error:', err));

// 5. Test language detection
translationService.detectLanguage('Bonjour le monde')
  .then(lang => console.log('✅ Detected:', lang))
  .catch(err => console.log('❌ Detection error:', err));

// 6. Test cache operations
translationService.getOfflineCacheSize()
  .then(size => console.log('✅ Cache size:', size));

translationService.getOfflineCacheStats()
  .then(stats => console.log('✅ Cache stats:', stats));

// 7. Test cache clear
translationService.clearCache()
  .then(() => console.log('✅ Cache cleared'));

// 8. Test sync
translationService.syncToOfflineCache()
  .then(() => console.log('✅ Cache synced'));
```

---

## Error Display Verification

### Check ErrorDisplay Component

After triggering each error, verify in the UI:

1. **Error Alert Appears:**
   - Correct severity color (red for CRITICAL/HIGH, orange for MEDIUM, yellow for LOW)
   - Error code displayed prominently
   - Clear message text

2. **Context Section:**
   - Expandable details section
   - Context table shows all relevant data
   - Masked API key (if applicable): `****xyz123`
   - Truncated text (if long): `"This is a long text that needs tr..."`

3. **Recovery Actions:**
   - Action buttons displayed with icons
   - Correct button labels (Retry, Configure, Clear Cache, Help)
   - Buttons are clickable

4. **Additional Features:**
   - "Copy to Clipboard" button works
   - Stack trace expandable (if available)
   - Auto-dismiss for toast notifications (5 seconds)
   - Manual dismiss for detailed errors

---

## Logger Verification

### Check Console Output

After each error, verify logger output:

```javascript
// Expected format:
{
  level: 'error',
  timestamp: '2024-01-15T10:30:45.123Z',
  message: 'Translation network error',
  detailedError: {
    errorCode: 'NET_TIMEOUT',
    message: 'Network request timed out',
    severity: 'HIGH',
    category: 'NETWORK',
    isRecoverable: true,
    context: {
      operation: 'translate',
      url: '...',
      text: '...',
      targetLang: 'es'
    },
    recoveryActions: [...]
  }
}
```

---

## Success Criteria

### All Tests Must Pass:
- ✅ Validation errors block operations and show detailed errors
- ✅ Network errors block operations and provide retry actions
- ✅ API errors block operations and show status codes + masked keys
- ✅ Cache errors are non-blocking (translation continues)
- ✅ Parsing errors block operations and show structure details
- ✅ Glossary errors are non-blocking (translation works without glossary)
- ✅ Initialization errors are non-blocking (service starts)
- ✅ Utility method errors are non-blocking with safe fallbacks
- ✅ All errors include rich context (operation, parameters, state)
- ✅ All errors include recovery actions with clear descriptions
- ✅ Error UI displays correctly with proper severity colors
- ✅ Logger captures all errors with full context
- ✅ Type safety maintained (0 TypeScript errors)
- ✅ No console.error calls remain (all use logger)

---

## Next Steps After Testing

1. **Fix any issues found** during testing
2. **Integrate ErrorNotificationProvider** into App.tsx
3. **Add error handling to background/service-worker.ts**
4. **Add error handling to content scripts**
5. **Comprehensive E2E testing** of complete workflows

---

## Notes

- **Non-blocking errors** are logged but don't prevent functionality
- **Blocking errors** throw DetailedError and stop operation
- **Fallback behaviors** ensure graceful degradation
- **Rich context** helps debugging and user understanding
- **Recovery actions** provide clear next steps

**Test thoroughly to ensure: User ALWAYS knows what's wrong** ✅
