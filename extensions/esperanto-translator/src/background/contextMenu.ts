export const setupContextMenu = () => {
  chrome.contextMenus.create({
    id: 'translateSelection',
    title: 'Translate to Esperanto',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'translateSelection' && tab?.id) {
      const selectedText = info.selectionText;

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, {
        type: 'TRANSLATE_SELECTION',
        payload: { text: selectedText },
      });
    }
  });
};
