/**
 * Google Cloud Translation API provider
 */

import { BaseProvider } from './BaseProvider';
import type { ProviderType, ProviderCapabilities } from '@/types/provider';

export class GoogleProvider extends BaseProvider {
  readonly type: ProviderType = 'google';
  readonly capabilities: ProviderCapabilities = {
    supportsBatchTranslation: true,
    supportsLanguageDetection: true,
    supportsEsperanto: true,
    maxTextLength: 30000,
    maxBatchSize: 128,
  };

  protected requiresApiKey(): boolean {
    return true;
  }

  protected async validateConfig(): Promise<void> {
    if (!this.config?.apiKey) {
      throw this.createError(
        'Google Translate API key is required',
        'MISSING_API_KEY',
        false
      );
    }
  }

  /**
   * Translate a single text using Google Translate API
   */
  async translate(
    text: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<string> {
    this.validateTextLength(text);
    const startTime = Date.now();

    try {
      const url = 'https://translation.googleapis.com/language/translate/v2';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang,
          key: this.config!.apiKey,
          format: 'text',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createError(
          `Google Translate API error: ${response.statusText}`,
          errorData.error?.code || 'API_ERROR',
          response.status >= 500 || response.status === 429
        );
      }

      const data = await response.json();
      const translated = data.data.translations[0].translatedText;

      this.trackSuccess(Date.now() - startTime, text.length);
      return translated;
    } catch (error) {
      this.trackFailure();
      throw error;
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async batchTranslate(
    texts: string[],
    targetLang: string,
    sourceLang?: string
  ): Promise<string[]> {
    this.validateBatchSize(texts);
    const startTime = Date.now();

    try {
      const url = 'https://translation.googleapis.com/language/translate/v2';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          target: targetLang,
          source: sourceLang,
          key: this.config!.apiKey,
          format: 'text',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createError(
          `Google Translate API error: ${response.statusText}`,
          errorData.error?.code || 'API_ERROR',
          response.status >= 500 || response.status === 429
        );
      }

      const data = await response.json();
      const translations = data.data.translations.map(
        (t: { translatedText: string }) => t.translatedText
      );

      const totalChars = texts.reduce((sum, text) => sum + text.length, 0);
      this.trackSuccess(Date.now() - startTime, totalChars);

      return translations;
    } catch (error) {
      this.trackFailure();
      throw error;
    }
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const url = 'https://translation.googleapis.com/language/translate/v2/detect';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          key: this.config!.apiKey,
        }),
      });

      if (!response.ok) {
        throw this.createError(
          `Language detection failed: ${response.statusText}`,
          'DETECTION_ERROR',
          response.status >= 500
        );
      }

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Google language detection error:', error);
      return 'unknown';
    }
  }
}
