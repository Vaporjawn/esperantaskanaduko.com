export const EXTENSION_NAME = 'Esperanto Translator';
export const VERSION = '1.0.0';

export const SUPPORTED_LANGUAGES = {
  eo: 'Esperanto',
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
} as const;

export const DEFAULT_TARGET_LANGUAGE = 'eo';

export const TRANSLATION_BATCH_SIZE = 100; // Max texts per API call
export const MAX_TEXT_LENGTH = 5000; // Max characters per text

export const CACHE_LIMITS = {
  MAX_SIZE: 1000,
  MAX_AGE_MS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_DAY: 1000,
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'settings',
  CACHE: 'translationCache',
  HISTORY: 'translationHistory',
} as const;
