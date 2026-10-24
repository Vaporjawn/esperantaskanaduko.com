/**
 * Type definitions for translation history
 */

export interface TranslationHistoryEntry {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  url?: string;
  pageTitle?: string;
  translationType: 'page' | 'selection';
  charCount: number;
}

export interface TranslationHistoryFilters {
  searchQuery: string;
  translationType: 'all' | 'page' | 'selection';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sourceLang: string | 'all';
  sortBy: 'newest' | 'oldest' | 'longest' | 'shortest';
}

export interface TranslationHistoryStats {
  totalTranslations: number;
  pageTranslations: number;
  selectionTranslations: number;
  totalCharacters: number;
  mostTranslatedSite: string | null;
  averageLength: number;
}
