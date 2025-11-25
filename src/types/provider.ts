/**
 * Translation provider types and interfaces
 */

export type ProviderType = 'google' | 'microsoft' | 'libre' | 'deepl';

export interface ProviderConfig {
  type: ProviderType;
  apiKey?: string;
  apiEndpoint?: string;
  enabled: boolean;
  priority: number; // Lower number = higher priority for fallback
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerDay?: number;
  };
}

export interface ProviderCapabilities {
  supportsBatchTranslation: boolean;
  supportsLanguageDetection: boolean;
  supportsEsperanto: boolean;
  maxTextLength: number;
  maxBatchSize: number;
}

export interface ProviderStats {
  successfulRequests: number;
  failedRequests: number;
  lastRequestTime?: number;
  averageResponseTime: number;
  totalCharactersTranslated: number;
}

export interface TranslationProviderError extends Error {
  provider: ProviderType;
  code: string;
  isRetryable: boolean;
}

/**
 * Base interface for all translation providers
 */
export interface ITranslationProvider {
  readonly type: ProviderType;
  readonly capabilities: ProviderCapabilities;

  /**
   * Initialize the provider with configuration
   */
  initialize(config: ProviderConfig): Promise<void>;

  /**
   * Translate a single text
   */
  translate(
    text: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<string>;

  /**
   * Translate multiple texts in batch
   */
  batchTranslate(
    texts: string[],
    targetLang: string,
    sourceLang?: string
  ): Promise<string[]>;

  /**
   * Detect language of text
   */
  detectLanguage(text: string): Promise<string>;

  /**
   * Check if provider is available and configured
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get provider statistics
   */
  getStats(): ProviderStats;

  /**
   * Reset provider statistics
   */
  resetStats(): void;

  /**
   * Test provider connectivity and configuration
   */
  test(): Promise<boolean>;
}

/**
 * Provider manager configuration
 */
export interface ProviderManagerConfig {
  providers: ProviderConfig[];
  enableFallback: boolean;
  fallbackTimeout: number; // Milliseconds before trying fallback
  maxRetries: number;
}
