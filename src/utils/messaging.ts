/**
 * Utility functions for robust Chrome extension messaging
 */

/**
 * Check if a tab URL is restricted and cannot be accessed by content scripts
 */
export const isRestrictedUrl = (url: string | undefined): boolean => {
  if (!url) return true;

  return (
    url.startsWith('chrome://') ||
    url.startsWith('about:') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('file://') ||
    url.startsWith('view-source:')
  );
};

/**
 * Send a message to a content script with retry logic and timeout
 */
export const sendMessageToTab = async <T = unknown>(
  tabId: number,
  message: Record<string, unknown>,
  options: {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
  } = {}
): Promise<T> => {
  const {
    timeout = 5000,
    retries = 2,
    retryDelay = 500,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Add timeout to the message sending
      const response = await Promise.race<T>([
        chrome.tabs.sendMessage(tabId, message),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Message timeout')), timeout)
        ),
      ]);

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if it's a connection error
      const isConnectionError =
        lastError.message.includes('Receiving end does not exist') ||
        lastError.message.includes('Could not establish connection');

      // If it's the last attempt or not a connection error, throw
      if (attempt === retries || !isConnectionError) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  // Throw the last error with a helpful message
  throw new Error(
    lastError?.message.includes('Receiving end does not exist')
      ? 'Could not connect to the page. Please refresh and try again.'
      : lastError?.message || 'Unknown error'
  );
};

/**
 * Check if the content script is ready by sending a ping message
 */
export const checkContentScriptReady = async (tabId: number): Promise<boolean> => {
  try {
    await sendMessageToTab(tabId, { type: 'PING' }, { timeout: 1000, retries: 0 });
    return true;
  } catch {
    return false;
  }
};

/**
 * Ensure content script is injected into the tab
 */
export const ensureContentScriptInjected = async (
  tabId: number,
  scriptPath: string = 'content-script.js'
): Promise<void> => {
  try {
    // Try to inject the content script
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [scriptPath],
    });
  } catch (error) {
    // Script might already be injected, which is fine
    console.log('Content script injection attempt:', error);
  }
};

/**
 * Get the current active tab with validation
 */
export const getActiveTab = async (): Promise<chrome.tabs.Tab> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) {
    throw new Error('No active tab found');
  }

  if (!tab.id) {
    throw new Error('Tab has no ID');
  }

  if (isRestrictedUrl(tab.url)) {
    throw new Error(
      'Cannot access this page. Chrome extensions cannot run on internal browser pages.'
    );
  }

  return tab;
};

/**
 * Send a message to the content script with automatic retry and injection
 */
export const sendToContentScript = async <T = unknown>(
  message: Record<string, unknown>,
  options: {
    timeout?: number;
    retries?: number;
    autoInject?: boolean;
  } = {}
): Promise<T> => {
  const { autoInject = true, ...messageOptions } = options;

  // Get and validate the active tab
  const tab = await getActiveTab();

  if (!tab.id) {
    throw new Error('Tab has no ID');
  }

  // Check if content script is ready
  const isReady = await checkContentScriptReady(tab.id);

  // If not ready and auto-inject is enabled, try to inject
  if (!isReady && autoInject) {
    await ensureContentScriptInjected(tab.id);
    // Wait a moment for the script to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Send the actual message
  return sendMessageToTab<T>(tab.id, message, messageOptions);
};
