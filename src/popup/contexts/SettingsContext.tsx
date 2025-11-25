import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ExtensionSettings } from '@/types/settings';

const defaultSettings: ExtensionSettings = {
  autoTranslate: false,
  showNotifications: true,
  translationQuality: 'balanced',
  preserveFormatting: true,
  translateDynamicContent: true,
  whitelistedDomains: [],
  blacklistedDomains: [],
  tooltipPosition: 'auto',
  theme: 'light',
  enableCache: true,
  cacheSize: 1000,
  enableOfflineCache: true,
  offlineCacheSize: 50,
  autoSyncOfflineCache: false,
  apiProvider: 'google',
  apiKey: '',
};

interface SettingsContextType {
  settings: ExtensionSettings;
  updateSettings: (updates: Partial<ExtensionSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  addToWhitelist: (domain: string) => Promise<void>;
  removeFromWhitelist: (domain: string) => Promise<void>;
  addToBlacklist: (domain: string) => Promise<void>;
  removeFromBlacklist: (domain: string) => Promise<void>;
  isDomainWhitelisted: (domain: string) => boolean;
  isDomainBlacklisted: (domain: string) => boolean;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);

  // Load settings from chrome.storage on mount
  useEffect(() => {
    chrome.storage.sync.get('settings', result => {
      if (result.settings) {
        setSettings({ ...defaultSettings, ...result.settings });
      }
    });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<ExtensionSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // Save to chrome.storage
    await chrome.storage.sync.set({ settings: newSettings });
  }, [settings]);

  const resetSettings = useCallback(async () => {
    setSettings(defaultSettings);
    await chrome.storage.sync.set({ settings: defaultSettings });
  }, []);

  const addToWhitelist = useCallback(async (domain: string) => {
    const newWhitelist = [...settings.whitelistedDomains];
    if (!newWhitelist.includes(domain)) {
      newWhitelist.push(domain);
      await updateSettings({ whitelistedDomains: newWhitelist });
    }
  }, [settings.whitelistedDomains, updateSettings]);

  const removeFromWhitelist = useCallback(async (domain: string) => {
    const newWhitelist = settings.whitelistedDomains.filter(d => d !== domain);
    await updateSettings({ whitelistedDomains: newWhitelist });
  }, [settings.whitelistedDomains, updateSettings]);

  const addToBlacklist = useCallback(async (domain: string) => {
    const newBlacklist = [...settings.blacklistedDomains];
    if (!newBlacklist.includes(domain)) {
      newBlacklist.push(domain);
      await updateSettings({ blacklistedDomains: newBlacklist });
    }
  }, [settings.blacklistedDomains, updateSettings]);

  const removeFromBlacklist = useCallback(async (domain: string) => {
    const newBlacklist = settings.blacklistedDomains.filter(d => d !== domain);
    await updateSettings({ blacklistedDomains: newBlacklist });
  }, [settings.blacklistedDomains, updateSettings]);

  const isDomainWhitelisted = useCallback((domain: string) => {
    return settings.whitelistedDomains.includes(domain);
  }, [settings.whitelistedDomains]);

  const isDomainBlacklisted = useCallback((domain: string) => {
    return settings.blacklistedDomains.includes(domain);
  }, [settings.blacklistedDomains]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        addToWhitelist,
        removeFromWhitelist,
        addToBlacklist,
        removeFromBlacklist,
        isDomainWhitelisted,
        isDomainBlacklisted,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
