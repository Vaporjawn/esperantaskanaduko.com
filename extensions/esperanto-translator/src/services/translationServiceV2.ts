/**
 * Enhanced Translation Service with Multi-Provider Support
 * This is the new version that uses ProviderManager for multiple translation providers
 */

import type {
  TranslationRequest,
  TranslationResponse,
} from '@/types/translation';
import type { ExtensionSettings } from '@/types/settings';
import type { ProviderConfig, ProviderManagerConfig, ProviderType } from '@/types/provider';
import { getCacheService } from './cacheService';
import { getGlossaryService } from './glossaryService';
import { ProviderManager } from './providers/ProviderManager';

export class TranslationServiceV2 {
  private cacheService = getCacheService();
  private glossaryService = getGlossaryService();
  private providerManager: ProviderManager | null = null;
  private initialized = false;
  private settings: ExtensionSettings | null = null;

  constructor() {
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
      console.error('Failed to initialize glossary:', error);
    }
  }

  /**
   * Load settings from chrome.storage and initialize provider manager
   */
  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get('settings');
      if (result.settings) {
        this.settings = result.settings;
        await this.initializeProviderManager();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  /**
   * Initialize provider manager with settings
   */
  private async initializeProviderManager(): Promise<void> {
    if (!this.settings) {
      return;
    }

    // Get provider configurations
    const providers = this.getProviderConfigs();

    // Create provider manager config
    const managerConfig: ProviderManagerConfig = {
      providers,
      enableFallback: this.settings.enableProviderFallback ?? true,
      fallbackTimeout: this.settings.fallbackTimeout ?? 10000,
      maxRetries: 3,
    };

    this.providerManager = new ProviderManager(managerConfig);
  }

  /**
   * Get provider configurations from settings
   */
  private getProviderConfigs(): ProviderConfig[] {
    if (!this.settings) {
      return [];
    }

    // If multi-provider settings exist, use them
    if (this.settings.providers && this.settings.providers.length > 0) {
      return this.settings.providers;
    }

    // Otherwise, create config from legacy settings
    const primaryProvider = this.settings.apiProvider || 'google';
    const apiKey = this.settings.apiKey || import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '';

    return [
      {
        type: primaryProvider,
        apiKey: primaryProvider === 'google' ? apiKey : undefined,
        enabled: true,
        priority: 1,
      },
      // Add LibreTranslate as fallback (doesn't require API key)
      {
        type: 'libre' as ProviderType,
        enabled: true,
        priority: 2,
      },
    ];
  }

  /**
   * Initialize cache service
   */
  private async initializeCache(): Promise<void> {
    if (!this.initialized) {
      await this.cacheService.initialize();
      this.cacheService.enableAutoSave(60000); // Auto-save every minute
      this.initialized = true;
    }
  }

  /**
   * Ensure provider manager is initialized
   */
  private async ensureProviderManager(): Promise<void> {
    if (!this.providerManager) {
      await this.loadSettings();
      if (!this.providerManager) {
        throw new Error('Failed to initialize translation providers');
      }
    }
  }

  /**
   * Translate a single text with multi-provider support
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    await this.ensureProviderManager();

    // Check cache first
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

    try {
      // Use provider manager for translation with automatic fallback
      let translated = await this.providerManager!.translate(
        request.text,
        request.targetLang,
        request.sourceLang
      );

      // Detect language if not provided
      let detectedLanguage = request.sourceLang;
      if (!detectedLanguage) {
        detectedLanguage = await this.providerManager!.detectLanguage(request.text);
      }

      // Apply glossary to translation
      translated = await this.glossaryService.applyGlossary(translated, request.targetLang);

      // Cache result (with glossary applied)
      this.cacheService.set(
        request.text,
        translated,
        request.targetLang,
        request.sourceLang || detectedLanguage
      );

      return {
        translatedText: translated,
        detectedLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  /**
   * Translate multiple texts in batch with multi-provider support
   */
  async batchTranslate(texts: string[], targetLang = 'eo'): Promise<string[]> {
    await this.ensureProviderManager();

    // Check cache for all texts
    const cached: (string | null)[] = texts.map(text => {
      return this.cacheService.get(text, targetLang);
    });

    // If all are cached, return immediately
    if (cached.every(item => item !== null)) {
      return cached as string[];
    }

    try {
      // Use provider manager for batch translation with automatic fallback
      let translations = await this.providerManager!.batchTranslate(
        texts,
        targetLang
      );

      // Apply glossary to all translations
      translations = await Promise.all(
        translations.map((text: string) => this.glossaryService.applyGlossary(text, targetLang))
      );

      // Cache all results (with glossary applied)
      texts.forEach((text, index) => {
        this.cacheService.set(text, translations[index], targetLang);
      });

      return translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      // Return original texts as fallback
      return texts;
    }
  }

  /**
   * Detect language of text with multi-provider support
   */
  async detectLanguage(text: string): Promise<string> {
    await this.ensureProviderManager();

    try {
      return await this.providerManager!.detectLanguage(text);
    } catch (error) {
      console.error('Language detection error:', error);
      return 'unknown';
    }
  }

  /**
   * Get provider statistics
   */
  getProviderStats() {
    if (!this.providerManager) {
      return {};
    }
    return this.providerManager.getAllStats();
  }

  /**
   * Test a specific provider
   */
  async testProvider(type: ProviderType): Promise<boolean> {
    await this.ensureProviderManager();
    return this.providerManager!.testProvider(type);
  }

  /**
   * Test all providers
   */
  async testAllProviders(): Promise<Record<string, boolean>> {
    await this.ensureProviderManager();
    return this.providerManager!.testAllProviders();
  }

  /**
   * Update provider configuration
   */
  async updateProviderConfig(config: ProviderConfig): Promise<void> {
    await this.ensureProviderManager();
    await this.providerManager!.updateProviderConfig(config);

    // Save to settings
    if (this.settings) {
      if (!this.settings.providers) {
        this.settings.providers = [];
      }

      const index = this.settings.providers.findIndex((p: ProviderConfig) => p.type === config.type);
      if (index >= 0) {
        this.settings.providers[index] = config;
      } else {
        this.settings.providers.push(config);
      }

      await chrome.storage.sync.set({ settings: this.settings });
    }
  }

  /**
   * Clear translation cache
   */
  async clearCache(): Promise<void> {
    await this.cacheService.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cacheService.size();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheService.getStats();
  }

  /**
   * Persist cache to storage
   */
  async persistCache(): Promise<void> {
    await this.cacheService.persist();
  }
}

// Singleton instance
let translationServiceV2Instance: TranslationServiceV2 | null = null;

/**
 * Get singleton instance of enhanced translation service
 */
export function getTranslationServiceV2(): TranslationServiceV2 {
  if (!translationServiceV2Instance) {
    translationServiceV2Instance = new TranslationServiceV2();
  }
  return translationServiceV2Instance;
}
