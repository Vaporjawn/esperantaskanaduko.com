/**
 * Translation Service Module
 * Handles all translation operations using LibreTranslate API
 * Supports Esperanto translation with caching and error handling
 */

// interface TranslationRequest {
//   text: string;
//   sourceLang: string;
//   targetLang: string;
// }

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

interface TranslationError {
  code: string;
  message: string;
  originalError?: Error;
}

interface CacheEntry {
  translatedText: string;
  timestamp: number;
  sourceLang: string;
  targetLang: string;
}

interface TranslationConfig {
  apiEndpoint: string;
  apiKey?: string;
  timeout: number;
  maxRetries: number;
  cacheEnabled: boolean;
  cacheTTL: number;
}

const DEFAULT_CONFIG: TranslationConfig = {
  apiEndpoint: 'https://libretranslate.com/translate',
  timeout: 10000,
  maxRetries: 3,
  cacheEnabled: true,
  cacheTTL: 86400000, // 24 hours
};

export class TranslationService {
  private config: TranslationConfig;
  private cache: Map<string, CacheEntry>;

  constructor(customConfig?: Partial<TranslationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...customConfig };
    this.cache = new Map();
  }

  async translate(
    text: string,
    sourceLang: string = 'auto',
    targetLang: string = 'eo'
  ): Promise<TranslationResponse> {
    if (!text || text.trim().length === 0) {
      throw {
        code: 'EMPTY_TEXT',
        message: 'Cannot translate empty text',
      } as TranslationError;
    }

    const cacheKey = `${sourceLang}:${targetLang}:${text}`;

    if (this.config.cacheEnabled) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        const isExpired = Date.now() - cached.timestamp > this.config.cacheTTL;
        if (!isExpired) {
          console.log('Translation cache hit:', cacheKey);
          return {
            translatedText: cached.translatedText,
            detectedLanguage: cached.sourceLang,
          };
        }
      }
    }

    const requestBody: Record<string, string> = {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    };

    if (this.config.apiKey) {
      requestBody.api_key = this.config.apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout
    );

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      const translatedText = data.translatedText;

      if (!translatedText) {
        throw new Error('API response missing translatedText field');
      }

      if (this.config.cacheEnabled) {
        this.cache.set(cacheKey, {
          translatedText,
          timestamp: Date.now(),
          sourceLang: data.detectedLanguage?.language || sourceLang,
          targetLang,
        });
      }

      return {
        translatedText,
        detectedLanguage: data.detectedLanguage?.language,
      };
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if ((error as Error).name === 'AbortError') {
        throw {
          code: 'TIMEOUT',
          message: `Translation request timed out after ${this.config.timeout}ms`,
          originalError: error as Error,
        } as TranslationError;
      }

      if (error instanceof TypeError) {
        throw {
          code: 'NETWORK_ERROR',
          message: 'Network error - check internet connection',
          originalError: error,
        } as TranslationError;
      }

      throw {
        code: 'API_ERROR',
        message: (error as Error).message || 'Unknown translation error',
        originalError: error as Error,
      } as TranslationError;
    }
  }

  async batchTranslate(
    texts: string[],
    sourceLang: string = 'auto',
    targetLang: string = 'eo'
  ): Promise<string[]> {
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }

    const validTexts = texts.filter((t) => t && t.trim().length > 0);

    const translationPromises = validTexts.map((text) =>
      this.translate(text, sourceLang, targetLang)
        .then((result) => result.translatedText)
        .catch((error) => {
          console.error('Batch translation error:', error);
          return text;
        })
    );

    const results = await Promise.all(translationPromises);
    return results;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('Translation cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheStats(): {
    size: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    if (this.cache.size === 0) {
      return { size: 0, oldestEntry: null, newestEntry: null };
    }

    const timestamps = Array.from(this.cache.values()).map(
      (entry) => entry.timestamp
    );

    return {
      size: this.cache.size,
      oldestEntry: Math.min(...timestamps),
      newestEntry: Math.max(...timestamps),
    };
  }
}

export const translationService = new TranslationService();
