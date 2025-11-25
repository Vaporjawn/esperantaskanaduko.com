/**
 * Translation Cache Service with LRU (Least Recently Used) eviction
 * Persists cache to chrome.storage.local for offline access
 */

import type { TranslationCacheEntry } from '@/utils/storage';
import { getTranslationCache, saveTranslationCache, clearTranslationCache } from '@/utils/storage';

export class CacheService {
  private cache: Map<string, TranslationCacheEntry>;
  private maxSize: number;
  private persistenceEnabled: boolean;
  private autoSaveInterval: number | null = null;
  private isDirty = false;

  constructor(maxSize = 1000, persistenceEnabled = true) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.persistenceEnabled = persistenceEnabled;
  }

  /**
   * Initialize cache by loading from storage
   */
  async initialize(): Promise<void> {
    if (!this.persistenceEnabled) return;

    try {
      const cachedEntries = await getTranslationCache();

      // Sort by access count and timestamp to keep most used items
      const sortedEntries = cachedEntries
        .sort((a, b) => {
          // Prioritize by access count, then by timestamp
          if (a.accessCount !== b.accessCount) {
            return b.accessCount - a.accessCount;
          }
          return b.timestamp - a.timestamp;
        })
        .slice(0, this.maxSize); // Only keep up to maxSize items

      // Populate cache
      sortedEntries.forEach(entry => {
        const key = this.generateKey(entry.text, entry.targetLang, entry.sourceLang);
        this.cache.set(key, entry);
      });

      console.log(`Cache initialized with ${this.cache.size} entries`);
    } catch (error) {
      console.error('Failed to initialize cache:', error);
    }
  }

  /**
   * Enable auto-save to persist cache periodically
   */
  enableAutoSave(intervalMs = 60000): void {
    if (this.autoSaveInterval !== null) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = window.setInterval(async () => {
      if (this.isDirty) {
        await this.persist();
        this.isDirty = false;
      }
    }, intervalMs);
  }

  /**
   * Disable auto-save
   */
  disableAutoSave(): void {
    if (this.autoSaveInterval !== null) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Generate cache key
   */
  private generateKey(text: string, targetLang: string, sourceLang?: string): string {
    const normalizedText = text.trim().toLowerCase();
    return sourceLang
      ? `${sourceLang}:${targetLang}:${normalizedText}`
      : `${targetLang}:${normalizedText}`;
  }

  /**
   * Get translation from cache
   */
  get(text: string, targetLang: string, sourceLang?: string): string | null {
    const key = this.generateKey(text, targetLang, sourceLang);
    const entry = this.cache.get(key);

    if (entry) {
      // Update access count and timestamp (LRU)
      entry.accessCount++;
      entry.timestamp = Date.now();
      this.cache.set(key, entry);
      this.isDirty = true;

      return entry.translation;
    }

    return null;
  }

  /**
   * Set translation in cache with LRU eviction
   */
  set(
    text: string,
    translation: string,
    targetLang: string,
    sourceLang?: string
  ): void {
    const key = this.generateKey(text, targetLang, sourceLang);

    // Check if we need to evict
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry: TranslationCacheEntry = {
      text: text.trim(),
      translation,
      sourceLang,
      targetLang,
      timestamp: Date.now(),
      accessCount: 1,
    };

    this.cache.set(key, entry);
    this.isDirty = true;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruEntry: TranslationCacheEntry | null = null;

    // Find entry with lowest access count and oldest timestamp
    for (const [key, entry] of this.cache.entries()) {
      if (
        !lruEntry ||
        entry.accessCount < lruEntry.accessCount ||
        (entry.accessCount === lruEntry.accessCount && entry.timestamp < lruEntry.timestamp)
      ) {
        lruKey = key;
        lruEntry = entry;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  /**
   * Check if translation exists in cache
   */
  has(text: string, targetLang: string, sourceLang?: string): boolean {
    const key = this.generateKey(text, targetLang, sourceLang);
    return this.cache.has(key);
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.isDirty = false;

    if (this.persistenceEnabled) {
      await clearTranslationCache();
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    utilization: number;
    entries: Array<{
      text: string;
      translation: string;
      accessCount: number;
      age: number;
    }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.values())
      .map(entry => ({
        text: entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : ''),
        translation: entry.translation.substring(0, 50) + (entry.translation.length > 50 ? '...' : ''),
        accessCount: entry.accessCount,
        age: Math.floor((now - entry.timestamp) / 1000), // in seconds
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 20); // Top 20 most accessed

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize) * 100,
      entries,
    };
  }

  /**
   * Persist cache to storage
   */
  async persist(): Promise<void> {
    if (!this.persistenceEnabled) return;

    try {
      const entries = Array.from(this.cache.values());
      await saveTranslationCache(entries);
      console.log(`Persisted ${entries.length} cache entries`);
    } catch (error) {
      console.error('Failed to persist cache:', error);
    }
  }

  /**
   * Update max cache size and evict if necessary
   */
  setMaxSize(newMaxSize: number): void {
    this.maxSize = newMaxSize;

    // Evict excess entries
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
    }

    this.isDirty = true;
  }

  /**
   * Get all cache entries (for debugging/export)
   */
  getAllEntries(): TranslationCacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * Import cache entries (for restore/sync)
   */
  importEntries(entries: TranslationCacheEntry[]): void {
    this.cache.clear();

    // Sort by access count and take up to maxSize
    const sorted = entries
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, this.maxSize);

    sorted.forEach(entry => {
      const key = this.generateKey(entry.text, entry.targetLang, entry.sourceLang);
      this.cache.set(key, entry);
    });

    this.isDirty = true;
  }

  /**
   * Cleanup old entries (older than specified days)
   */
  cleanupOldEntries(daysOld = 30): number {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < cutoffTime && entry.accessCount < 2) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      this.isDirty = true;
    }

    return removed;
  }
}

// Export singleton instance
let cacheServiceInstance: CacheService | null = null;

export function getCacheService(maxSize = 1000): CacheService {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService(maxSize);
  }
  return cacheServiceInstance;
}

export function resetCacheService(): void {
  if (cacheServiceInstance) {
    cacheServiceInstance.disableAutoSave();
    cacheServiceInstance = null;
  }
}
