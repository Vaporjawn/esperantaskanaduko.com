# Error Codes Quick Reference

Complete list of all error codes with descriptions, causes, and resolution steps.

## Network Errors (NET_*)

### NET_NO_CONNECTION
- **Severity**: HIGH
- **Message**: "No network connection available"
- **Cause**: Device is offline or network is unavailable
- **Fix**: Check internet connection, try again when online
- **Recovery**: Retry operation, enable offline mode

### NET_TIMEOUT
- **Severity**: MEDIUM
- **Message**: "Request timed out"
- **Cause**: Server took too long to respond (>30 seconds)
- **Fix**: Check network speed, try again with shorter text
- **Recovery**: Retry with exponential backoff

### NET_DNS_FAILED
- **Severity**: HIGH
- **Message**: "DNS resolution failed"
- **Cause**: Cannot resolve domain name to IP address
- **Fix**: Check DNS settings, verify domain is correct
- **Recovery**: Retry operation, check DNS configuration

### NET_CONNECTION_REFUSED
- **Severity**: HIGH
- **Message**: "Connection refused by server"
- **Cause**: Server rejected the connection attempt
- **Fix**: Verify API endpoint URL, check firewall settings
- **Recovery**: Contact API provider, verify endpoint configuration

### NET_SSL_ERROR
- **Severity**: HIGH
- **Message**: "SSL/TLS certificate error"
- **Cause**: Invalid, expired, or self-signed certificate
- **Fix**: Verify API uses valid HTTPS certificate
- **Recovery**: Contact API provider, update certificate trust

### NET_CORS_ERROR
- **Severity**: HIGH
- **Message**: "CORS policy violation"
- **Cause**: API doesn't allow requests from extension origin
- **Fix**: API must include proper CORS headers
- **Recovery**: Use background script for API calls, contact API provider

---

## API Errors (API_*)

### API_KEY_INVALID
- **Severity**: CRITICAL
- **Message**: "Invalid or malformed API key"
- **Cause**: API key format is incorrect or not recognized
- **Fix**: Verify API key format matches provider requirements
- **Recovery**: Configure new API key, check key format

### API_KEY_MISSING
- **Severity**: CRITICAL
- **Message**: "API key not configured"
- **Cause**: No API key provided in settings
- **Fix**: Add API key in extension settings
- **Recovery**: Open settings to configure API key

### API_QUOTA_EXCEEDED
- **Severity**: HIGH
- **Message**: "Translation quota exceeded"
- **Cause**: Monthly/daily translation limit reached
- **Fix**: Wait for quota reset or upgrade plan
- **Recovery**: Switch to different provider, wait for reset

### API_RATE_LIMITED
- **Severity**: MEDIUM
- **Message**: "Too many requests - rate limited"
- **Cause**: Exceeded requests per minute/hour limit
- **Fix**: Slow down translation frequency
- **Recovery**: Retry after delay (1-5 minutes)

### API_UNAUTHORIZED
- **Severity**: HIGH
- **Message**: "Authentication failed"
- **Cause**: API rejected credentials or token expired
- **Fix**: Verify API key is still valid, regenerate if needed
- **Recovery**: Reconfigure API credentials

### API_BAD_REQUEST
- **Severity**: MEDIUM
- **Message**: "Invalid request format"
- **Cause**: Request doesn't match API requirements
- **Fix**: Verify request parameters and format
- **Recovery**: Adjust translation parameters, check API docs

### API_SERVER_ERROR
- **Severity**: HIGH
- **Message**: "Translation service error"
- **Cause**: API server experiencing issues (5xx errors)
- **Fix**: Wait for service to recover
- **Recovery**: Retry after delay, switch to backup provider

### API_LANGUAGE_NOT_SUPPORTED
- **Severity**: MEDIUM
- **Message**: "Language not supported by this provider"
- **Cause**: Selected language pair not available
- **Fix**: Check supported languages in settings
- **Recovery**: Select different language, switch provider

### API_TEXT_TOO_LONG
- **Severity**: MEDIUM
- **Message**: "Text exceeds maximum length"
- **Cause**: Text longer than API limit (typically 5000-10000 chars)
- **Fix**: Split text into smaller chunks
- **Recovery**: Use batch translation, reduce text length

---

## Storage Errors (STOR_*)

### STOR_QUOTA_EXCEEDED
- **Severity**: HIGH
- **Message**: "Storage quota exceeded"
- **Cause**: Extension storage limit reached (Chrome: ~5-10MB)
- **Fix**: Clear cache, history, or glossary data
- **Recovery**: Clear cache, manage stored data

### STOR_WRITE_FAILED
- **Severity**: MEDIUM
- **Message**: "Failed to write data to storage"
- **Cause**: Storage API error, quota issue, or permission problem
- **Fix**: Check storage permissions, clear space
- **Recovery**: Retry operation, clear storage

### STOR_READ_FAILED
- **Severity**: MEDIUM
- **Message**: "Failed to read data from storage"
- **Cause**: Storage corrupted, key doesn't exist, or permission denied
- **Fix**: Reset storage, verify permissions
- **Recovery**: Reset to defaults, reload extension

### STOR_PERMISSION_DENIED
- **Severity**: HIGH
- **Message**: "Storage access denied"
- **Cause**: Extension lacks storage permissions
- **Fix**: Verify manifest includes storage permission
- **Recovery**: Reinstall extension, grant permissions

### STOR_DB_VERSION_ERROR
- **Severity**: HIGH
- **Message**: "Database version mismatch"
- **Cause**: IndexedDB schema version conflict
- **Fix**: Clear extension data or upgrade database
- **Recovery**: Clear all data, reload extension

### STOR_DB_BLOCKED
- **Severity**: MEDIUM
- **Message**: "Database blocked by another tab"
- **Cause**: Another tab has database open with different version
- **Fix**: Close other extension instances
- **Recovery**: Close duplicate tabs, reload extension

### STOR_CORRUPTED_DATA
- **Severity**: HIGH
- **Message**: "Storage data corrupted"
- **Cause**: Data integrity check failed
- **Fix**: Clear and reset storage
- **Recovery**: Reset to defaults, export data first if possible

---

## Cache Errors (CACHE_*)

### CACHE_INITIALIZATION_FAILED
- **Severity**: HIGH
- **Message**: "Cache system failed to initialize"
- **Cause**: IndexedDB unavailable or initialization error
- **Fix**: Check browser storage settings
- **Recovery**: Disable cache, reload extension

### CACHE_WRITE_FAILED
- **Severity**: MEDIUM
- **Message**: "Failed to write to cache"
- **Cause**: Storage quota, permission, or corruption issue
- **Fix**: Clear cache space
- **Recovery**: Clear cache, continue without caching

### CACHE_READ_FAILED
- **Severity**: LOW
- **Message**: "Failed to read from cache"
- **Cause**: Cache miss, corrupted entry, or read error
- **Fix**: Cache will be repopulated automatically
- **Recovery**: Fetch fresh data, rebuild cache entry

### CACHE_CORRUPTED
- **Severity**: MEDIUM
- **Message**: "Cache data corrupted"
- **Cause**: Data integrity verification failed
- **Fix**: Clear corrupted cache
- **Recovery**: Clear cache, rebuild from fresh data

### CACHE_SYNC_FAILED
- **Severity**: LOW
- **Message**: "Cache synchronization failed"
- **Cause**: Failed to sync cache across sessions
- **Fix**: Cache will rebuild automatically
- **Recovery**: Rebuild cache, verify storage permissions

---

## DOM Errors (DOM_*)

### DOM_NODE_NOT_FOUND
- **Severity**: MEDIUM
- **Message**: "DOM element not found"
- **Cause**: Element doesn't exist or was removed
- **Fix**: Verify page structure hasn't changed
- **Recovery**: Retry operation, refresh page

### DOM_INJECTION_BLOCKED
- **Severity**: HIGH
- **Message**: "Content injection blocked by CSP"
- **Cause**: Content Security Policy prevents script injection
- **Fix**: Page's CSP is too restrictive for extension
- **Recovery**: Skip this page, contact site owner

### DOM_READONLY_NODE
- **Severity**: MEDIUM
- **Message**: "Cannot modify read-only DOM node"
- **Cause**: Attempting to modify protected element
- **Fix**: Find alternative injection point
- **Recovery**: Skip element, try parent or sibling

### DOM_MUTATION_FAILED
- **Severity**: MEDIUM
- **Message**: "DOM mutation failed"
- **Cause**: Failed to modify DOM structure
- **Fix**: Check element exists and is modifiable
- **Recovery**: Retry with different method

### DOM_TRAVERSAL_FAILED
- **Severity**: LOW
- **Message**: "DOM traversal error"
- **Cause**: Error navigating DOM structure
- **Fix**: Verify page structure is valid
- **Recovery**: Retry with alternative traversal method

---

## Permission Errors (PERM_*)

### PERM_TAB_ACCESS_DENIED
- **Severity**: CRITICAL
- **Message**: "Tab access denied"
- **Cause**: Extension lacks activeTab permission
- **Fix**: Grant tab permission in manifest
- **Recovery**: Reinstall extension, update permissions

### PERM_HOST_ACCESS_DENIED
- **Severity**: HIGH
- **Message**: "Host permission denied"
- **Cause**: Extension not allowed on this domain
- **Fix**: Add host permission or use <all_urls>
- **Recovery**: Grant host permission, reload page

### PERM_STORAGE_ACCESS_DENIED
- **Severity**: CRITICAL
- **Message**: "Storage permission denied"
- **Cause**: Extension lacks storage permission
- **Fix**: Add storage permission to manifest
- **Recovery**: Reinstall extension with correct permissions

### PERM_CONTEXT_MENU_DENIED
- **Severity**: MEDIUM
- **Message**: "Context menu permission denied"
- **Cause**: Extension lacks contextMenus permission
- **Fix**: Add contextMenus permission to manifest
- **Recovery**: Use alternative translation trigger

---

## Configuration Errors (CFG_*)

### CFG_MISSING_API_KEY
- **Severity**: CRITICAL
- **Message**: "API key not configured"
- **Cause**: Required API key not set in settings
- **Fix**: Configure API key in extension settings
- **Recovery**: Open settings page to configure

### CFG_INVALID_SETTINGS
- **Severity**: HIGH
- **Message**: "Invalid settings format"
- **Cause**: Settings data corrupted or wrong format
- **Fix**: Reset settings to defaults
- **Recovery**: Reset to defaults, reconfigure

### CFG_INITIALIZATION_FAILED
- **Severity**: CRITICAL
- **Message**: "Extension initialization failed"
- **Cause**: Critical startup error
- **Fix**: Check browser console for details
- **Recovery**: Reload extension, reinstall if needed

### CFG_VERSION_MISMATCH
- **Severity**: HIGH
- **Message**: "Configuration version mismatch"
- **Cause**: Settings from incompatible extension version
- **Fix**: Reset settings or migrate to new format
- **Recovery**: Reset settings, update configuration

---

## Validation Errors (VAL_*)

### VAL_EMPTY_TEXT
- **Severity**: LOW
- **Message**: "Text cannot be empty"
- **Cause**: Attempted to translate empty string
- **Fix**: Select text before translating
- **Recovery**: Provide text input

### VAL_INVALID_LANGUAGE_CODE
- **Severity**: MEDIUM
- **Message**: "Invalid language code"
- **Cause**: Language code doesn't match ISO 639-1 format
- **Fix**: Use valid 2-letter language code
- **Recovery**: Select language from dropdown

### VAL_INVALID_URL
- **Severity**: LOW
- **Message**: "Invalid URL format"
- **Cause**: URL doesn't match expected format
- **Fix**: Provide valid HTTP/HTTPS URL
- **Recovery**: Correct URL format

### VAL_INVALID_DOMAIN
- **Severity**: LOW
- **Message**: "Invalid domain format"
- **Cause**: Domain name doesn't match format (no protocol)
- **Fix**: Use domain without http:// (e.g., example.com)
- **Recovery**: Remove protocol from domain

### VAL_SETTINGS_SCHEMA
- **Severity**: MEDIUM
- **Message**: "Settings validation failed"
- **Cause**: Settings don't match expected schema
- **Fix**: Reset settings to defaults
- **Recovery**: Reset invalid settings

---

## Parsing Errors (PARSE_*)

### PARSE_JSON_FAILED
- **Severity**: MEDIUM
- **Message**: "JSON parsing failed"
- **Cause**: Invalid JSON format received
- **Fix**: Verify API response format
- **Recovery**: Retry request, check API documentation

### PARSE_HTML_FAILED
- **Severity**: MEDIUM
- **Message**: "HTML parsing failed"
- **Cause**: Invalid or malformed HTML
- **Fix**: Verify page HTML is valid
- **Recovery**: Skip element, try alternative parser

### PARSE_INVALID_RESPONSE
- **Severity**: MEDIUM
- **Message**: "Invalid API response format"
- **Cause**: API response doesn't match expected structure
- **Fix**: Verify API version compatibility
- **Recovery**: Check API documentation, update parser

### PARSE_INVALID_SETTINGS
- **Severity**: MEDIUM
- **Message**: "Invalid settings format"
- **Cause**: Settings data doesn't parse correctly
- **Fix**: Reset settings to defaults
- **Recovery**: Clear settings, reconfigure

---

## General Errors

### UNKNOWN
- **Severity**: MEDIUM
- **Message**: "An unexpected error occurred"
- **Cause**: Error doesn't match any known pattern
- **Fix**: Check browser console for details
- **Recovery**: Retry operation, report issue if persists

---

## Error Severity Levels

- **CRITICAL**: System cannot function, immediate action required
- **HIGH**: Major functionality broken, significantly impacts user
- **MEDIUM**: Feature degraded but workarounds available
- **LOW**: Minor issue with minimal impact
- **INFO**: Informational message, not actually an error

## Quick Troubleshooting Guide

1. **"Invalid API key"** → Check Settings → Verify API key format → Regenerate key
2. **"Network error"** → Check internet connection → Verify firewall settings → Retry
3. **"Storage quota exceeded"** → Clear cache → Delete history → Manage glossary
4. **"Permission denied"** → Reinstall extension → Grant permissions → Reload page
5. **"Rate limited"** → Wait 1-5 minutes → Reduce translation frequency → Try again

## Getting Help

If errors persist after trying recovery actions:
1. Check browser console (F12) for detailed error logs
2. Export error history using `logger.exportErrorHistory()`
3. Report issue with error code, context, and reproduction steps
4. Include extension version and browser details
