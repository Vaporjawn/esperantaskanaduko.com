import { setupContextMenu } from './contextMenu';
import { handleMessage } from './messageHandler';

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Esperanto Translator installed');
  setupContextMenu();
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep message channel open for async responses
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async command => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.id) return;

  switch (command) {
    case 'translate-page':
      chrome.tabs.sendMessage(tab.id, { type: 'TRANSLATE_PAGE' });
      break;
    case 'restore-original':
      chrome.tabs.sendMessage(tab.id, { type: 'RESTORE_PAGE' });
      break;
  }
});

export {};
