/**
 * Glossary Service for managing custom translations
 */

import type {
  GlossaryEntry,
  GlossaryCategory,
  GlossaryData,
  GlossaryMatch,
  GlossaryStats,
} from '@/types/glossary';

const GLOSSARY_STORAGE_KEY = 'glossary';
const GLOSSARY_VERSION = 1;

export class GlossaryService {
  private entries: Map<string, GlossaryEntry>;
  private categories: Map<string, GlossaryCategory>;
  private initialized = false;

  constructor() {
    this.entries = new Map();
    this.categories = new Map();
  }

  /**
   * Initialize glossary from storage
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const result = await chrome.storage.local.get(GLOSSARY_STORAGE_KEY);
      const data: GlossaryData = result[GLOSSARY_STORAGE_KEY];

      if (data) {
        // Load entries
        data.entries.forEach(entry => {
          this.entries.set(entry.id, entry);
        });

        // Load categories
        data.categories.forEach(category => {
          this.categories.set(category.id, category);
        });

        console.log(
          `Glossary initialized with ${this.entries.size} entries and ${this.categories.size} categories`
        );
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize glossary:', error);
    }
  }

  /**
   * Save glossary to storage
   */
  private async save(): Promise<void> {
    try {
      const data: GlossaryData = {
        entries: Array.from(this.entries.values()),
        categories: Array.from(this.categories.values()),
        version: GLOSSARY_VERSION,
      };

      await chrome.storage.local.set({ [GLOSSARY_STORAGE_KEY]: data });
    } catch (error) {
      console.error('Failed to save glossary:', error);
      throw error;
    }
  }

  /**
   * Add a new glossary entry
   */
  async addEntry(
    sourceText: string,
    targetText: string,
    options: {
      sourceLang?: string;
      targetLang?: string;
      caseSensitive?: boolean;
      wholeWord?: boolean;
      category?: string;
      notes?: string;
    } = {}
  ): Promise<GlossaryEntry> {
    const id = this.generateId();
    const now = Date.now();

    const entry: GlossaryEntry = {
      id,
      sourceText: sourceText.trim(),
      targetText: targetText.trim(),
      sourceLang: options.sourceLang,
      targetLang: options.targetLang || 'eo',
      caseSensitive: options.caseSensitive ?? false,
      wholeWord: options.wholeWord ?? true,
      category: options.category,
      notes: options.notes,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
    };

    this.entries.set(id, entry);
    await this.save();

    return entry;
  }

  /**
   * Update an existing glossary entry
   */
  async updateEntry(
    id: string,
    updates: Partial<Omit<GlossaryEntry, 'id' | 'createdAt' | 'usageCount'>>
  ): Promise<GlossaryEntry | null> {
    const entry = this.entries.get(id);
    if (!entry) return null;

    const updated: GlossaryEntry = {
      ...entry,
      ...updates,
      id: entry.id,
      createdAt: entry.createdAt,
      usageCount: entry.usageCount,
      updatedAt: Date.now(),
    };

    this.entries.set(id, updated);
    await this.save();

    return updated;
  }

  /**
   * Delete a glossary entry
   */
  async deleteEntry(id: string): Promise<boolean> {
    const deleted = this.entries.delete(id);
    if (deleted) {
      await this.save();
    }
    return deleted;
  }

  /**
   * Get a glossary entry by ID
   */
  getEntry(id: string): GlossaryEntry | null {
    return this.entries.get(id) || null;
  }

  /**
   * Get all glossary entries
   */
  getAllEntries(): GlossaryEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Search for entries
   */
  searchEntries(query: string): GlossaryEntry[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.entries.values()).filter(
      entry =>
        entry.sourceText.toLowerCase().includes(lowerQuery) ||
        entry.targetText.toLowerCase().includes(lowerQuery) ||
        entry.notes?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Find glossary matches in text
   */
  findMatches(text: string, targetLang = 'eo'): GlossaryMatch[] {
    const matches: GlossaryMatch[] = [];

    for (const entry of this.entries.values()) {
      // Skip if target language doesn't match
      if (entry.targetLang !== targetLang) continue;

      const searchText = entry.caseSensitive ? text : text.toLowerCase();
      const searchPattern = entry.caseSensitive
        ? entry.sourceText
        : entry.sourceText.toLowerCase();

      if (entry.wholeWord) {
        // Match whole words only
        const regex = new RegExp(`\\b${this.escapeRegex(searchPattern)}\\b`, 'g');
        let match;

        while ((match = regex.exec(searchText)) !== null) {
          matches.push({
            entry,
            matchedText: text.substring(match.index, match.index + match[0].length),
            startIndex: match.index,
            endIndex: match.index + match[0].length,
          });
        }
      } else {
        // Match anywhere in text
        let startIndex = 0;
        let foundIndex: number;

        while ((foundIndex = searchText.indexOf(searchPattern, startIndex)) !== -1) {
          matches.push({
            entry,
            matchedText: text.substring(foundIndex, foundIndex + searchPattern.length),
            startIndex: foundIndex,
            endIndex: foundIndex + searchPattern.length,
          });
          startIndex = foundIndex + 1;
        }
      }
    }

    // Sort by start index
    return matches.sort((a, b) => a.startIndex - b.startIndex);
  }

  /**
   * Apply glossary to text
   */
  async applyGlossary(text: string, targetLang = 'eo'): Promise<string> {
    const matches = this.findMatches(text, targetLang);

    if (matches.length === 0) {
      return text;
    }

    // Apply replacements in reverse order to maintain indices
    let result = text;
    const sortedMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);

    for (const match of sortedMatches) {
      result =
        result.substring(0, match.startIndex) +
        match.entry.targetText +
        result.substring(match.endIndex);

      // Increment usage count
      match.entry.usageCount++;
    }

    // Save updated usage counts
    await this.save();

    return result;
  }

  /**
   * Add a category
   */
  async addCategory(
    name: string,
    options: { description?: string; color?: string } = {}
  ): Promise<GlossaryCategory> {
    const id = this.generateId();

    const category: GlossaryCategory = {
      id,
      name,
      description: options.description,
      color: options.color,
      createdAt: Date.now(),
    };

    this.categories.set(id, category);
    await this.save();

    return category;
  }

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    updates: Partial<Omit<GlossaryCategory, 'id' | 'createdAt'>>
  ): Promise<GlossaryCategory | null> {
    const category = this.categories.get(id);
    if (!category) return null;

    const updated: GlossaryCategory = {
      ...category,
      ...updates,
      id: category.id,
      createdAt: category.createdAt,
    };

    this.categories.set(id, updated);
    await this.save();

    return updated;
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<boolean> {
    const deleted = this.categories.delete(id);

    if (deleted) {
      // Remove category from all entries
      for (const entry of this.entries.values()) {
        if (entry.category === id) {
          entry.category = undefined;
        }
      }

      await this.save();
    }

    return deleted;
  }

  /**
   * Get all categories
   */
  getAllCategories(): GlossaryCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Get entries by category
   */
  getEntriesByCategory(categoryId: string): GlossaryEntry[] {
    return Array.from(this.entries.values()).filter(entry => entry.category === categoryId);
  }

  /**
   * Get glossary statistics
   */
  getStats(): GlossaryStats {
    const entries = this.getAllEntries();

    const mostUsed = entries
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10)
      .map(entry => ({
        sourceText: entry.sourceText,
        targetText: entry.targetText,
        usageCount: entry.usageCount,
      }));

    const recent = entries.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

    return {
      totalEntries: this.entries.size,
      totalCategories: this.categories.size,
      mostUsedEntries: mostUsed,
      recentlyAdded: recent,
    };
  }

  /**
   * Export glossary data
   */
  exportData(): GlossaryData {
    return {
      entries: Array.from(this.entries.values()),
      categories: Array.from(this.categories.values()),
      version: GLOSSARY_VERSION,
    };
  }

  /**
   * Import glossary data
   */
  async importData(data: GlossaryData, merge = false): Promise<void> {
    if (!merge) {
      this.entries.clear();
      this.categories.clear();
    }

    // Import categories first
    data.categories.forEach(category => {
      if (!this.categories.has(category.id)) {
        this.categories.set(category.id, category);
      }
    });

    // Import entries
    data.entries.forEach(entry => {
      if (!this.entries.has(entry.id)) {
        this.entries.set(entry.id, entry);
      }
    });

    await this.save();
  }

  /**
   * Clear all glossary data
   */
  async clear(): Promise<void> {
    this.entries.clear();
    this.categories.clear();
    await this.save();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Export singleton instance
let glossaryServiceInstance: GlossaryService | null = null;

export function getGlossaryService(): GlossaryService {
  if (!glossaryServiceInstance) {
    glossaryServiceInstance = new GlossaryService();
  }
  return glossaryServiceInstance;
}
