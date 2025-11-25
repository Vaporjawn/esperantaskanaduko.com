/**
 * Base abstract class for translation providers
 */

import type {
  ITranslationProvider,
  ProviderType,
  ProviderConfig,
  ProviderCapabilities,
  ProviderStats,
  TranslationProviderError,
} from '@/types/provider';

export abstract class BaseProvider implements ITranslationProvider {
  abstract readonly type: ProviderType;
  abstract readonly capabilities: ProviderCapabilities;

  protected config: ProviderConfig | null = null;
  protected stats: ProviderStats = {
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    totalCharactersTranslated: 0,
  };

  private responseTimes: number[] = [];

  /**
   * Initialize the provider with configuration
   */
  async initialize(config: ProviderConfig): Promise<void> {
    this.config = config;
    await this.validateConfig();
  }

  /**
   * Validate provider configuration
   */
  protected abstract validateConfig(): Promise<void>;

  /**
   * Translate a single text
   */
  abstract translate(
    text: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<string>;

  /**
   * Translate multiple texts in batch
   */
  async batchTranslate(
    texts: string[],
    targetLang: string,
    sourceLang?: string
  ): Promise<string[]> {
    // Default implementation: translate one by one
    // Providers that support batch translation should override this
    if (this.capabilities.supportsBatchTranslation) {
      throw new Error('Batch translation not implemented for this provider');
    }

    const translations: string[] = [];
    for (const text of texts) {
      const translated = await this.translate(text, targetLang, sourceLang);
      translations.push(translated);
    }
    return translations;
  }

  /**
   * Detect language of text
   */
  abstract detectLanguage(text: string): Promise<string>;

  /**
   * Check if provider is available and configured
   */
  async isAvailable(): Promise<boolean> {
    if (!this.config || !this.config.enabled) {
      return false;
    }

    // Check if API key is required and present
    if (this.requiresApiKey() && !this.config.apiKey) {
      return false;
    }

    return true;
  }

  /**
   * Get provider statistics
   */
  getStats(): ProviderStats {
    return { ...this.stats };
  }

  /**
   * Reset provider statistics
   */
  resetStats(): void {
    this.stats = {
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalCharactersTranslated: 0,
    };
    this.responseTimes = [];
  }

  /**
   * Test provider connectivity and configuration
   */
  async test(): Promise<boolean> {
    try {
      const testText = 'Hello';
      await this.translate(testText, 'eo', 'en');
      return true;
    } catch (error) {
      console.error(`Provider ${this.type} test failed:`, error);
      return false;
    }
  }

  /**
   * Check if provider requires API key
   */
  protected abstract requiresApiKey(): boolean;

  /**
   * Track successful request
   */
  protected trackSuccess(responseTime: number, charactersTranslated: number): void {
    this.stats.successfulRequests++;
    this.stats.lastRequestTime = Date.now();
    this.stats.totalCharactersTranslated += charactersTranslated;

    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }

    this.stats.averageResponseTime =
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  /**
   * Track failed request
   */
  protected trackFailure(): void {
    this.stats.failedRequests++;
  }

  /**
   * Create provider-specific error
   */
  protected createError(
    message: string,
    code: string,
    isRetryable = false
  ): TranslationProviderError {
    const error = new Error(message) as TranslationProviderError;
    error.provider = this.type;
    error.code = code;
    error.isRetryable = isRetryable;
    return error;
  }

  /**
   * Validate text length
   */
  protected validateTextLength(text: string): void {
    if (text.length > this.capabilities.maxTextLength) {
      throw this.createError(
        `Text exceeds maximum length of ${this.capabilities.maxTextLength} characters`,
        'TEXT_TOO_LONG',
        false
      );
    }
  }

  /**
   * Validate batch size
   */
  protected validateBatchSize(texts: string[]): void {
    if (texts.length > this.capabilities.maxBatchSize) {
      throw this.createError(
        `Batch size exceeds maximum of ${this.capabilities.maxBatchSize}`,
        'BATCH_TOO_LARGE',
        false
      );
    }
  }
}
