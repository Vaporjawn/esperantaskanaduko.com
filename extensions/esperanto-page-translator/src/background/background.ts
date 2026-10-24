/**
 * Background Service Worker for Esperanto Page Translator
 * Handles extension lifecycle, context menus, and message routing
 */

interface TranslationMessage {
  action: 'translate' | 'revert';
  tabId?: number;
}

interface TranslationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Esperanto Page Translator installed');

  // Create context menu for translation
  chrome.contextMenus.create({
    id: 'translate-page',
    title: 'Translate Page to Esperanto',
    contexts: ['page'],
  });

  chrome.contextMenus.create({
    id: 'revert-translation',
    title: 'Revert to Original Text',
    contexts: ['page'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'translate-page') {
    chrome.tabs.sendMessage(tab.id, { action: 'translate' });
  } else if (info.menuItemId === 'revert-translation') {
    chrome.tabs.sendMessage(tab.id, { action: 'revert' });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener(
  (
    message: TranslationMessage,
    sender,
    sendResponse: (response: TranslationResponse) => void
  ) => {
    if (message.action === 'translate') {
      handleTranslateRequest(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    } else if (message.action === 'revert') {
      handleRevertRequest(message, sender, sendResponse);
      return true;
    }
  }
);

async function handleTranslateRequest(
  message: TranslationMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: TranslationResponse) => void
) {
  const tabId = message.tabId || sender.tab?.id;

  if (!tabId) {
    sendResponse({ success: false, error: 'No active tab found' });
    return;
  }

  try {
    // Inject content script if not already present
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-script.js'],
    });

    // Send translate message to content script
    chrome.tabs.sendMessage(tabId, { action: 'translate' }, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          success: false,
          error: chrome.runtime.lastError.message,
        });
      } else {
        sendResponse(response || { success: true });
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function handleRevertRequest(
  message: TranslationMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: TranslationResponse) => void
) {
  const tabId = message.tabId || sender.tab?.id;

  if (!tabId) {
    sendResponse({ success: false, error: 'No active tab found' });
    return;
  }

  try {
    // Send revert message to content script
    chrome.tabs.sendMessage(tabId, { action: 'revert' }, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          success: false,
          error: chrome.runtime.lastError.message,
        });
      } else {
        sendResponse(response || { success: true });
      }
    });
  } catch (error) {
    console.error('Revert error:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

console.log('Background service worker loaded');
