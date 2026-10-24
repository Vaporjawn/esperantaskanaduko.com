import type {
  TranslationRequest,
  TranslationResponse,
} from '@/types/translation';
import type { ExtensionSettings } from '@/types/settings';
import { getCacheService } from './cacheService';
import { getGlossaryService } from './glossaryService';
import { getOfflineCacheService } from './offlineCacheService';
import { ErrorHandler } from './errorHandler';
import { logger } from '@/utils/logger';

export class TranslationService {
  private cacheService = getCacheService();
  private offlineCacheService = getOfflineCacheService();
  private glossaryService = getGlossaryService();
  private apiKey: string;
  private initialized = false;
  private settings: ExtensionSettings | null = null;
  private offlineCacheEnabled = true;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '';
    this.initializeCache();
    this.initializeGlossary();
    this.loadSettings();
  }

  /**
   * Initialize glossary service
   */
  private async initializeGlossary(): Promise<void> {
    try {
      await this.glossaryService.initialize();
    } catch (error) {
      const detailedError = ErrorHandler.handleConfigError('initialization_failed', {
        operation: 'initialize_glossary',
        service: 'glossaryService',
        error: error instanceof Error ? error.message : String(error),
      });
      logger.error('Failed to initialize glossary', detailedError);
    }
  }

  /**
   * Load settings from chrome.storage
   */
  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get('settings');
      if (result.settings) {
        this.settings = result.settings;
        // Update API key from settings if available
        if (this.settings?.apiKey) {
          this.apiKey = this.settings.apiKey;
        }
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleStorageError(errorObj, {
        operation: 'load_settings',
        storageType: 'chrome.storage.sync',
        key: 'settings',
      });
      logger.error('Failed to load settings', detailedError);
    }
  }

  /**
   * Get quality-based API parameters
   */
  private getQualityParams(): { model?: string; format?: string } {
    if (!this.settings) {
      return { format: 'text' };
    }

    switch (this.settings.translationQuality) {
      case 'fast':
        // Fast mode: use base model, minimal processing
        return {
          model: 'base',
          format: 'text',
        };
      case 'accurate':
        // Accurate mode: use best model available
        return {
          model: 'nmt',
          format: 'html', // Preserve formatting
        };
      case 'balanced':
      default:
        // Balanced mode: standard settings
        return {
          format: 'text',
        };
    }
  }

  /**
   * Initialize cache services (memory and offline)
   */
  private async initializeCache(): Promise<void> {
    if (!this.initialized) {
      try {
        await this.cacheService.initialize();
        this.cacheService.enableAutoSave(60000); // Auto-save every minute
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        const detailedError = ErrorHandler.handleCacheError(errorObj, {
          operation: 'cache_initialization',
          cacheType: 'memory',
        });
        logger.error('Failed to initialize memory cache', detailedError);
        // Continue even if cache fails - translations will work without cache
      }

      // Initialize offline cache if enabled
      if (this.offlineCacheEnabled) {
        try {
          await this.offlineCacheService.initialize();
          logger.info('Offline cache initialized successfully');
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          const detailedError = ErrorHandler.handleCacheError(errorObj, {
            operation: 'cache_initialization',
            cacheType: 'offline',
          });
          logger.error('Failed to initialize offline cache', detailedError);
          this.offlineCacheEnabled = false;
        }
      }

      this.initialized = true;
    }
  }

  /**
   * Translate a single text
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    // Validate input
    if (!request.text || request.text.trim() === '') {
      throw ErrorHandler.handleValidationError(
        'text',
        request.text,
        'Text cannot be empty',
        {
          operation: 'translate',
          targetLang: request.targetLang,
          sourceLang: request.sourceLang || 'auto',
        }
      );
    }

    if (!request.targetLang) {
      throw ErrorHandler.handleValidationError(
        'targetLang',
        request.targetLang,
        'Target language is required',
        {
          operation: 'translate',
          text: request.text.substring(0, 50),
        }
      );
    }

    // Check in-memory cache first (fastest)
    try {
      const cachedTranslation = this.cacheService.get(
        request.text,
        request.targetLang,
        request.sourceLang
      );

      if (cachedTranslation) {
        return {
          translatedText: cachedTranslation,
        };
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleCacheError(errorObj, {
        operation: 'cache_read',
        text: request.text.substring(0, 50),
        targetLang: request.targetLang,
        sourceLang: request.sourceLang || 'auto',
        cacheType: 'memory',
      });
      logger.error('Memory cache read failed', detailedError);
      // Continue without cache
    }

    // Check offline cache (slower, but available offline)
    if (this.offlineCacheEnabled) {
      try {
        const offlineCached = await this.offlineCacheService.get(
          request.text,
          request.targetLang,
          request.sourceLang
        );

        if (offlineCached) {
          // Promote to memory cache for faster access
          try {
            this.cacheService.set(
              request.text,
              offlineCached,
              request.targetLang,
              request.sourceLang
            );
          } catch (cacheError) {
            const errorObj = cacheError instanceof Error ? cacheError : new Error(String(cacheError));
            const detailedError = ErrorHandler.handleCacheError(errorObj, {
              operation: 'cache_write',
              cacheType: 'memory',
              text: request.text.substring(0, 50),
            });
            logger.error('Failed to promote offline cache to memory', detailedError);
            // Continue anyway since we have the translation
          }

          return {
            translatedText: offlineCached,
          };
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        const detailedError = ErrorHandler.handleCacheError(errorObj, {
          operation: 'cache_read',
          text: request.text.substring(0, 50),
          targetLang: request.targetLang,
          sourceLang: request.sourceLang || 'auto',
          cacheType: 'offline',
        });
        logger.error('Offline cache read failed', detailedError);
        // Continue without offline cache
      }
    }

    // Check API key
    if (!this.apiKey) {
      throw ErrorHandler.handleConfigError('missing_api_key', {
        operation: 'translate',
        text: request.text.substring(0, 50),
        targetLang: request.targetLang,
        sourceLang: request.sourceLang || 'auto',
      });
    }

    try {
      const url = 'https://translation.googleapis.com/language/translate/v2';
      const qualityParams = this.getQualityParams();

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: request.text,
            target: request.targetLang,
            source: request.sourceLang,
            key: this.apiKey,
            ...qualityParams,
          }),
        });
      } catch (fetchError) {
        const errorObj = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
        throw ErrorHandler.handleNetworkError(errorObj, {
          operation: 'api_request',
          url,
          method: 'POST',
          text: request.text.substring(0, 50),
          targetLang: request.targetLang,
          sourceLang: request.sourceLang || 'auto',
          apiEndpoint: 'Google Translate API',
        });
      }

      if (!response.ok) {
        throw await ErrorHandler.handleAPIError(response, {
          operation: 'translate',
          url,
          statusCode: response.status,
          statusText: response.statusText,
          text: request.text.substring(0, 50),
          targetLang: request.targetLang,
          sourceLang: request.sourceLang || 'auto',
          apiEndpoint: 'Google Translate API',
          apiKey: this.apiKey ? `...${this.apiKey.slice(-4)}` : 'missing',
        });
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const errorObj = parseError instanceof Error ? parseError : new Error(String(parseError));
        throw ErrorHandler.handleParsingError(errorObj, 'json', {
          operation: 'parse_api_response',
          url,
          statusCode: response.status,
          text: request.text.substring(0, 50),
        });
      }

      // Validate response structure
      if (!data?.data?.translations?.[0]?.translatedText) {
        throw ErrorHandler.handleParsingError(
          new Error('Invalid response structure from API'),
          'json',
          {
            operation: 'validate_api_response',
            url,
            responseData: JSON.stringify(data).substring(0, 200),
          }
        );
      }

      let translated = data.data.translations[0].translatedText;
      const detectedLanguage = data.data.translations[0].detectedSourceLanguage;

      // Apply glossary to translation
      try {
        translated = await this.glossaryService.applyGlossary(translated, request.targetLang);
      } catch (glossaryError) {
        logger.error('Glossary application failed', {
          error: glossaryError,
          operation: 'apply_glossary',
          text: translated.substring(0, 50),
          targetLang: request.targetLang,
        });
        // Continue with un-glossaried translation
      }

      // Cache result in memory (with glossary applied)
      try {
        this.cacheService.set(
          request.text,
          translated,
          request.targetLang,
          request.sourceLang || detectedLanguage
        );
      } catch (cacheError) {
        const errorObj = cacheError instanceof Error ? cacheError : new Error(String(cacheError));
        const detailedError = ErrorHandler.handleCacheError(errorObj, {
          operation: 'cache_write',
          cacheType: 'memory',
          text: request.text.substring(0, 50),
          translatedText: translated.substring(0, 50),
          targetLang: request.targetLang,
        });
        logger.error('Memory cache write failed', detailedError);
        // Continue anyway since we have the translation
      }

      // Also cache in offline storage for offline access
      if (this.offlineCacheEnabled) {
        try {
          await this.offlineCacheService.set(
            request.text,
            translated,
            request.targetLang,
            request.sourceLang || detectedLanguage
          );
        } catch (cacheError) {
          const errorObj = cacheError instanceof Error ? cacheError : new Error(String(cacheError));
          const detailedError = ErrorHandler.handleCacheError(errorObj, {
            operation: 'cache_write',
            cacheType: 'offline',
            text: request.text.substring(0, 50),
            translatedText: translated.substring(0, 50),
            targetLang: request.targetLang,
          });
          logger.error('Offline cache write failed', detailedError);
          // Continue anyway since we have the translation
        }
      }

      return {
        translatedText: translated,
        detectedLanguage,
      };
    } catch (error) {
      // Re-throw if already a detailed error
      if ((error as any)?.detailedError) {
        throw error;
      }

      // Handle unexpected errors
      logger.error('Translation error', {
        error,
        operation: 'translate',
        text: request.text.substring(0, 50),
        targetLang: request.targetLang,
        sourceLang: request.sourceLang || 'auto',
      });
      throw error;
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async batchTranslate(texts: string[], targetLang = 'eo'): Promise<string[]> {
    // Validate input
    if (!texts || texts.length === 0) {
      throw ErrorHandler.handleValidationError(
        'texts',
        texts,
        'Text array cannot be empty',
        {
          operation: 'batchTranslate',
          targetLang,
        }
      );
    }

    if (!targetLang) {
      throw ErrorHandler.handleValidationError(
        'targetLang',
        targetLang,
        'Target language is required',
        {
          operation: 'batchTranslate',
          textCount: texts.length,
        }
      );
    }

    // Check cache for all texts
    const cached: (string | null)[] = texts.map(text => {
      try {
        return this.cacheService.get(text, targetLang);
      } catch (error) {
        logger.error('Cache read failed during batch operation', {
          error,
          operation: 'batch_cache_read',
          text: text.substring(0, 50),
        });
        return null;
      }
    });

    // If all are cached, return immediately
    if (cached.every(item => item !== null)) {
      return cached as string[];
    }

    // Check API key
    if (!this.apiKey) {
      throw ErrorHandler.handleConfigError('missing_api_key', {
        operation: 'batchTranslate',
        textCount: texts.length,
        targetLang,
      });
    }

    try {
      const url = 'https://translation.googleapis.com/language/translate/v2';
      const qualityParams = this.getQualityParams();

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: texts,
            target: targetLang,
            key: this.apiKey,
            ...qualityParams,
          }),
        });
      } catch (fetchError) {
        const errorObj = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
        throw ErrorHandler.handleNetworkError(errorObj, {
          operation: 'batch_api_request',
          url,
          method: 'POST',
          textCount: texts.length,
          targetLang,
          apiEndpoint: 'Google Translate API',
        });
      }

      if (!response.ok) {
        throw await ErrorHandler.handleAPIError(response, {
          operation: 'batchTranslate',
          url,
          statusCode: response.status,
          statusText: response.statusText,
          textCount: texts.length,
          targetLang,
          apiEndpoint: 'Google Translate API',
          apiKey: this.apiKey ? `...${this.apiKey.slice(-4)}` : 'missing',
        });
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const errorObj = parseError instanceof Error ? parseError : new Error(String(parseError));
        throw ErrorHandler.handleParsingError(errorObj, 'json', {
          operation: 'parse_batch_response',
          url,
          statusCode: response.status,
          textCount: texts.length,
        });
      }

      // Validate response structure
      if (!data?.data?.translations || !Array.isArray(data.data.translations)) {
        throw ErrorHandler.handleParsingError(
          new Error('Invalid batch response structure from API'),
          'json',
          {
            operation: 'validate_batch_response',
            url,
            textCount: texts.length,
            receivedLength: data?.data?.translations?.length || 0,
            responseData: JSON.stringify(data).substring(0, 200),
          }
        );
      }

      let translations = data.data.translations.map(
        (t: { translatedText: string }) => t.translatedText
      );

      // Apply glossary to all translations
      try {
        translations = await Promise.all(
          translations.map((text: string) => this.glossaryService.applyGlossary(text, targetLang))
        );
      } catch (glossaryError) {
        logger.error('Batch glossary application failed', {
          error: glossaryError,
          operation: 'batch_apply_glossary',
          count: translations.length,
          targetLang,
        });
        // Continue with un-glossaried translations
      }

      // Cache all results in memory (with glossary applied)
      texts.forEach((text, index) => {
        try {
          this.cacheService.set(text, translations[index], targetLang);
        } catch (cacheError) {
          logger.error('Batch cache write failed', {
            error: cacheError,
            operation: 'batch_cache_write',
            index,
            text: text.substring(0, 50),
          });
          // Continue caching other items
        }
      });

      // Cache in offline storage for offline access
      if (this.offlineCacheEnabled) {
        try {
          await Promise.all(
            texts.map((text, index) =>
              this.offlineCacheService.set(text, translations[index], targetLang)
            )
          );
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          const detailedError = ErrorHandler.handleCacheError(errorObj, {
            operation: 'batch_cache_write',
            cacheType: 'offline',
            textCount: texts.length,
            targetLang,
          });
          logger.error('Failed to cache batch translations in offline storage', detailedError);
        }
      }

      return translations;
    } catch (error) {
      // Re-throw if already a detailed error
      if ((error as any)?.detailedError) {
        throw error;
      }

      logger.error('Batch translation error', {
        error,
        operation: 'batchTranslate',
        textCount: texts.length,
        targetLang,
      });

      // Return original texts as fallback
      return texts;
    }
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    // Validate input
    if (!text || text.trim() === '') {
      throw ErrorHandler.handleValidationError(
        'text',
        text,
        'Text cannot be empty for language detection',
        {
          operation: 'detectLanguage',
        }
      );
    }

    // Check API key
    if (!this.apiKey) {
      throw ErrorHandler.handleConfigError('missing_api_key', {
        operation: 'detectLanguage',
        text: text.substring(0, 50),
      });
    }

    try {
      const url = 'https://translation.googleapis.com/language/translate/v2/detect';

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            key: this.apiKey,
          }),
        });
      } catch (fetchError) {
        const errorObj = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
        throw ErrorHandler.handleNetworkError(errorObj, {
          operation: 'detect_language_request',
          url,
          method: 'POST',
          text: text.substring(0, 50),
          apiEndpoint: 'Google Translate API',
        });
      }

      if (!response.ok) {
        throw await ErrorHandler.handleAPIError(response, {
          operation: 'detectLanguage',
          url,
          statusCode: response.status,
          statusText: response.statusText,
          text: text.substring(0, 50),
          apiEndpoint: 'Google Translate API',
          apiKey: this.apiKey ? `...${this.apiKey.slice(-4)}` : 'missing',
        });
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const errorObj = parseError instanceof Error ? parseError : new Error(String(parseError));
        throw ErrorHandler.handleParsingError(errorObj, 'json', {
          operation: 'parse_detect_response',
          url,
          statusCode: response.status,
          text: text.substring(0, 50),
        });
      }

      // Validate response structure
      if (!data?.data?.detections?.[0]?.[0]?.language) {
        throw ErrorHandler.handleParsingError(
          new Error('Invalid language detection response structure'),
          'json',
          {
            operation: 'validate_detect_response',
            url,
            text: text.substring(0, 50),
            responseData: JSON.stringify(data).substring(0, 200),
          }
        );
      }

      return data.data.detections[0][0].language;
    } catch (error) {
      // Re-throw if already a detailed error
      if ((error as any)?.detailedError) {
        throw error;
      }

      logger.error('Language detection error', {
        error,
        operation: 'detectLanguage',
        text: text.substring(0, 50),
      });

      return 'unknown';
    }
  }

  /**
   * Clear translation cache (both memory and offline)
   */
  async clearCache(): Promise<void> {
    await this.cacheService.clear();

    if (this.offlineCacheEnabled) {
      try {
        await this.offlineCacheService.clear();
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        const detailedError = ErrorHandler.handleCacheError(errorObj, {
          operation: 'cache_clear',
          cacheType: 'offline',
        });
        logger.error('Failed to clear offline cache', detailedError);
      }
    }
  }

  /**
   * Get cache size (memory only)
   */
  getCacheSize(): number {
    return this.cacheService.size();
  }

  /**
   * Get offline cache size
   */
  async getOfflineCacheSize(): Promise<number> {
    if (!this.offlineCacheEnabled) return 0;

    try {
      return await this.offlineCacheService.size();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleCacheError(errorObj, {
        operation: 'cache_size',
        cacheType: 'offline',
      });
      logger.error('Failed to get offline cache size', detailedError);
      return 0;
    }
  }

  /**
   * Get cache statistics (memory)
   */
  getCacheStats() {
    return this.cacheService.getStats();
  }

  /**
   * Get offline cache statistics
   */
  async getOfflineCacheStats() {
    if (!this.offlineCacheEnabled) {
      return null;
    }

    try {
      return await this.offlineCacheService.getStats();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleCacheError(errorObj, {
        operation: 'cache_stats',
        cacheType: 'offline',
      });
      logger.error('Failed to get offline cache stats', detailedError);
      return null;
    }
  }

  /**
   * Persist cache to storage
   */
  async persistCache(): Promise<void> {
    await this.cacheService.persist();
  }

  /**
   * Sync memory cache to offline cache
   */
  async syncToOfflineCache(): Promise<void> {
    if (!this.offlineCacheEnabled) return;

    try {
      const memoryEntries = this.cacheService.getAllEntries();
      await this.offlineCacheService.syncWithMemoryCache(memoryEntries);
      logger.info('Successfully synced memory cache to offline storage', {
        operation: 'cache_sync',
        entryCount: memoryEntries.length,
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleCacheError(errorObj, {
        operation: 'cache_sync',
        cacheType: 'offline',
      });
      logger.error('Failed to sync to offline cache', detailedError);
    }
  }

  /**
   * Cleanup old offline cache entries
   */
  async cleanupOfflineCache(daysOld = 90): Promise<number> {
    if (!this.offlineCacheEnabled) return 0;

    try {
      return await this.offlineCacheService.cleanupOldEntries(daysOld);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleCacheError(errorObj, {
        operation: 'cache_cleanup',
        cacheType: 'offline',
        daysOld,
      });
      logger.error('Failed to cleanup offline cache', detailedError);
      return 0;
    }
  }

  /**
   * Export offline cache for backup
   */
  async exportOfflineCache() {
    if (!this.offlineCacheEnabled) return [];

    try {
      return await this.offlineCacheService.exportCache();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleCacheError(errorObj, {
        operation: 'cache_export',
        cacheType: 'offline',
      });
      logger.error('Failed to export offline cache', detailedError);
      return [];
    }
  }

  /**
   * Import offline cache from backup
   */
  async importOfflineCache(entries: any[]): Promise<number> {
    if (!this.offlineCacheEnabled) return 0;

    try {
      return await this.offlineCacheService.importCache(entries);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const detailedError = ErrorHandler.handleCacheError(errorObj, {
        operation: 'cache_import',
        cacheType: 'offline',
        entryCount: entries.length,
      });
      logger.error('Failed to import offline cache', detailedError);
      return 0;
    }
  }

  /**
   * Enable/disable offline cache
   */
  setOfflineCacheEnabled(enabled: boolean): void {
    this.offlineCacheEnabled = enabled;
    if (enabled && this.initialized) {
      this.offlineCacheService.initialize().catch(error => {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        const detailedError = ErrorHandler.handleCacheError(errorObj, {
          operation: 'cache_initialization',
          cacheType: 'offline',
        });
        logger.error('Failed to initialize offline cache', detailedError);
        this.offlineCacheEnabled = false;
      });
    }
  }

  /**
   * Check if offline cache is enabled and available
   */
  isOfflineCacheAvailable(): boolean {
    return this.offlineCacheEnabled && 'indexedDB' in window;
  }
}
