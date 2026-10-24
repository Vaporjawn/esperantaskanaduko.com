/**
 * Service for managing translation history
 * Provides CRUD operations and analytics for translation history entries
 */

import type { TranslationHistoryEntry, TranslationHistoryStats } from '@/types/history';

const HISTORY_STORAGE_KEY = 'translationHistory';
const MAX_HISTORY_ENTRIES = 1000; // Limit history to prevent storage issues

class TranslationHistoryService {
  private static instance: TranslationHistoryService;

  private constructor() {}

  static getInstance(): TranslationHistoryService {
    if (!TranslationHistoryService.instance) {
      TranslationHistoryService.instance = new TranslationHistoryService();
    }
    return TranslationHistoryService.instance;
  }

  /**
   * Generate unique ID for history entry
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add a new translation to history
   */
  async addTranslation(
    originalText: string,
    translatedText: string,
    sourceLang: string,
    targetLang: string,
    translationType: 'page' | 'selection',
    url?: string,
    pageTitle?: string
  ): Promise<TranslationHistoryEntry> {
    try {
      const history = await this.getHistory();

      const entry: TranslationHistoryEntry = {
        id: this.generateId(),
        originalText: originalText.substring(0, 5000), // Limit text length
        translatedText: translatedText.substring(0, 5000),
        sourceLang,
        targetLang,
        timestamp: Date.now(),
        url,
        pageTitle,
        translationType,
        charCount: originalText.length,
      };

      // Add to beginning of array (newest first)
      history.unshift(entry);

      // Limit history size
      if (history.length > MAX_HISTORY_ENTRIES) {
        history.splice(MAX_HISTORY_ENTRIES);
      }

      await this.saveHistory(history);
      return entry;
    } catch (error) {
      console.error('Failed to add translation to history:', error);
      throw error;
    }
  }

  /**
   * Get all translation history
   */
  async getHistory(): Promise<TranslationHistoryEntry[]> {
    try {
      const result = await chrome.storage.local.get(HISTORY_STORAGE_KEY);
      return result[HISTORY_STORAGE_KEY] || [];
    } catch (error) {
      console.error('Failed to get translation history:', error);
      return [];
    }
  }

  /**
   * Get a specific history entry by ID
   */
  async getHistoryEntry(id: string): Promise<TranslationHistoryEntry | null> {
    try {
      const history = await this.getHistory();
      return history.find(entry => entry.id === id) || null;
    } catch (error) {
      console.error('Failed to get history entry:', error);
      return null;
    }
  }

  /**
   * Save history to storage
   */
  private async saveHistory(history: TranslationHistoryEntry[]): Promise<void> {
    try {
      await chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: history });
    } catch (error) {
      console.error('Failed to save translation history:', error);
      throw error;
    }
  }

  /**
   * Delete a specific history entry
   */
  async deleteHistoryEntry(id: string): Promise<boolean> {
    try {
      const history = await this.getHistory();
      const filteredHistory = history.filter(entry => entry.id !== id);

      if (filteredHistory.length === history.length) {
        return false; // Entry not found
      }

      await this.saveHistory(filteredHistory);
      return true;
    } catch (error) {
      console.error('Failed to delete history entry:', error);
      return false;
    }
  }

  /**
   * Delete multiple history entries
   */
  async deleteMultipleEntries(ids: string[]): Promise<number> {
    try {
      const history = await this.getHistory();
      const idSet = new Set(ids);
      const filteredHistory = history.filter(entry => !idSet.has(entry.id));
      const deletedCount = history.length - filteredHistory.length;

      await this.saveHistory(filteredHistory);
      return deletedCount;
    } catch (error) {
      console.error('Failed to delete multiple history entries:', error);
      return 0;
    }
  }

  /**
   * Clear all translation history
   */
  async clearHistory(): Promise<boolean> {
    try {
      await chrome.storage.local.remove(HISTORY_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear translation history:', error);
      return false;
    }
  }

  /**
   * Search history by query
   */
  async searchHistory(query: string): Promise<TranslationHistoryEntry[]> {
    try {
      const history = await this.getHistory();
      const lowerQuery = query.toLowerCase();

      return history.filter(entry =>
        entry.originalText.toLowerCase().includes(lowerQuery) ||
        entry.translatedText.toLowerCase().includes(lowerQuery) ||
        entry.pageTitle?.toLowerCase().includes(lowerQuery) ||
        entry.url?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Failed to search history:', error);
      return [];
    }
  }

  /**
   * Filter history by date range
   */
  async filterByDateRange(range: 'today' | 'week' | 'month' | 'all'): Promise<TranslationHistoryEntry[]> {
    try {
      const history = await this.getHistory();
      const now = Date.now();

      if (range === 'all') {
        return history;
      }

      let cutoffTime: number;
      switch (range) {
        case 'today':
          cutoffTime = now - 24 * 60 * 60 * 1000; // 24 hours
          break;
        case 'week':
          cutoffTime = now - 7 * 24 * 60 * 60 * 1000; // 7 days
          break;
        case 'month':
          cutoffTime = now - 30 * 24 * 60 * 60 * 1000; // 30 days
          break;
        default:
          return history;
      }

      return history.filter(entry => entry.timestamp >= cutoffTime);
    } catch (error) {
      console.error('Failed to filter history by date:', error);
      return [];
    }
  }

  /**
   * Filter history by translation type
   */
  async filterByType(type: 'page' | 'selection' | 'all'): Promise<TranslationHistoryEntry[]> {
    try {
      const history = await this.getHistory();

      if (type === 'all') {
        return history;
      }

      return history.filter(entry => entry.translationType === type);
    } catch (error) {
      console.error('Failed to filter history by type:', error);
      return [];
    }
  }

  /**
   * Get translation history statistics
   */
  async getStatistics(): Promise<TranslationHistoryStats> {
    try {
      const history = await this.getHistory();

      const stats: TranslationHistoryStats = {
        totalTranslations: history.length,
        pageTranslations: history.filter(e => e.translationType === 'page').length,
        selectionTranslations: history.filter(e => e.translationType === 'selection').length,
        totalCharacters: history.reduce((sum, e) => sum + e.charCount, 0),
        mostTranslatedSite: null,
        averageLength: 0,
      };

      if (history.length > 0) {
        stats.averageLength = Math.round(stats.totalCharacters / history.length);

        // Find most translated site
        const siteCounts = new Map<string, number>();
        history.forEach(entry => {
          if (entry.url) {
            try {
              const hostname = new URL(entry.url).hostname;
              siteCounts.set(hostname, (siteCounts.get(hostname) || 0) + 1);
            } catch {
              // Invalid URL, skip
            }
          }
        });

        if (siteCounts.size > 0) {
          const [mostTranslatedSite] = [...siteCounts.entries()].reduce((a, b) =>
            a[1] > b[1] ? a : b
          );
          stats.mostTranslatedSite = mostTranslatedSite;
        }
      }

      return stats;
    } catch (error) {
      console.error('Failed to get history statistics:', error);
      return {
        totalTranslations: 0,
        pageTranslations: 0,
        selectionTranslations: 0,
        totalCharacters: 0,
        mostTranslatedSite: null,
        averageLength: 0,
      };
    }
  }

  /**
   * Export history as JSON
   */
  async exportHistory(): Promise<string> {
    try {
      const history = await this.getHistory();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('Failed to export history:', error);
      throw error;
    }
  }

  /**
   * Import history from JSON
   */
  async importHistory(jsonData: string): Promise<number> {
    try {
      const importedHistory: TranslationHistoryEntry[] = JSON.parse(jsonData);

      if (!Array.isArray(importedHistory)) {
        throw new Error('Invalid history data format');
      }

      // Validate entries
      const validEntries = importedHistory.filter(entry =>
        entry.id &&
        entry.originalText &&
        entry.translatedText &&
        entry.sourceLang &&
        entry.targetLang &&
        entry.timestamp &&
        entry.translationType
      );

      if (validEntries.length === 0) {
        throw new Error('No valid history entries found');
      }

      // Merge with existing history
      const existingHistory = await this.getHistory();
      const existingIds = new Set(existingHistory.map(e => e.id));

      // Only add entries that don't already exist
      const newEntries = validEntries.filter(e => !existingIds.has(e.id));

      const mergedHistory = [...newEntries, ...existingHistory];

      // Limit total entries
      if (mergedHistory.length > MAX_HISTORY_ENTRIES) {
        mergedHistory.splice(MAX_HISTORY_ENTRIES);
      }

      await this.saveHistory(mergedHistory);
      return newEntries.length;
    } catch (error) {
      console.error('Failed to import history:', error);
      throw error;
    }
  }

  /**
   * Get history entries for a specific URL
   */
  async getHistoryByUrl(url: string): Promise<TranslationHistoryEntry[]> {
    try {
      const history = await this.getHistory();
      return history.filter(entry => entry.url === url);
    } catch (error) {
      console.error('Failed to get history by URL:', error);
      return [];
    }
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<{ entriesCount: number; estimatedBytes: number }> {
    try {
      const history = await this.getHistory();
      const estimatedBytes = await chrome.storage.local.getBytesInUse(HISTORY_STORAGE_KEY);

      return {
        entriesCount: history.length,
        estimatedBytes,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { entriesCount: 0, estimatedBytes: 0 };
    }
  }
}

// Export singleton instance
export const translationHistoryService = TranslationHistoryService.getInstance();
