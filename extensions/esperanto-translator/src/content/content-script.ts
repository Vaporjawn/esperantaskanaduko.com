import { PageTranslator } from './pageTranslator';
import { SelectionTranslator } from './selectionTranslator';
import type { Message } from '@/types/messages';
import type { ExtensionSettings } from '@/types/settings';

const translator = new PageTranslator();
const selectionTranslator = new SelectionTranslator();

// Check for auto-translation on page load
const checkAutoTranslate = async () => {
  try {
    const result = await chrome.storage.sync.get('settings');
    const settings: ExtensionSettings = result.settings;

    if (!settings || !settings.autoTranslate) {
      return;
    }

    const currentDomain = window.location.hostname;

    // Check if domain is blacklisted
    const isBlacklisted = settings.blacklistedDomains.some(domain => {
      if (domain.startsWith('*.')) {
        const pattern = domain.substring(2);
        return currentDomain.endsWith(pattern);
      }
      return currentDomain === domain;
    });

    if (isBlacklisted) {
      console.log('Domain is blacklisted, skipping auto-translation');
      return;
    }

    // Check if domain is whitelisted
    const isWhitelisted = settings.whitelistedDomains.some(domain => {
      if (domain.startsWith('*.')) {
        const pattern = domain.substring(2);
        return currentDomain.endsWith(pattern);
      }
      return currentDomain === domain;
    });

    if (isWhitelisted) {
      console.log('Auto-translating whitelisted domain:', currentDomain);
      setTimeout(() => {
        translator.translatePage();
      }, 1000); // Small delay to ensure page is fully loaded
    }
  } catch (error) {
    console.error('Auto-translate check failed:', error);
  }
};

// Run auto-translate check on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAutoTranslate);
} else {
  checkAutoTranslate();
}

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  handleContentMessage(message, sendResponse);
  return true; // Keep message channel open
});

const handleContentMessage = async (message: Message, sendResponse: (response: unknown) => void) => {
  try {
    switch (message.type) {
      case 'PING':
        // Simple ping-pong to check if content script is ready
        sendResponse({ success: true, ready: true });
        break;

      case 'TRANSLATE_PAGE':
        await translator.translatePage();
        sendResponse({
          success: true,
          detectedLanguage: translator.getDetectedLanguage(),
        });
        break;

      case 'RESTORE_PAGE':
        translator.restoreOriginal();
        sendResponse({ success: true });
        break;

      case 'TOGGLE_TRANSLATION': {
        await translator.toggleTranslation();
        const translationState = translator.getTranslationState();
        sendResponse({
          success: true,
          data: { isTranslated: translationState },
          detectedLanguage: translator.getDetectedLanguage(),
        });
        break;
      }

      case 'TRANSLATE_SELECTION': {
        const { text } = message.payload;
        await selectionTranslator.showTranslation(text);
        sendResponse({ success: true });
        break;
      }

      case 'GET_TRANSLATED_CONTENT': {
        const { html, isTranslated } = translator.getPageHTML();
        sendResponse({
          success: true,
          translatedHtml: isTranslated ? html : null,
          originalHtml: !isTranslated ? html : null,
          pageTitle: document.title,
          isTranslated,
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
    console.error('Content script error:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

console.log('Esperanto Translator content script loaded');
