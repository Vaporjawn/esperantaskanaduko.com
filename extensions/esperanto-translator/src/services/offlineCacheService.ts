/**
 * Offline Translation Cache Service using IndexedDB
 * Provides persistent, offline-capable translation storage
 * Complements the in-memory cache with long-term storage
 */

import type { TranslationCacheEntry } from '@/utils/storage';

const DB_NAME = 'EsperantoTranslatorDB';
const DB_VERSION = 1;
const STORE_NAME = 'translations';

export interface OfflineCacheEntry extends TranslationCacheEntry {
  id?: number; // IndexedDB auto-increment key
  size: number; // Byte size for storage management
}

export class OfflineCacheService {
  private db: IDBDatabase | null = null;
  private maxStorageSize: number; // in bytes
  private initPromise: Promise<void> | null = null;

  constructor(maxStorageMB = 50) {
    this.maxStorageSize = maxStorageMB * 1024 * 1024; // Convert MB to bytes
  }

  /**
   * Initialize IndexedDB
   */
  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });

          // Create indexes for efficient queries
          store.createIndex('cacheKey', 'cacheKey', { unique: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('accessCount', 'accessCount', { unique: false });
          store.createIndex('targetLang', 'targetLang', { unique: false });
          store.createIndex('size', 'size', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(text: string, targetLang: string, sourceLang?: string): string {
    const normalizedText = text.trim().toLowerCase();
    return sourceLang
      ? `${sourceLang}:${targetLang}:${normalizedText}`
      : `${targetLang}:${normalizedText}`;
  }

  /**
   * Calculate byte size of entry
   */
  private calculateSize(entry: TranslationCacheEntry): number {
    const textSize = new Blob([entry.text]).size;
    const translationSize = new Blob([entry.translation]).size;
    return textSize + translationSize;
  }

  /**
   * Get translation from offline cache
   */
  async get(text: string, targetLang: string, sourceLang?: string): Promise<string | null> {
    await this.initialize();
    if (!this.db) return null;

    const cacheKey = this.generateCacheKey(text, targetLang, sourceLang);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('cacheKey');
      const request = index.get(cacheKey);

      request.onsuccess = () => {
        const entry = request.result as OfflineCacheEntry | undefined;
        if (entry) {
          // Update access count and timestamp (LRU)
          entry.accessCount++;
          entry.timestamp = Date.now();
          store.put(entry);
          resolve(entry.translation);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Failed to get from offline cache:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Store translation in offline cache
   */
  async set(
    text: string,
    translation: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    const cacheKey = this.generateCacheKey(text, targetLang, sourceLang);
    const entry: OfflineCacheEntry = {
      text: text.trim(),
      translation,
      sourceLang,
      targetLang,
      timestamp: Date.now(),
      accessCount: 1,
      size: this.calculateSize({ text, translation, targetLang, sourceLang, timestamp: Date.now(), accessCount: 1 }),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('cacheKey');

      // Check if entry already exists
      const getRequest = index.get(cacheKey);

      getRequest.onsuccess = async () => {
        const existingEntry = getRequest.result as OfflineCacheEntry | undefined;

        if (existingEntry) {
          // Update existing entry
          entry.id = existingEntry.id;
          entry.accessCount = existingEntry.accessCount + 1;
          store.put(entry);
        } else {
          // Check storage size before adding new entry
          const currentSize = await this.getCurrentStorageSize();
          if (currentSize + entry.size > this.maxStorageSize) {
            await this.evictLRU(entry.size);
          }
          store.add({ ...entry, cacheKey });
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Check if translation exists in offline cache
   */
  async has(text: string, targetLang: string, sourceLang?: string): Promise<boolean> {
    await this.initialize();
    if (!this.db) return false;

    const cacheKey = this.generateCacheKey(text, targetLang, sourceLang);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('cacheKey');
      const request = index.count(cacheKey);

      request.onsuccess = () => resolve(request.result > 0);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get current storage size
   */
  private async getCurrentStorageSize(): Promise<number> {
    if (!this.db) return 0;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('size');
      const request = index.openCursor();
      let totalSize = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          totalSize += cursor.value.size;
          cursor.continue();
        } else {
          resolve(totalSize);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Evict least recently used entries to free up space
   */
  private async evictLRU(requiredSpace: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('accessCount');
      const request = index.openCursor();
      let freedSpace = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && freedSpace < requiredSpace) {
          const entry = cursor.value as OfflineCacheEntry;
          freedSpace += entry.size;
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all offline cache entries
   */
  async clear(): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Offline cache cleared');
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cache size (number of entries)
   */
  async size(): Promise<number> {
    await this.initialize();
    if (!this.db) return 0;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get offline cache statistics
   */
  async getStats(): Promise<{
    entryCount: number;
    storageSizeMB: number;
    maxStorageMB: number;
    utilizationPercent: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
    topEntries: Array<{
      text: string;
      translation: string;
      accessCount: number;
      age: string;
      sizeMB: number;
    }>;
  }> {
    await this.initialize();
    if (!this.db) {
      return {
        entryCount: 0,
        storageSizeMB: 0,
        maxStorageMB: this.maxStorageSize / (1024 * 1024),
        utilizationPercent: 0,
        oldestEntry: null,
        newestEntry: null,
        topEntries: [],
      };
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = request.result as OfflineCacheEntry[];
        const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
        const now = Date.now();

        const timestamps = entries.map(e => e.timestamp).sort((a, b) => a - b);
        const oldestEntry = timestamps.length > 0 ? new Date(timestamps[0]) : null;
        const newestEntry = timestamps.length > 0 ? new Date(timestamps[timestamps.length - 1]) : null;

        const topEntries = entries
          .sort((a, b) => b.accessCount - a.accessCount)
          .slice(0, 10)
          .map(entry => ({
            text: entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : ''),
            translation: entry.translation.substring(0, 50) + (entry.translation.length > 50 ? '...' : ''),
            accessCount: entry.accessCount,
            age: this.formatAge(now - entry.timestamp),
            sizeMB: entry.size / (1024 * 1024),
          }));

        resolve({
          entryCount: entries.length,
          storageSizeMB: totalSize / (1024 * 1024),
          maxStorageMB: this.maxStorageSize / (1024 * 1024),
          utilizationPercent: (totalSize / this.maxStorageSize) * 100,
          oldestEntry,
          newestEntry,
          topEntries,
        });
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Format age in human-readable format
   */
  private formatAge(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }

  /**
   * Cleanup old entries (older than specified days)
   */
  async cleanupOldEntries(daysOld = 90): Promise<number> {
    await this.initialize();
    if (!this.db) return 0;

    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
      let removed = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const entry = cursor.value as OfflineCacheEntry;
          // Only remove entries with low access count
          if (entry.accessCount < 3) {
            cursor.delete();
            removed++;
          }
          cursor.continue();
        } else {
          console.log(`Cleaned up ${removed} old cache entries`);
          resolve(removed);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Export cache entries for backup
   */
  async exportCache(): Promise<OfflineCacheEntry[]> {
    await this.initialize();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Import cache entries from backup
   */
  async importCache(entries: OfflineCacheEntry[]): Promise<number> {
    await this.initialize();
    if (!this.db) return 0;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      let imported = 0;

      entries.forEach((entry) => {
        const cacheKey = this.generateCacheKey(entry.text, entry.targetLang, entry.sourceLang);
        store.put({ ...entry, cacheKey });
        imported++;
      });

      transaction.oncomplete = () => {
        console.log(`Imported ${imported} cache entries`);
        resolve(imported);
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Sync with in-memory cache
   */
  async syncWithMemoryCache(memoryEntries: TranslationCacheEntry[]): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    for (const entry of memoryEntries) {
      await this.set(entry.text, entry.translation, entry.targetLang, entry.sourceLang);
    }
    console.log(`Synced ${memoryEntries.length} entries from memory to offline cache`);
  }

  /**
   * Get entries by language
   */
  async getEntriesByLanguage(targetLang: string): Promise<OfflineCacheEntry[]> {
    await this.initialize();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('targetLang');
      const request = index.getAll(targetLang);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

// Export singleton instance
let offlineCacheServiceInstance: OfflineCacheService | null = null;

export function getOfflineCacheService(maxStorageMB = 50): OfflineCacheService {
  if (!offlineCacheServiceInstance) {
    offlineCacheServiceInstance = new OfflineCacheService(maxStorageMB);
  }
  return offlineCacheServiceInstance;
}

export function resetOfflineCacheService(): void {
  if (offlineCacheServiceInstance) {
    offlineCacheServiceInstance.close();
    offlineCacheServiceInstance = null;
  }
}
