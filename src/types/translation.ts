export interface TranslationRequest {
  text: string;
  sourceLang?: string;
  targetLang: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

export interface BatchTranslationRequest {
  texts: string[];
  sourceLang?: string;
  targetLang: string;
}

export interface BatchTranslationResponse {
  translations: string[];
  detectedLanguage?: string;
}

export interface TranslationProgress {
  current: number;
  total: number;
  percentage: number;
  status: string;
}
