/**
 * Custom glossary types for user-defined translations
 */

export interface GlossaryEntry {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang?: string;
  targetLang: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  category?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  usageCount: number;
}

export interface GlossaryCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: number;
}

export interface GlossaryData {
  entries: GlossaryEntry[];
  categories: GlossaryCategory[];
  version: number;
}

export interface GlossaryMatch {
  entry: GlossaryEntry;
  matchedText: string;
  startIndex: number;
  endIndex: number;
}

export interface GlossaryStats {
  totalEntries: number;
  totalCategories: number;
  mostUsedEntries: Array<{
    sourceText: string;
    targetText: string;
    usageCount: number;
  }>;
  recentlyAdded: GlossaryEntry[];
}
