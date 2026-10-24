/**
 * Microsoft Translator API provider
 */

import { BaseProvider } from './BaseProvider';
import type { ProviderType, ProviderCapabilities } from '@/types/provider';

export class MicrosoftProvider extends BaseProvider {
  readonly type: ProviderType = 'microsoft';
  readonly capabilities: ProviderCapabilities = {
    supportsBatchTranslation: true,
    supportsLanguageDetection: true,
    supportsEsperanto: false, // Microsoft Translator doesn't officially support Esperanto
    maxTextLength: 50000,
    maxBatchSize: 100,
  };

  private readonly defaultEndpoint = 'https://api.cognitive.microsofttranslator.com';

  protected requiresApiKey(): boolean {
    return true;
  }

  protected async validateConfig(): Promise<void> {
    if (!this.config?.apiKey) {
      throw this.createError(
        'Microsoft Translator API key is required',
        'MISSING_API_KEY',
        false
      );
    }
  }

  private getEndpoint(): string {
    return this.config?.apiEndpoint || this.defaultEndpoint;
  }

  /**
   * Translate a single text using Microsoft Translator API
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
      const params = new URLSearchParams({
        'api-version': '3.0',
        to: targetLang,
      });

      if (sourceLang) {
        params.append('from', sourceLang);
      }

      const url = `${endpoint}/translate?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config!.apiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text }]),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createError(
          `Microsoft Translator API error: ${response.statusText}`,
          errorData.error?.code || 'API_ERROR',
          response.status >= 500 || response.status === 429
        );
      }

      const data = await response.json();
      const translated = data[0].translations[0].text;

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
      const endpoint = this.getEndpoint();
      const params = new URLSearchParams({
        'api-version': '3.0',
        to: targetLang,
      });

      if (sourceLang) {
        params.append('from', sourceLang);
      }

      const url = `${endpoint}/translate?${params.toString()}`;
      const body = texts.map(text => ({ text }));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config!.apiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createError(
          `Microsoft Translator API error: ${response.statusText}`,
          errorData.error?.code || 'API_ERROR',
          response.status >= 500 || response.status === 429
        );
      }

      const data = await response.json();
      const translations = data.map((item: { translations: Array<{ text: string }> }) => item.translations[0].text);

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
      const endpoint = this.getEndpoint();
      const url = `${endpoint}/detect?api-version=3.0`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config!.apiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text }]),
      });

      if (!response.ok) {
        throw this.createError(
          `Language detection failed: ${response.statusText}`,
          'DETECTION_ERROR',
          response.status >= 500
        );
      }

      const data = await response.json();
      return data[0].language;
    } catch (error) {
      console.error('Microsoft language detection error:', error);
      return 'unknown';
    }
  }
}
