import type { ProviderConfig } from './provider';

export interface ExtensionSettings {
  // General
  autoTranslate: boolean;
  showNotifications: boolean;

  // Translation
  translationQuality: 'fast' | 'balanced' | 'accurate';
  preserveFormatting: boolean;
  translateDynamicContent: boolean;

  // Domains
  whitelistedDomains: string[];
  blacklistedDomains: string[];

  // UI
  tooltipPosition: 'top' | 'bottom' | 'auto';
  theme: 'light' | 'dark' | 'auto';

  // Cache
  enableCache: boolean;
  cacheSize: number;
  enableOfflineCache: boolean;
  offlineCacheSize: number; // in MB
  autoSyncOfflineCache: boolean;

  // API - Legacy (for backward compatibility)
  apiProvider: 'google' | 'microsoft' | 'libre';
  apiKey?: string;

  // Multi-Provider Configuration
  providers?: ProviderConfig[];
  enableProviderFallback?: boolean;
  fallbackTimeout?: number; // Milliseconds
}
