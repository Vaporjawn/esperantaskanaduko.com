import { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { TranslationProgress } from '@/types/translation';
import { sendToContentScript } from '@/utils/messaging';

export type TranslationStatus = 'idle' | 'ready' | 'translating' | 'error';

interface TranslationContextType {
  status: TranslationStatus;
  detectedLanguage: string | null;
  isLoading: boolean;
  isTranslated: boolean;
  progress: TranslationProgress | null;
  translatePage: () => Promise<void>;
  restorePage: () => Promise<void>;
  toggleTranslation: () => Promise<void>;
}

export const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<TranslationStatus>('ready');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);
  const [progress, setProgress] = useState<TranslationProgress | null>(null);

  // Load translation state when popup opens
  useEffect(() => {
    const loadTranslationState = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id) return;

        setCurrentTabId(tab.id);

        // Get translation state from storage
        const key = `translation_state_${tab.id}`;
        const result = await chrome.storage.local.get(key);
        if (result[key]) {
          setIsTranslated(result[key].isTranslated);
          setDetectedLanguage(result[key].detectedLanguage || null);
        }
      } catch (error) {
        console.error('Failed to load translation state:', error);
      }
    };

    loadTranslationState();

    // Listen for progress updates from content script
    const handleMessage = (message: { type: string; payload?: TranslationProgress }) => {
      if (message.type === 'TRANSLATION_PROGRESS' && message.payload) {
        setProgress(message.payload);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Save translation state whenever it changes
  const saveTranslationState = useCallback(async (translated: boolean, language: string | null = null) => {
    if (!currentTabId) return;

    const key = `translation_state_${currentTabId}`;
    await chrome.storage.local.set({
      [key]: {
        isTranslated: translated,
        detectedLanguage: language || detectedLanguage,
      },
    });
  }, [currentTabId, detectedLanguage]);

  const translatePage = useCallback(async () => {
    setIsLoading(true);
    setStatus('translating');
    setProgress({ current: 0, total: 100, percentage: 0, status: 'Starting translation...' });

    try {
      // Use the robust messaging utility
      const response = await sendToContentScript<{ success: boolean; detectedLanguage?: string; error?: string }>(
        { type: 'TRANSLATE_PAGE' },
        { timeout: 10000, retries: 2, autoInject: true }
      );

      if (response.success) {
        const language = response.detectedLanguage;
        setDetectedLanguage(language || null);
        setIsTranslated(true);
        setStatus('ready');
        setProgress(null); // Clear progress when complete
        await saveTranslationState(true, language);
      } else {
        setStatus('error');
        setProgress(null);
        throw new Error(response.error || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setStatus('error');
      setProgress(null);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        alert(`Translation error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [saveTranslationState]);

  const restorePage = useCallback(async () => {
    setIsLoading(true);

    try {
      // Use the robust messaging utility
      await sendToContentScript(
        { type: 'RESTORE_PAGE' },
        { timeout: 5000, retries: 2, autoInject: true }
      );

      setIsTranslated(false);
      setStatus('ready');
      await saveTranslationState(false);
    } catch (error) {
      console.error('Restore error:', error);
      setStatus('error');
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        alert(`Restore error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [saveTranslationState]);

  const toggleTranslation = useCallback(async () => {
    setIsLoading(true);

    try {
      // Use the robust messaging utility
      const response = await sendToContentScript<{ success: boolean; data?: { isTranslated: boolean }; error?: string }>(
        { type: 'TOGGLE_TRANSLATION' },
        { timeout: 5000, retries: 2, autoInject: true }
      );

      if (response.success) {
        const newState = !isTranslated;
        setIsTranslated(newState);
        setStatus('ready');
        await saveTranslationState(newState);
      } else {
        setStatus('error');
        throw new Error(response.error || 'Translation failed');
      }
    } catch (error) {
      console.error('Toggle translation error:', error);
      setStatus('error');
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        alert(`Translation error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isTranslated, saveTranslationState]);

  return (
    <TranslationContext.Provider
      value={{
        status,
        detectedLanguage,
        isLoading,
        isTranslated,
        progress,
        translatePage,
        restorePage,
        toggleTranslation,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
