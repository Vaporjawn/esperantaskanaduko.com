import type { Message, MessageResponse } from '@/types/messages';
import { TranslationService } from '@/services/translationService';

const translationService = new TranslationService();

export const handleMessage = async (
  message: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageResponse) => void
) => {
  try {
    switch (message.type) {
      case 'BATCH_TRANSLATE': {
        const { texts } = message.payload;

        // Detect language from first non-empty text
        const sampleText = texts.find((t: string) => t.trim().length > 0) || '';
        let detectedLanguage: string | undefined;

        if (sampleText) {
          try {
            detectedLanguage = await translationService.detectLanguage(sampleText);
          } catch (error) {
            console.warn('Language detection failed:', error);
            // Continue with translation even if detection fails
          }
        }

        const translations = await translationService.batchTranslate(texts);
        sendResponse({
          success: true,
          data: { translations },
          detectedLanguage,
        });
        break;
      }

      case 'TRANSLATE_SELECTION': {
        const { text } = message.payload;
        const translated = await translationService.translate({
          text,
          targetLang: 'eo',
        });
        sendResponse({
          success: true,
          data: { translatedText: translated.translatedText },
          detectedLanguage: translated.detectedLanguage,
        });
        break;
      }

      case 'GET_STATUS':
        sendResponse({
          success: true,
          data: { status: 'ready' },
        });
        break;

      case 'GET_CACHE_STATS': {
        const memoryStats = translationService.getCacheStats();
        const offlineStats = await translationService.getOfflineCacheStats();
        sendResponse({
          success: true,
          memoryStats,
          offlineStats,
        });
        break;
      }

      case 'CLEAR_CACHE': {
        const { cacheType } = message.payload || {};

        if (cacheType === 'memory') {
          await translationService.clearCache();
        } else if (cacheType === 'offline') {
          await translationService.clearCache(); // Clears both
        } else {
          await translationService.clearCache(); // Clear all
        }

        sendResponse({
          success: true,
        });
        break;
      }

      case 'SYNC_OFFLINE_CACHE': {
        await translationService.syncToOfflineCache();
        const size = await translationService.getOfflineCacheSize();
        sendResponse({
          success: true,
          count: size,
        });
        break;
      }

      case 'CLEANUP_OFFLINE_CACHE': {
        const { daysOld } = message.payload || { daysOld: 90 };
        const removed = await translationService.cleanupOfflineCache(daysOld);
        sendResponse({
          success: true,
          count: removed,
        });
        break;
      }

      case 'EXPORT_OFFLINE_CACHE': {
        const data = await translationService.exportOfflineCache();
        sendResponse({
          success: true,
          data,
        });
        break;
      }

      case 'IMPORT_OFFLINE_CACHE': {
        const { entries } = message.payload;
        const count = await translationService.importOfflineCache(entries);
        sendResponse({
          success: true,
          count,
        });
        break;
      }

      default:
        sendResponse({
          success: false,
          error: 'Unknown message type',
        });
    }
  } catch (error) {
    console.error('Message handler error:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
