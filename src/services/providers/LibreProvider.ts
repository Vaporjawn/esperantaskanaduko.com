/**
 * LibreTranslate API provider (open source alternative)
 */

import { BaseProvider } from './BaseProvider';
import type { ProviderType, ProviderCapabilities } from '@/types/provider';

export class LibreProvider extends BaseProvider {
  readonly type: ProviderType = 'libre';
  readonly capabilities: ProviderCapabilities = {
    supportsBatchTranslation: false,
    supportsLanguageDetection: true,
    supportsEsperanto: true,
    maxTextLength: 5000,
    maxBatchSize: 1,
  };

  private readonly defaultEndpoint = 'https://libretranslate.com';

  protected requiresApiKey(): boolean {
    return false; // LibreTranslate can work without API key (public instance)
  }

  protected async validateConfig(): Promise<void> {
    // No validation needed - works without API key
  }

  private getEndpoint(): string {
    return this.config?.apiEndpoint || this.defaultEndpoint;
  }

  /**
   * Translate a single text using LibreTranslate API
   */
  async translate(
    text: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<string> {
    this.validateTextLength(text);
    const startTime = Date.now();

    try {
      const endpoint = this.getEndpoint();
      const url = `${endpoint}/translate`;

      const body: Record<string, string> = {
        q: text,
        target: targetLang,
        format: 'text',
      };

      if (sourceLang) {
        body.source = sourceLang;
      } else {
        body.source = 'auto';
      }

      if (this.config?.apiKey) {
        body.api_key = this.config.apiKey;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createError(
          `LibreTranslate API error: ${response.statusText}`,
          errorData.error || 'API_ERROR',
          response.status >= 500 || response.status === 429
        );
      }

      const data = await response.json();
      const translated = data.translatedText;

      this.trackSuccess(Date.now() - startTime, text.length);
      return translated;
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
      const endpoint = this.getEndpoint();
      const url = `${endpoint}/detect`;

      const body: Record<string, string> = {
        q: text,
      };

      if (this.config?.apiKey) {
        body.api_key = this.config.apiKey;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw this.createError(
          `Language detection failed: ${response.statusText}`,
          'DETECTION_ERROR',
          response.status >= 500
        );
      }

      const data = await response.json();
      // LibreTranslate returns array of detections, get the one with highest confidence
      if (data.length > 0) {
        return data[0].language;
      }
      return 'unknown';
    } catch (error) {
      console.error('LibreTranslate language detection error:', error);
      return 'unknown';
    }
  }
}
