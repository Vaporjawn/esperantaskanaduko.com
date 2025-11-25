# Multiple Translation Provider Support

## Overview

The Esperanto Translator extension now supports multiple translation providers with automatic fallback capabilities. This feature allows you to configure multiple translation services (Google Translate, Microsoft Translator, LibreTranslate) and the extension will automatically switch to a backup provider if the primary one fails.

## Features

- **Multiple Provider Support**: Configure Google, Microsoft, and LibreTranslate providers
- **Automatic Fallback**: If primary provider fails, automatically try backup providers
- **Priority-Based Selection**: Set provider priority (1 = highest priority)
- **Provider Testing**: Test each provider's connectivity and configuration
- **Statistics Tracking**: Monitor success/failure rates and performance metrics
- **Flexible Configuration**: Enable/disable providers individually

## Supported Providers

### Google Translate
- **Accuracy**: Excellent
- **Esperanto Support**: ✅ Full support
- **Batch Translation**: ✅ Supported
- **Language Detection**: ✅ Supported
- **API Key**: Required
- **Max Text Length**: 30,000 characters
- **Max Batch Size**: 128 texts

### Microsoft Translator
- **Accuracy**: Good
- **Esperanto Support**: ⚠️ Limited/Unofficial
- **Batch Translation**: ✅ Supported
- **Language Detection**: ✅ Supported
- **API Key**: Required
- **Max Text Length**: 50,000 characters
- **Max Batch Size**: 100 texts

### LibreTranslate (Open Source)
- **Accuracy**: Moderate
- **Esperanto Support**: ✅ Supported
- **Batch Translation**: ❌ Not supported (uses sequential translation)
- **Language Detection**: ✅ Supported
- **API Key**: Optional (public instance available)
- **Max Text Length**: 5,000 characters
- **Max Batch Size**: 1 text
- **Custom Endpoint**: ✅ Can use self-hosted instance

## Configuration

### Basic Setup

1. **Open Settings**: Click the extension icon and open Settings
2. **Navigate to Providers**: Find the "Translation Providers" section
3. **Enable Providers**: Toggle on the providers you want to use
4. **Set Priorities**: Lower number = higher priority (1 is highest)
5. **Add API Keys**: Enter API keys for providers that require them
6. **Test Connection**: Click "Test Connection" to verify each provider works

### Provider Configuration Example

```javascript
{
  providers: [
    {
      type: 'google',
      apiKey: 'YOUR_GOOGLE_API_KEY',
      enabled: true,
      priority: 1  // Primary provider
    },
    {
      type: 'libre',
      enabled: true,
      priority: 2,  // Fallback provider
      apiEndpoint: 'https://libretranslate.com'  // Optional
    },
    {
      type: 'microsoft',
      apiKey: 'YOUR_MICROSOFT_API_KEY',
      enabled: false,  // Disabled
      priority: 3
    }
  ],
  enableProviderFallback: true,
  fallbackTimeout: 10000  // 10 seconds before trying fallback
}
```

### Storage Structure

Settings are stored in `chrome.storage.sync`:

```typescript
{
  settings: {
    // ... other settings ...
    providers: ProviderConfig[],
    enableProviderFallback: boolean,
    fallbackTimeout: number
  }
}
```

## Using the Provider System

### Via Translation Service

The enhanced translation service (`TranslationServiceV2`) automatically uses the provider manager:

```typescript
import { getTranslationServiceV2 } from '@/services/translationServiceV2';

const service = getTranslationServiceV2();

// Translate with automatic fallback
const result = await service.translate({
  text: 'Hello world',
  targetLang: 'eo',
  sourceLang: 'en'
});

// Batch translate
const translations = await service.batchTranslate(
  ['Hello', 'Goodbye', 'Thank you'],
  'eo'
);

// Get provider statistics
const stats = service.getProviderStats();
console.log(stats);
// {
//   google: { successfulRequests: 42, failedRequests: 1, ... },
//   libre: { successfulRequests: 3, failedRequests: 0, ... }
// }

// Test a specific provider
const isWorking = await service.testProvider('google');

// Test all providers
const results = await service.testAllProviders();
// { google: true, microsoft: false, libre: true }
```

### Direct Provider Manager Usage

For advanced use cases, you can use the provider manager directly:

```typescript
import { ProviderManager } from '@/services/providers/ProviderManager';
import type { ProviderManagerConfig } from '@/types/provider';

const config: ProviderManagerConfig = {
  providers: [
    { type: 'google', apiKey: 'key', enabled: true, priority: 1 },
    { type: 'libre', enabled: true, priority: 2 }
  ],
  enableFallback: true,
  fallbackTimeout: 10000,
  maxRetries: 3
};

const manager = new ProviderManager(config);

// Translate with automatic fallback
const translated = await manager.translate('Hello', 'eo', 'en');

// Get all provider stats
const stats = manager.getAllStats();
```

## Provider Fallback Behavior

### When Does Fallback Occur?

The system automatically tries fallback providers in these scenarios:

1. **Network Errors**: Connection timeout, network unavailable
2. **API Errors**: Server errors (5xx status codes)
3. **Rate Limiting**: 429 Too Many Requests
4. **Timeout**: Request exceeds `fallbackTimeout` (default: 10 seconds)

### Fallback Flow

```
1. Try primary provider (priority 1)
   ↓
2. If fails and error is retryable:
   → Try next enabled provider (priority 2)
   ↓
3. If fails and error is retryable:
   → Try next enabled provider (priority 3)
   ↓
4. If all fail:
   → Throw original error
```

### Non-Retryable Errors

These errors will NOT trigger fallback:
- Invalid API key (authentication errors)
- Text too long for provider
- Batch size too large
- Invalid language code

## Provider Statistics

Each provider tracks:
- **Successful Requests**: Count of successful translations
- **Failed Requests**: Count of failed attempts
- **Average Response Time**: Average time in milliseconds
- **Total Characters Translated**: Cumulative character count
- **Last Request Time**: Timestamp of last request

Access statistics:

```typescript
const stats = service.getProviderStats();

// Example output
{
  google: {
    successfulRequests: 145,
    failedRequests: 3,
    averageResponseTime: 487,  // ms
    totalCharactersTranslated: 12543,
    lastRequestTime: 1732464000000
  },
  libre: {
    successfulRequests: 12,
    failedRequests: 0,
    averageResponseTime: 892,
    totalCharactersTranslated: 856,
    lastRequestTime: 1732463500000
  }
}
```

## API Keys

### Getting API Keys

#### Google Cloud Translation API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Cloud Translation API"
4. Create credentials → API Key
5. Copy the API key

#### Microsoft Translator
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create "Translator" resource
3. Get key from "Keys and Endpoint" section
4. Copy either Key 1 or Key 2

#### LibreTranslate
- Public instance: No API key needed
- Self-hosted: Optional API key for rate limiting

### Storing API Keys Securely

API keys are stored in `chrome.storage.sync` which is:
- Encrypted at rest
- Synced across devices (if signed in to Chrome)
- Not accessible to other extensions

**Security Best Practices**:
- Use separate API keys for each extension
- Set up billing limits in cloud provider console
- Rotate keys periodically
- Monitor usage for unusual activity

## UI Components

### ProviderSettings Component

React component for configuring providers in the extension popup:

```tsx
import { ProviderSettings } from '@/popup/components/ProviderSettings';

<ProviderSettings
  providers={settings.providers || []}
  onUpdate={(providers) => updateSettings({ providers })}
/>
```

Features:
- Enable/disable providers
- Set priority order
- Enter API keys
- Test provider connectivity
- View provider status

## Migration from Legacy System

The system supports backward compatibility with the old single-provider configuration:

### Old Format (Still Supported)
```javascript
{
  apiProvider: 'google',
  apiKey: 'YOUR_API_KEY'
}
```

### New Format (Recommended)
```javascript
{
  providers: [
    { type: 'google', apiKey: 'YOUR_API_KEY', enabled: true, priority: 1 }
  ]
}
```

The system automatically migrates old format to new format on initialization.

## Error Handling

### Provider-Specific Errors

Each error includes provider information:

```typescript
interface TranslationProviderError extends Error {
  provider: ProviderType;  // 'google', 'microsoft', 'libre'
  code: string;            // Error code (e.g., 'API_ERROR', 'TIMEOUT')
  isRetryable: boolean;    // Whether fallback should be attempted
}
```

### Error Codes

Common error codes:
- `MISSING_API_KEY`: API key required but not provided
- `API_ERROR`: General API error
- `TEXT_TOO_LONG`: Text exceeds provider's maximum length
- `BATCH_TOO_LARGE`: Batch size exceeds provider's limit
- `DETECTION_ERROR`: Language detection failed
- `TIMEOUT`: Request timed out

## Performance Considerations

### Provider Selection

- **Google**: Best for accuracy and large batches
- **Microsoft**: Good alternative with higher text limits
- **LibreTranslate**: Best for privacy, slower performance

### Optimization Tips

1. **Use Caching**: Enable translation cache to reduce API calls
2. **Batch When Possible**: Use batch translation for multiple texts
3. **Set Reasonable Timeouts**: Balance between speed and reliability
4. **Monitor Stats**: Check provider statistics to optimize selection
5. **Prioritize Appropriately**: Put faster providers first for better UX

## Testing

### Unit Tests

```bash
npm run test providers
```

### Integration Tests

Test with real APIs:

```typescript
// Test all providers
const results = await service.testAllProviders();

// Test specific provider
const isWorking = await service.testProvider('google');
```

### Manual Testing

1. Configure multiple providers in settings
2. Disable primary provider temporarily
3. Attempt translation
4. Verify fallback occurs
5. Check statistics for both providers

## Troubleshooting

### Provider Always Failing

1. **Check API Key**: Ensure key is valid and has correct permissions
2. **Check Quota**: Verify you haven't exceeded API quota
3. **Test Connection**: Use "Test Connection" button in settings
4. **Check Network**: Ensure internet connection is working
5. **View Console**: Check browser console for detailed error messages

### Fallback Not Working

1. **Verify Fallback Enabled**: Check `enableProviderFallback` is true
2. **Check Provider Priority**: Ensure fallback providers have higher priority numbers
3. **Verify Providers Enabled**: Confirm fallback providers are toggled on
4. **Check Error Type**: Some errors don't trigger fallback (e.g., invalid API key)

### Performance Issues

1. **Reduce Timeout**: Lower `fallbackTimeout` for faster fallback
2. **Optimize Priority**: Put faster providers first
3. **Enable Caching**: Reduce duplicate API calls
4. **Use Batch Translation**: More efficient for multiple texts

## Future Enhancements

Potential improvements for future versions:

- [ ] DeepL provider integration
- [ ] Custom provider support (bring your own API)
- [ ] Provider load balancing
- [ ] Circuit breaker pattern
- [ ] Provider health monitoring dashboard
- [ ] Automatic provider selection based on text characteristics
- [ ] Cost tracking and budget limits
- [ ] Provider-specific quality settings

## API Reference

See TypeScript type definitions:
- `/src/types/provider.ts` - Provider types and interfaces
- `/src/services/providers/BaseProvider.ts` - Base provider class
- `/src/services/providers/ProviderManager.ts` - Provider manager
- `/src/services/translationServiceV2.ts` - Enhanced translation service

## Contributing

When adding a new provider:

1. Create provider class extending `BaseProvider`
2. Implement required methods (translate, detectLanguage, etc.)
3. Define provider capabilities
4. Add to `PROVIDER_INFO` in ProviderSettings component
5. Register in ProviderManager
6. Add tests
7. Update documentation

Example:

```typescript
import { BaseProvider } from './BaseProvider';

export class NewProvider extends BaseProvider {
  readonly type = 'newprovider';
  readonly capabilities = {
    supportsBatchTranslation: true,
    supportsLanguageDetection: true,
    supportsEsperanto: true,
    maxTextLength: 10000,
    maxBatchSize: 50,
  };

  // Implement required methods...
}
```

---

**Last Updated**: November 24, 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
