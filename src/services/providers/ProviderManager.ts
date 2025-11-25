/**
 * Provider Manager - handles multiple translation providers with fallback
 */

import type {
  ITranslationProvider,
  ProviderType,
  ProviderConfig,
  ProviderManagerConfig,
  TranslationProviderError,
} from '@/types/provider';
import { GoogleProvider } from './GoogleProvider';
import { MicrosoftProvider } from './MicrosoftProvider';
import { LibreProvider } from './LibreProvider';

export class ProviderManager {
  private providers = new Map<ProviderType, ITranslationProvider>();
  private config: ProviderManagerConfig;
  private primaryProvider: ProviderType | null = null;

  constructor(config: ProviderManagerConfig) {
    this.config = config;
    this.initializeProviders();
  }

  /**
   * Initialize all configured providers
   */
  private initializeProviders(): void {
    // Register available providers
    this.registerProvider(new GoogleProvider());
    this.registerProvider(new MicrosoftProvider());
    this.registerProvider(new LibreProvider());

    // Configure providers
    this.config.providers.forEach(providerConfig => {
      const provider = this.providers.get(providerConfig.type);
      if (provider) {
        provider.initialize(providerConfig).catch(error => {
          console.error(`Failed to initialize provider ${providerConfig.type}:`, error);
        });
      }
    });

    // Set primary provider
    this.setPrimaryProvider();
  }

  /**
   * Register a provider
   */
  private registerProvider(provider: ITranslationProvider): void {
    this.providers.set(provider.type, provider);
  }

  /**
   * Set the primary provider based on priority
   */
  private setPrimaryProvider(): void {
    const enabledProviders = this.config.providers
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority);

    if (enabledProviders.length > 0) {
      this.primaryProvider = enabledProviders[0].type;
    }
  }

  /**
   * Get the primary provider instance
   */
  private async getPrimaryProvider(): Promise<ITranslationProvider | null> {
    if (!this.primaryProvider) {
      return null;
    }

    const provider = this.providers.get(this.primaryProvider);
    if (provider && (await provider.isAvailable())) {
      return provider;
    }

    return null;
  }

  /**
   * Get fallback providers in priority order
   */
  private async getFallbackProviders(): Promise<ITranslationProvider[]> {
    const fallbacks: ITranslationProvider[] = [];

    const sortedConfigs = this.config.providers
      .filter(p => p.enabled && p.type !== this.primaryProvider)
      .sort((a, b) => a.priority - b.priority);

    for (const config of sortedConfigs) {
      const provider = this.providers.get(config.type);
      if (provider && (await provider.isAvailable())) {
        fallbacks.push(provider);
      }
    }

    return fallbacks;
  }

  /**
   * Translate text with automatic fallback
   */
  async translate(
    text: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<string> {
    const primaryProvider = await this.getPrimaryProvider();

    if (!primaryProvider) {
      throw new Error('No translation provider available');
    }

    try {
      return await this.translateWithTimeout(
        primaryProvider,
        text,
        targetLang,
        sourceLang
      );
    } catch (error) {
      console.warn(`Primary provider ${primaryProvider.type} failed:`, error);

      if (this.config.enableFallback) {
        return await this.tryFallback(text, targetLang, sourceLang, error as Error);
      }

      throw error;
    }
  }

  /**
   * Translate with timeout
   */
  private async translateWithTimeout(
    provider: ITranslationProvider,
    text: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<string> {
    return Promise.race([
      provider.translate(text, targetLang, sourceLang),
      this.createTimeout(this.config.fallbackTimeout),
    ]);
  }

  /**
   * Create timeout promise
   */
  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Translation timeout')), ms);
    });
  }

  /**
   * Try fallback providers
   */
  private async tryFallback(
    text: string,
    targetLang: string,
    sourceLang: string | undefined,
    originalError: Error
  ): Promise<string> {
    const fallbackProviders = await this.getFallbackProviders();

    if (fallbackProviders.length === 0) {
      throw originalError;
    }

    for (const provider of fallbackProviders) {
      try {
        console.log(`Trying fallback provider: ${provider.type}`);
        return await this.translateWithTimeout(provider, text, targetLang, sourceLang);
      } catch (error) {
        console.warn(`Fallback provider ${provider.type} failed:`, error);

        const providerError = error as TranslationProviderError;
        if (!providerError.isRetryable) {
          break;
        }
      }
    }

    throw originalError;
  }

  /**
   * Batch translate with automatic fallback
   */
  async batchTranslate(
    texts: string[],
    targetLang: string,
    sourceLang?: string
  ): Promise<string[]> {
    const primaryProvider = await this.getPrimaryProvider();

    if (!primaryProvider) {
      throw new Error('No translation provider available');
    }

    try {
      if (primaryProvider.capabilities.supportsBatchTranslation) {
        return await primaryProvider.batchTranslate(texts, targetLang, sourceLang);
      } else {
        // Fall back to individual translations
        const translations: string[] = [];
        for (const text of texts) {
          const translated = await this.translate(text, targetLang, sourceLang);
          translations.push(translated);
        }
        return translations;
      }
    } catch (error) {
      console.warn(`Batch translation failed with ${primaryProvider.type}:`, error);

      if (this.config.enableFallback) {
        // Try individual translations with fallback
        const translations: string[] = [];
        for (const text of texts) {
          const translated = await this.translate(text, targetLang, sourceLang);
          translations.push(translated);
        }
        return translations;
      }

      throw error;
    }
  }

  /**
   * Detect language with automatic fallback
   */
  async detectLanguage(text: string): Promise<string> {
    const primaryProvider = await this.getPrimaryProvider();

    if (!primaryProvider) {
      return 'unknown';
    }

    try {
      return await primaryProvider.detectLanguage(text);
    } catch (error) {
      console.warn(`Language detection failed with ${primaryProvider.type}:`, error);

      if (this.config.enableFallback) {
        const fallbackProviders = await this.getFallbackProviders();
        for (const provider of fallbackProviders) {
          try {
            return await provider.detectLanguage(text);
          } catch (error) {
            console.warn(`Fallback detection failed with ${provider.type}:`, error);
          }
        }
      }

      return 'unknown';
    }
  }

  /**
   * Get provider by type
   */
  getProvider(type: ProviderType): ITranslationProvider | undefined {
    return this.providers.get(type);
  }

  /**
   * Get all provider statistics
   */
  getAllStats(): Record<string, ReturnType<ITranslationProvider['getStats']>> {
    const stats: Record<string, ReturnType<ITranslationProvider['getStats']>> = {};
    this.providers.forEach((provider, type) => {
      stats[type] = provider.getStats();
    });
    return stats;
  }

  /**
   * Test a specific provider
   */
  async testProvider(type: ProviderType): Promise<boolean> {
    const provider = this.providers.get(type);
    if (!provider) {
      return false;
    }
    return provider.test();
  }

  /**
   * Test all providers
   */
  async testAllProviders(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [type, provider] of this.providers) {
      results[type] = await provider.test();
    }

    return results;
  }

  /**
   * Update provider configuration
   */
  async updateProviderConfig(config: ProviderConfig): Promise<void> {
    const provider = this.providers.get(config.type);
    if (provider) {
      await provider.initialize(config);

      // Update config
      const index = this.config.providers.findIndex(p => p.type === config.type);
      if (index >= 0) {
        this.config.providers[index] = config;
      } else {
        this.config.providers.push(config);
      }

      // Re-evaluate primary provider
      this.setPrimaryProvider();
    }
  }

  /**
   * Get current provider manager configuration
   */
  getConfig(): ProviderManagerConfig {
    return { ...this.config };
  }
}
