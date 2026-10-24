/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_TRANSLATE_API_KEY: string;
  readonly VITE_TRANSLATION_CACHE_SIZE: string;
  readonly VITE_RATE_LIMIT_PER_MINUTE: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_DEBUG_LOGGING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
