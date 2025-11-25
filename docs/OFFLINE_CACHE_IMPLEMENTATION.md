# Offline Translation Cache Implementation

## Overview

The Esperanto Translator extension now includes a comprehensive offline translation cache system that stores translations persistently using IndexedDB. This enables offline access to previously translated content and improves performance by reducing API calls.

## Architecture

### Two-Tier Caching System

The extension implements a two-tier caching architecture:

1. **Memory Cache (L1)** - Fast, in-memory LRU cache
   - Uses JavaScript `Map` for O(1) lookups
   - Limited to configurable number of entries (default: 1000)
   - Persists to chrome.storage.local for session recovery
   - Fastest access for recently used translations

2. **Offline Cache (L2)** - Persistent IndexedDB storage
   - Uses browser's IndexedDB for long-term storage
   - Configurable storage size in MB (default: 50 MB)
   - Survives browser restarts and extension updates
   - Provides offline translation capability

### Data Flow

```
User Request
    ↓
Check Memory Cache (L1)
    ↓ [MISS]
Check Offline Cache (L2)
    ↓ [MISS]
Translation API Call
    ↓
Store in Memory Cache (L1)
    ↓
Store in Offline Cache (L2)
    ↓
Return Translation
```

## Implementation Details

### OfflineCacheService (`src/services/offlineCacheService.ts`)

#### Key Features

- **IndexedDB Storage**: Uses native browser IndexedDB for persistent storage
- **LRU Eviction**: Automatically removes least recently used entries when storage is full
- **Size Management**: Tracks byte size of each entry to manage storage limits
- **Automatic Indexing**: Maintains indexes for efficient queries by:
  - Cache key (unique)
  - Timestamp
  - Access count
  - Target language
  - Entry size

#### API Methods

##### Core Operations
- `initialize()`: Opens IndexedDB connection and sets up object stores
- `get(text, targetLang, sourceLang?)`: Retrieves translation from offline cache
- `set(text, translation, targetLang, sourceLang?)`: Stores translation in offline cache
- `has(text, targetLang, sourceLang?)`: Checks if translation exists
- `clear()`: Removes all cache entries

##### Cache Management
- `getStats()`: Returns comprehensive cache statistics including:
  - Entry count
  - Storage size in MB
  - Utilization percentage
  - Oldest/newest entry dates
  - Top 10 most accessed entries
- `cleanupOldEntries(daysOld)`: Removes entries older than specified days with low access counts
- `exportCache()`: Exports all cache entries as JSON for backup
- `importCache(entries)`: Imports cache entries from backup
- `syncWithMemoryCache(entries)`: Syncs memory cache entries to offline storage

##### Storage Management
- `getCurrentStorageSize()`: Calculates total storage used
- `evictLRU(requiredSpace)`: Removes least recently used entries to free up space
- `getEntriesByLanguage(targetLang)`: Retrieves all entries for specific target language

### TranslationService Integration

The `TranslationService` has been enhanced to seamlessly integrate both cache tiers:

```typescript
// Check memory cache first (fastest)
const cachedTranslation = this.cacheService.get(text, targetLang, sourceLang);
if (cachedTranslation) return { translatedText: cachedTranslation };

// Check offline cache (slower, but available offline)
const offlineCached = await this.offlineCacheService.get(text, targetLang, sourceLang);
if (offlineCached) {
  // Promote to memory cache for faster access next time
  this.cacheService.set(text, offlineCached, targetLang, sourceLang);
  return { translatedText: offlineCached };
}

// Fetch from API and cache in both tiers
const translation = await this.translateFromAPI(request);
this.cacheService.set(text, translation, targetLang, sourceLang);
await this.offlineCacheService.set(text, translation, targetLang, sourceLang);
```

## User Interface

### Cache Settings Component (`src/popup/components/CacheSettings.tsx`)

Provides comprehensive cache management through accordion-based UI:

#### Memory Cache Section
- Enable/disable memory cache
- Adjust max cache size (100-5000 entries)
- View cache statistics (size, utilization)
- Clear memory cache button

#### Offline Cache Section
- Enable/disable offline cache
- Adjust max storage size (10-200 MB)
- Enable auto-sync from memory to offline cache
- View detailed statistics:
  - Entry count
  - Storage size and utilization
  - Oldest/newest entry dates
  - Top accessed entries

#### Cache Management Operations
- **Sync Memory to Offline**: Manually sync all memory cache entries to offline storage
- **Cleanup Old Entries**: Remove entries older than 90 days with low access counts
- **Export Cache**: Download cache as JSON file for backup
- **Import Cache**: Restore cache from JSON backup file
- **Clear Offline Cache**: Remove all offline cache entries

## Configuration

### Settings (`src/types/settings.ts`)

New settings added to `ExtensionSettings` interface:

```typescript
interface ExtensionSettings {
  // ... existing settings

  // Offline Cache Settings
  enableOfflineCache: boolean;        // Enable/disable offline cache
  offlineCacheSize: number;           // Max storage size in MB
  autoSyncOfflineCache: boolean;      // Auto-sync memory to offline
}
```

### Default Values

```typescript
{
  enableOfflineCache: true,
  offlineCacheSize: 50,              // 50 MB default
  autoSyncOfflineCache: false,
}
```

## Message Passing

### New Message Types

Added to `MessageType` enum in `src/types/messages.ts`:

- `GET_CACHE_STATS`: Retrieve statistics for both cache tiers
- `SYNC_OFFLINE_CACHE`: Sync memory cache to offline storage
- `CLEANUP_OFFLINE_CACHE`: Remove old cache entries
- `EXPORT_OFFLINE_CACHE`: Export cache data
- `IMPORT_OFFLINE_CACHE`: Import cache data

### Message Handlers

Background script (`src/background/messageHandler.ts`) handles:

```typescript
case 'GET_CACHE_STATS':
  return {
    memoryStats: service.getCacheStats(),
    offlineStats: await service.getOfflineCacheStats()
  };

case 'SYNC_OFFLINE_CACHE':
  await service.syncToOfflineCache();
  return { count: await service.getOfflineCacheSize() };

case 'CLEANUP_OFFLINE_CACHE':
  const removed = await service.cleanupOfflineCache(daysOld);
  return { count: removed };

case 'EXPORT_OFFLINE_CACHE':
  return { data: await service.exportOfflineCache() };

case 'IMPORT_OFFLINE_CACHE':
  return { count: await service.importOfflineCache(entries) };
```

## Performance Considerations

### Optimization Strategies

1. **Two-Tier Architecture**: Memory cache provides O(1) lookups for hot data, while offline cache provides persistence
2. **Lazy Initialization**: IndexedDB connection opened only when needed
3. **Batch Operations**: Batch translation results cached together
4. **Cache Promotion**: Offline cache hits promoted to memory cache
5. **Size Tracking**: Each entry's byte size tracked for accurate storage management

### Storage Limits

- **Memory Cache**: Limited by entry count (default 1000)
- **Offline Cache**: Limited by MB (default 50 MB)
- **Browser Limits**: IndexedDB storage subject to browser quota (typically 10-50% of available disk space)

### LRU Eviction Strategy

Entries evicted based on:
1. **Primary**: Access count (lower = evicted first)
2. **Secondary**: Timestamp (older = evicted first)

## Error Handling

### Graceful Degradation

- If IndexedDB unavailable, falls back to memory cache only
- If offline cache full, continues with memory cache
- If import fails, displays error without affecting existing cache
- Network errors don't affect cached translations

### Error Messages

User-friendly messages displayed for:
- Cache initialization failures
- Import/export errors
- Cleanup failures
- Storage quota exceeded

## Testing

### Unit Tests

Test coverage should include:
- Cache key generation
- LRU eviction logic
- Size calculation accuracy
- IndexedDB operations
- Error handling scenarios

### Integration Tests

Test scenarios:
1. Translation caching workflow (API → Memory → Offline)
2. Cache promotion (Offline → Memory)
3. Storage limit enforcement
4. Cleanup operations
5. Export/import functionality

### Manual Testing Checklist

- [ ] Enable offline cache in settings
- [ ] Translate multiple pages
- [ ] Verify cache stats update
- [ ] Test offline mode (disable network)
- [ ] Verify translations work offline
- [ ] Test cache cleanup
- [ ] Export cache and verify file
- [ ] Import cache and verify entries
- [ ] Test cache size limits
- [ ] Test LRU eviction

## Future Enhancements

### Potential Improvements

1. **Compression**: Compress cache entries to save storage space
2. **Differential Sync**: Only sync changed entries to offline cache
3. **Smart Prefetch**: Predict and prefetch likely translations
4. **Cloud Sync**: Sync cache across devices (with user permission)
5. **Analytics**: Track cache hit rates and optimize accordingly
6. **Selective Caching**: Allow users to prioritize certain content
7. **Cache Warming**: Pre-populate cache with common phrases
8. **Incremental Cleanup**: Background cleanup during idle time

## Usage Examples

### Programmatic Usage

```typescript
import { getOfflineCacheService } from '@/services/offlineCacheService';

const offlineCache = getOfflineCacheService();
await offlineCache.initialize();

// Store translation
await offlineCache.set('Hello', 'Saluton', 'eo', 'en');

// Retrieve translation
const translation = await offlineCache.get('Hello', 'eo', 'en');

// Get statistics
const stats = await offlineCache.getStats();
console.log(`Cache has ${stats.entryCount} entries using ${stats.storageSizeMB.toFixed(2)} MB`);

// Cleanup old entries
const removed = await offlineCache.cleanupOldEntries(90);
console.log(`Removed ${removed} old entries`);
```

### User Interface

1. **Open Extension Popup**
2. **Click Settings Icon**
3. **Scroll to Cache Settings**
4. **Expand "Offline Cache (IndexedDB)" section**
5. **Configure settings and use management buttons**

## Security & Privacy

### Data Storage

- All cache data stored locally in browser
- No cache data sent to external servers
- Cache cleared when extension uninstalled
- User has full control over cache deletion

### Privacy Considerations

- Cached translations contain user browsing history
- Users should be aware cache persists across sessions
- Provide clear cache clearing options
- Consider adding auto-cleanup options for privacy

## Troubleshooting

### Common Issues

**Issue**: Offline cache not working
- **Solution**: Check if IndexedDB is available (`'indexedDB' in window`)
- **Solution**: Verify browser storage quota not exceeded
- **Solution**: Check browser console for IndexedDB errors

**Issue**: Cache not syncing
- **Solution**: Manually trigger sync from settings
- **Solution**: Check auto-sync setting enabled
- **Solution**: Verify sufficient storage space

**Issue**: Import fails
- **Solution**: Verify JSON file format matches export format
- **Solution**: Check file not corrupted
- **Solution**: Ensure sufficient storage for import

**Issue**: Storage quota exceeded
- **Solution**: Reduce max storage size in settings
- **Solution**: Run cleanup to remove old entries
- **Solution**: Clear offline cache and start fresh

## Performance Metrics

### Expected Performance

- **Memory Cache Hit**: < 1ms
- **Offline Cache Hit**: < 10ms
- **IndexedDB Write**: < 50ms
- **Cache Sync (1000 entries)**: < 5 seconds
- **Cache Export (1000 entries)**: < 2 seconds
- **Cache Import (1000 entries)**: < 5 seconds

### Monitoring

Track these metrics:
- Cache hit rate (memory vs offline vs API)
- Average lookup time
- Storage utilization
- Eviction frequency
- Cleanup effectiveness

## Conclusion

The offline translation cache feature provides significant benefits:

✅ **Offline Access**: Translations available without internet connection
✅ **Performance**: Faster translations for cached content
✅ **Cost Reduction**: Fewer API calls reduce costs
✅ **User Experience**: Instant translation retrieval for repeated content
✅ **Privacy**: All data stored locally
✅ **Flexibility**: Comprehensive management options

The two-tier caching architecture balances speed (memory cache) with persistence (offline cache), providing optimal user experience while managing storage efficiently.

---

**Implementation Status**: ✅ Complete
**Testing Status**: 🔄 Ready for Testing
**Documentation Version**: 1.0
**Last Updated**: November 24, 2025
**Author**: Victor Williams (@Vaporjawn)
