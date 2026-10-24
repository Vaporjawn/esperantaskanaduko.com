/**
 * Storage utility for managing chrome.storage operations
 * Provides type-safe access to extension storage with proper error handling
 */

import type { ExtensionSettings } from '@/types/settings';

export interface TranslationCacheEntry {
  text: string;
  translation: string;
  sourceLang?: string;
  targetLang: string;
  timestamp: number;
  accessCount: number;
}

export interface StorageData {
  settings: ExtensionSettings;
  translationCache: TranslationCacheEntry[];
  cacheMetadata: {
    size: number;
    lastCleanup: number;
  };
}

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Get data from chrome.storage.sync
   */
  async get<K extends keyof StorageData>(
    keys: K | K[]
  ): Promise<Partial<Pick<StorageData, K>>> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(keys as string | string[], result => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result as Partial<Pick<StorageData, K>>);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Set data in chrome.storage.sync
   */
  async set<K extends keyof StorageData>(
    items: Partial<Pick<StorageData, K>>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get data from chrome.storage.local (for larger data like cache)
   */
  async getLocal<K extends keyof StorageData>(
    keys: K | K[]
  ): Promise<Partial<Pick<StorageData, K>>> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(keys as string | string[], result => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result as Partial<Pick<StorageData, K>>);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Set data in chrome.storage.local (for larger data like cache)
   */
  async setLocal<K extends keyof StorageData>(
    items: Partial<Pick<StorageData, K>>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Remove items from chrome.storage.sync
   */
  async remove(keys: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.remove(keys, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Remove items from chrome.storage.local
   */
  async removeLocal(keys: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.remove(keys, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Clear all data from chrome.storage.sync
   */
  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Clear all data from chrome.storage.local
   */
  async clearLocal(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.clear(() => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get storage bytes in use
   */
  async getBytesInUse(keys?: string | string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.getBytesInUse(keys || null, bytes => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(bytes);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Listen for storage changes
   */
  onChanged(
    callback: (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => void
  ): void {
    chrome.storage.onChanged.addListener(callback);
  }

  /**
   * Remove storage change listener
   */
  removeChangeListener(
    callback: (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => void
  ): void {
    chrome.storage.onChanged.removeListener(callback);
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();

// Utility functions for common operations

/**
 * Get user settings from storage
 */
export async function getSettings(): Promise<ExtensionSettings | null> {
  try {
    const result = await storage.get('settings');
    return result.settings || null;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}

/**
 * Save user settings to storage
 */
export async function saveSettings(settings: ExtensionSettings): Promise<boolean> {
  try {
    await storage.set({ settings });
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

/**
 * Get translation cache from storage
 */
export async function getTranslationCache(): Promise<TranslationCacheEntry[]> {
  try {
    const result = await storage.getLocal('translationCache');
    return result.translationCache || [];
  } catch (error) {
    console.error('Failed to get translation cache:', error);
    return [];
  }
}

/**
 * Save translation cache to storage
 */
export async function saveTranslationCache(
  cache: TranslationCacheEntry[]
): Promise<boolean> {
  try {
    await storage.setLocal({
      translationCache: cache,
      cacheMetadata: {
        size: cache.length,
        lastCleanup: Date.now(),
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to save translation cache:', error);
    return false;
  }
}

/**
 * Clear translation cache
 */
export async function clearTranslationCache(): Promise<boolean> {
  try {
    await storage.removeLocal('translationCache');
    await storage.removeLocal('cacheMetadata');
    return true;
  } catch (error) {
    console.error('Failed to clear translation cache:', error);
    return false;
  }
}

/**
 * Add a domain to whitelist
 */
export async function addToWhitelist(domain: string): Promise<boolean> {
  try {
    const settings = await getSettings();
    if (!settings) return false;

    if (!settings.whitelistedDomains.includes(domain)) {
      settings.whitelistedDomains.push(domain);
      return await saveSettings(settings);
    }
    return true;
  } catch (error) {
    console.error('Failed to add to whitelist:', error);
    return false;
  }
}

/**
 * Remove a domain from whitelist
 */
export async function removeFromWhitelist(domain: string): Promise<boolean> {
  try {
    const settings = await getSettings();
    if (!settings) return false;

    settings.whitelistedDomains = settings.whitelistedDomains.filter(
      d => d !== domain
    );
    return await saveSettings(settings);
  } catch (error) {
    console.error('Failed to remove from whitelist:', error);
    return false;
  }
}

/**
 * Add a domain to blacklist
 */
export async function addToBlacklist(domain: string): Promise<boolean> {
  try {
    const settings = await getSettings();
    if (!settings) return false;

    if (!settings.blacklistedDomains.includes(domain)) {
      settings.blacklistedDomains.push(domain);
      return await saveSettings(settings);
    }
    return true;
  } catch (error) {
    console.error('Failed to add to blacklist:', error);
    return false;
  }
}

/**
 * Remove a domain from blacklist
 */
export async function removeFromBlacklist(domain: string): Promise<boolean> {
  try {
    const settings = await getSettings();
    if (!settings) return false;

    settings.blacklistedDomains = settings.blacklistedDomains.filter(
      d => d !== domain
    );
    return await saveSettings(settings);
  } catch (error) {
    console.error('Failed to remove from blacklist:', error);
    return false;
  }
}

/**
 * Check if current domain is whitelisted or blacklisted
 */
export async function getDomainStatus(
  domain: string
): Promise<'whitelisted' | 'blacklisted' | 'none'> {
  try {
    const settings = await getSettings();
    if (!settings) return 'none';

    if (settings.whitelistedDomains.includes(domain)) {
      return 'whitelisted';
    }
    if (settings.blacklistedDomains.includes(domain)) {
      return 'blacklisted';
    }
    return 'none';
  } catch (error) {
    console.error('Failed to get domain status:', error);
    return 'none';
  }
}
