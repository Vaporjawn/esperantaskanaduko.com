/**
 * Content Script for Esperanto Page Translator
 * Handles DOM traversal, text extraction, and translation application
 */

import { translationService } from '../services/TranslationService';

interface TextSnapshot {
  node: Text;
  originalText: string;
}

interface ContentMessage {
  action: 'translate' | 'revert';
}

interface ContentResponse {
  success: boolean;
  message?: string;
  error?: string;
}

let textSnapshots: TextSnapshot[] = [];
let isTranslated = false;

/**
 * Check if a text node is visible and should be translated
 */
function isTextNodeVisible(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return false;

  // Skip script, style, and other non-visible elements
  const tagName = parent.tagName.toLowerCase();
  if (['script', 'style', 'noscript', 'iframe', 'svg'].includes(tagName)) {
    return false;
  }

  // Check if element is visible
  const style = window.getComputedStyle(parent);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  ) {
    return false;
  }

  // Check if text content is meaningful (not just whitespace)
  const text = node.textContent || '';
  if (text.trim().length === 0) {
    return false;
  }

  return true;
}

/**
 * Extract all visible text nodes from the DOM
 */
function extractTextNodes(): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        return isTextNodeVisible(node as Text)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let currentNode = walker.currentNode as Text;
  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = walker.nextNode() as Text;
  }

  return textNodes;
}

/**
 * Create snapshots of original text before translation
 */
function createTextSnapshots(): void {
  textSnapshots = [];
  const textNodes = extractTextNodes();

  for (const node of textNodes) {
    textSnapshots.push({
      node,
      originalText: node.textContent || '',
    });
  }

  console.log(`Created ${textSnapshots.length} text snapshots`);
}

/**
 * Translate all text nodes to Esperanto
 */
async function translatePage(): Promise<void> {
  if (isTranslated) {
    console.log('Page already translated');
    return;
  }

  try {
    // Create snapshots of original text
    createTextSnapshots();

    if (textSnapshots.length === 0) {
      console.log('No text found to translate');
      return;
    }

    // Extract text for translation
    const textsToTranslate = textSnapshots.map((snapshot) =>
      snapshot.originalText.trim()
    );

    console.log(`Translating ${textsToTranslate.length} text segments...`);

    // Batch translate all text
    const translatedTexts = await translationService.batchTranslate(
      textsToTranslate,
      'auto',
      'eo'
    );

    // Apply translations to DOM
    for (let i = 0; i < textSnapshots.length; i++) {
      const snapshot = textSnapshots[i];
      const translatedText = translatedTexts[i];

      if (translatedText && snapshot.node.parentElement) {
        snapshot.node.textContent = translatedText;
      }
    }

    isTranslated = true;
    console.log('Translation complete');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

/**
 * Revert page to original text
 */
function revertTranslation(): void {
  if (!isTranslated) {
    console.log('Page is not translated');
    return;
  }

  try {
    for (const snapshot of textSnapshots) {
      if (snapshot.node.parentElement) {
        snapshot.node.textContent = snapshot.originalText;
      }
    }

    isTranslated = false;
    textSnapshots = [];
    console.log('Reverted to original text');
  } catch (error) {
    console.error('Revert error:', error);
    throw error;
  }
}

/**
 * Listen for messages from background script and popup
 */
chrome.runtime.onMessage.addListener(
  (
    message: ContentMessage,
    _sender,
    sendResponse: (response: ContentResponse) => void
  ) => {
    if (message.action === 'translate') {
      translatePage()
        .then(() => {
          sendResponse({ success: true, message: 'Page translated' });
        })
        .catch((error) => {
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        });
      return true; // Keep message channel open for async response
    } else if (message.action === 'revert') {
      try {
        revertTranslation();
        sendResponse({ success: true, message: 'Translation reverted' });
      } catch (error) {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      return true;
    }
  }
);

console.log('Content script loaded');
