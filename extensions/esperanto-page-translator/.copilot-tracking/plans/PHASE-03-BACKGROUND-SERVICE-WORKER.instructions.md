# PHASE 3: BACKGROUND SERVICE WORKER

**Phase Objective**: Implement Manifest V3 background service worker with message passing, context menu creation, and state management

**Estimated Time**: 2-3 hours
**Total Tasks in Phase 3**: 48 tasks
**Completion**: 0/48 tasks complete (0%)

**Prerequisites**:
- ✅ Phase 1 Complete (Vite project setup)
- ✅ Phase 2 Complete (Translation service)
- ✅ manifest.json configured with background.service_worker

---

## STEP 3.1: Create Background Service Worker Structure

**Step Objective**: Set up background worker file and basic event listeners

### Task 3.1.1: Create Background Directory and File
- [ ] 3.1.1.1 **Create background directory**
      ```powershell
      New-Item -Path "src/background" -ItemType Directory
      ```
- [ ] 3.1.1.2 **Verify directory created**
      ```powershell
      ls src
      ```
      - Confirm `background/` in list
- [ ] 3.1.1.3 **Create background.ts file**
      ```powershell
      New-Item -Path "src/background/background.ts" -ItemType File
      ```
- [ ] 3.1.1.4 **Open background.ts**
      ```powershell
      code src/background/background.ts
      ```
      - File should be empty

### Task 3.1.2: Add File Header and Type Declarations
- [ ] 3.1.2.1 **Add file header comment**
      ```typescript
      /**
       * Background Service Worker
       * Handles extension lifecycle, context menus, and message passing
       * Manifest V3 - Event-based execution
       */
      ```
- [ ] 3.1.2.2 **Import Chrome types reference**
      ```typescript
      /// <reference types="chrome"/>
      ```
      - Enables TypeScript autocomplete for chrome APIs
- [ ] 3.1.2.3 **Import translation service**
      ```typescript
      import { translationService } from '../services/TranslationService';
      ```
      - Makes translation service available
- [ ] 3.1.2.4 **Verify imports**
      - No TypeScript errors
      - translationService recognized

### Task 3.1.3: Define Message Types Interface
- [ ] 3.1.3.1 **Create MessageType enum**
      ```typescript
      enum MessageType {
        TRANSLATE_PAGE = 'TRANSLATE_PAGE',
        REVERT_PAGE = 'REVERT_PAGE',
        GET_STATE = 'GET_STATE',
        TRANSLATE_SELECTION = 'TRANSLATE_SELECTION',
      }
      ```
      - Standardizes message types
- [ ] 3.1.3.2 **Create Message interface**
      ```typescript
      interface Message {
        type: MessageType;
        tabId?: number;
        text?: string;
        selection?: string;
      }
      ```
- [ ] 3.1.3.3 **Create MessageResponse interface**
      ```typescript
      interface MessageResponse {
        success: boolean;
        data?: any;
        error?: string;
      }
      ```
- [ ] 3.1.3.4 **Create TranslationState interface**
      ```typescript
      interface TranslationState {
        isTranslated: boolean;
        originalLanguage?: string;
        timestamp?: number;
      }
      ```
- [ ] 3.1.3.5 **Verify all interfaces defined**
      - 4 interfaces total
      - No TypeScript errors

### Task 3.1.4: Set Up Extension Install Handler
- [ ] 3.1.4.1 **Add install event listener**
      ```typescript
      chrome.runtime.onInstalled.addListener((details) => {
      ```
- [ ] 3.1.4.2 **Check install reason**
      ```typescript
        console.log('Extension installed:', details.reason);

        if (details.reason === 'install') {
          console.log('First-time installation');
        } else if (details.reason === 'update') {
          console.log('Extension updated');
        }
      ```
- [ ] 3.1.4.3 **Initialize context menu on install**
      ```typescript
        createContextMenu();
      ```
      - Will define this function next
- [ ] 3.1.4.4 **Close listener**
      ```typescript
      });
      ```
- [ ] 3.1.4.5 **Verify install handler**
      - Listener registered
      - Calls createContextMenu

### Task 3.1.5: Set Up Extension Startup Handler
- [ ] 3.1.5.1 **Add startup event listener**
      ```typescript
      chrome.runtime.onStartup.addListener(() => {
      ```
- [ ] 3.1.5.2 **Re-create context menu on startup**
      ```typescript
        console.log('Extension starting up');
        createContextMenu();
      ```
      - Ensures context menu always available
- [ ] 3.1.5.3 **Close listener**
      ```typescript
      });
      ```

---

## STEP 3.2: Implement Context Menu Creation

**Step Objective**: Create right-click context menu for translating selected text

### Task 3.2.1: Create Context Menu Function
- [ ] 3.2.1.1 **Define createContextMenu function**
      ```typescript
      function createContextMenu(): void {
      ```
- [ ] 3.2.1.2 **Remove existing menus first**
      ```typescript
        chrome.contextMenus.removeAll(() => {
      ```
      - Prevents duplicate menus
- [ ] 3.2.1.3 **Create main menu item**
      ```typescript
          chrome.contextMenus.create({
            id: 'translate-selection',
            title: 'Translate to Esperanto',
            contexts: ['selection'],
          });
      ```
      - id: unique identifier
      - title: text shown in menu
      - contexts: only show when text selected
- [ ] 3.2.1.4 **Add error handling**
      ```typescript
          if (chrome.runtime.lastError) {
            console.error('Context menu error:', chrome.runtime.lastError);
          } else {
            console.log('Context menu created successfully');
          }
        });
      ```
- [ ] 3.2.1.5 **Close function**
      ```typescript
      }
      ```
- [ ] 3.2.1.6 **Verify context menu creation**
      - Function defined
      - Menu created with correct properties
      - Error handling present

### Task 3.2.2: Implement Context Menu Click Handler
- [ ] 3.2.2.1 **Add click event listener**
      ```typescript
      chrome.contextMenus.onClicked.addListener((info, tab) => {
      ```
- [ ] 3.2.2.2 **Check menu item ID**
      ```typescript
        if (info.menuItemId === 'translate-selection') {
      ```
- [ ] 3.2.2.3 **Get selected text**
      ```typescript
          const selectedText = info.selectionText;

          if (!selectedText || !tab?.id) {
            console.error('No text selected or invalid tab');
            return;
          }
      ```
- [ ] 3.2.2.4 **Translate selected text**
      ```typescript
          translationService.translateText(selectedText)
            .then(result => {
      ```
- [ ] 3.2.2.5 **Show notification with translation**
      ```typescript
              chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Esperanto Translation',
                message: result.translatedText,
              });
            })
      ```
- [ ] 3.2.2.6 **Add error handling**
      ```typescript
            .catch(error => {
              console.error('Translation error:', error);
              chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Translation Failed',
                message: error.message || 'Could not translate text',
              });
            });
        }
      ```
- [ ] 3.2.2.7 **Close listener**
      ```typescript
      });
      ```
- [ ] 3.2.2.8 **Add notifications permission to manifest**
      - Open public/manifest.json
      - Add "notifications" to permissions array
      - Save file
- [ ] 3.2.2.9 **Verify context menu handler**
      - Gets selected text
      - Translates text
      - Shows notification
      - Error handling present

---

## STEP 3.3: Implement Message Passing System

**Step Objective**: Handle messages from popup and content scripts

### Task 3.3.1: Create Message Router
- [ ] 3.3.1.1 **Add runtime message listener**
      ```typescript
      chrome.runtime.onMessage.addListener(
        (message: Message, sender, sendResponse) => {
      ```
- [ ] 3.3.1.2 **Log incoming messages**
      ```typescript
          console.log('Received message:', message.type);
      ```
- [ ] 3.3.1.3 **Route to handler based on type**
      ```typescript
          switch (message.type) {
            case MessageType.TRANSLATE_PAGE:
              handleTranslatePage(message, sender, sendResponse);
              break;

            case MessageType.REVERT_PAGE:
              handleRevertPage(message, sender, sendResponse);
              break;

            case MessageType.GET_STATE:
              handleGetState(message, sender, sendResponse);
              break;

            case MessageType.TRANSLATE_SELECTION:
              handleTranslateSelection(message, sender, sendResponse);
              break;

            default:
              sendResponse({ success: false, error: 'Unknown message type' });
          }
      ```
- [ ] 3.3.1.4 **Return true for async response**
      ```typescript
          return true; // Keep channel open for async response
        }
      );
      ```
      - CRITICAL: Must return true for async sendResponse
- [ ] 3.3.1.5 **Verify message router**
      - Listener registered
      - All message types handled
      - Returns true

### Task 3.3.2: Implement TRANSLATE_PAGE Handler
- [ ] 3.3.2.1 **Define handleTranslatePage function**
      ```typescript
      async function handleTranslatePage(
        message: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
      ): Promise<void> {
      ```
- [ ] 3.3.2.2 **Get tab ID**
      ```typescript
        const tabId = sender.tab?.id || message.tabId;

        if (!tabId) {
          sendResponse({ success: false, error: 'No tab ID' });
          return;
        }
      ```
- [ ] 3.3.2.3 **Inject content script**
      ```typescript
        try {
          await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content-script.js'],
          });
      ```
- [ ] 3.3.2.4 **Send translate command to content script**
      ```typescript
          chrome.tabs.sendMessage(
            tabId,
            { type: 'START_TRANSLATION' },
            (response) => {
              if (chrome.runtime.lastError) {
                sendResponse({
                  success: false,
                  error: chrome.runtime.lastError.message
                });
              } else {
                sendResponse({ success: true, data: response });
              }
            }
          );
        } catch (error) {
          sendResponse({
            success: false,
            error: error.message
          });
        }
      }
      ```
- [ ] 3.3.2.5 **Verify handler implementation**
      - Gets tab ID correctly
      - Injects content script
      - Sends message to content script
      - Error handling complete

### Task 3.3.3: Implement REVERT_PAGE Handler
- [ ] 3.3.3.1 **Define handleRevertPage function**
      ```typescript
      async function handleRevertPage(
        message: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
      ): Promise<void> {
      ```
- [ ] 3.3.3.2 **Get tab ID**
      ```typescript
        const tabId = sender.tab?.id || message.tabId;

        if (!tabId) {
          sendResponse({ success: false, error: 'No tab ID' });
          return;
        }
      ```
- [ ] 3.3.3.3 **Send revert command**
      ```typescript
        try {
          chrome.tabs.sendMessage(
            tabId,
            { type: 'REVERT_TRANSLATION' },
            (response) => {
              sendResponse({ success: true, data: response });
            }
          );
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      }
      ```
- [ ] 3.3.3.4 **Verify revert handler**
      - Similar structure to translate handler
      - Sends REVERT command

### Task 3.3.4: Implement GET_STATE Handler
- [ ] 3.3.4.1 **Define handleGetState function**
      ```typescript
      async function handleGetState(
        message: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
      ): Promise<void> {
      ```
- [ ] 3.3.4.2 **Get tab ID**
      ```typescript
        const tabId = sender.tab?.id || message.tabId;

        if (!tabId) {
          sendResponse({ success: false, error: 'No tab ID' });
          return;
        }
      ```
- [ ] 3.3.4.3 **Retrieve state from storage**
      ```typescript
        try {
          const key = `translation_state_${tabId}`;
          const result = await chrome.storage.local.get(key);

          const state: TranslationState = result[key] || {
            isTranslated: false,
          };

          sendResponse({ success: true, data: state });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      }
      ```
- [ ] 3.3.4.4 **Verify state handler**
      - Retrieves from chrome.storage
      - Returns TranslationState
      - Error handling present

### Task 3.3.5: Implement TRANSLATE_SELECTION Handler
- [ ] 3.3.5.1 **Define handleTranslateSelection function**
      ```typescript
      async function handleTranslateSelection(
        message: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
      ): Promise<void> {
      ```
- [ ] 3.3.5.2 **Validate selection text**
      ```typescript
        const text = message.selection;

        if (!text) {
          sendResponse({ success: false, error: 'No text provided' });
          return;
        }
      ```
- [ ] 3.3.5.3 **Translate text**
      ```typescript
        try {
          const result = await translationService.translateText(text);
          sendResponse({
            success: true,
            data: { translatedText: result.translatedText }
          });
        } catch (error) {
          sendResponse({
            success: false,
            error: error.message
          });
        }
      }
      ```
- [ ] 3.3.5.4 **Verify selection handler**
      - Validates input
      - Uses translation service
      - Returns result

---

## STEP 3.4: Implement State Management

**Step Objective**: Track translation state per tab using chrome.storage

### Task 3.4.1: Create State Save Function
- [ ] 3.4.1.1 **Define saveTranslationState function**
      ```typescript
      async function saveTranslationState(
        tabId: number,
        state: TranslationState
      ): Promise<void> {
      ```
- [ ] 3.4.1.2 **Create storage key**
      ```typescript
        const key = `translation_state_${tabId}`;
      ```
- [ ] 3.4.1.3 **Save to chrome.storage.local**
      ```typescript
        await chrome.storage.local.set({
          [key]: state,
        });
      ```
- [ ] 3.4.1.4 **Add logging**
      ```typescript
        console.log(`Saved state for tab ${tabId}:`, state);
      ```
- [ ] 3.4.1.5 **Close function**
      ```typescript
      }
      ```

### Task 3.4.2: Create State Retrieve Function
- [ ] 3.4.2.1 **Define getTranslationState function**
      ```typescript
      async function getTranslationState(
        tabId: number
      ): Promise<TranslationState> {
      ```
- [ ] 3.4.2.2 **Create storage key**
      ```typescript
        const key = `translation_state_${tabId}`;
      ```
- [ ] 3.4.2.3 **Retrieve from storage**
      ```typescript
        const result = await chrome.storage.local.get(key);

        return result[key] || {
          isTranslated: false,
        };
      ```
- [ ] 3.4.2.4 **Close function**
      ```typescript
      }
      ```

### Task 3.4.3: Create State Clear Function
- [ ] 3.4.3.1 **Define clearTranslationState function**
      ```typescript
      async function clearTranslationState(tabId: number): Promise<void> {
      ```
- [ ] 3.4.3.2 **Create storage key**
      ```typescript
        const key = `translation_state_${tabId}`;
      ```
- [ ] 3.4.3.3 **Remove from storage**
      ```typescript
        await chrome.storage.local.remove(key);
        console.log(`Cleared state for tab ${tabId}`);
      ```
- [ ] 3.4.3.4 **Close function**
      ```typescript
      }
      ```

### Task 3.4.4: Implement Tab Cleanup
- [ ] 3.4.4.1 **Add tab removed listener**
      ```typescript
      chrome.tabs.onRemoved.addListener((tabId) => {
      ```
- [ ] 3.4.4.2 **Clear state when tab closes**
      ```typescript
        clearTranslationState(tabId).catch(console.error);
        console.log(`Tab ${tabId} closed, cleaning up state`);
      ```
- [ ] 3.4.4.3 **Close listener**
      ```typescript
      });
      ```
- [ ] 3.4.4.4 **Verify cleanup works**
      - Listener registered
      - Calls clearTranslationState

### Task 3.4.5: Add Tab Updated Listener (Optional)
- [ ] 3.4.5.1 **Add tab updated listener**
      ```typescript
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      ```
- [ ] 3.4.5.2 **Clear state on URL change**
      ```typescript
        if (changeInfo.url) {
          clearTranslationState(tabId).catch(console.error);
          console.log(`Tab ${tabId} navigated to new URL, clearing state`);
        }
      ```
      - Reset when user navigates away
- [ ] 3.4.5.3 **Close listener**
      ```typescript
      });
      ```

---

## STEP 3.5: Testing and Validation

**Step Objective**: Test background service worker in browser

### Task 3.5.1: Build Extension for Testing
- [ ] 3.5.1.1 **Update vite.config.ts** (if not already done in Phase 1)
      - Ensure background.ts configured as entry point
      - Output to dist/background.js
- [ ] 3.5.1.2 **Run build command**
      ```powershell
      npm run build
      ```
- [ ] 3.5.1.3 **Verify dist/ contains background.js**
      ```powershell
      ls dist
      ```
      - Should see background.js

### Task 3.5.2: Load Extension in Chrome
- [ ] 3.5.2.1 **Open Chrome**
      - Navigate to chrome://extensions/
- [ ] 3.5.2.2 **Enable Developer mode**
      - Toggle switch in top right
- [ ] 3.5.2.3 **Click "Load unpacked"**
      - Browse to dist/ folder
      - Select folder and confirm
- [ ] 3.5.2.4 **Verify extension loaded**
      - Should appear in extensions list
      - Icon visible in toolbar
- [ ] 3.5.2.5 **Check for errors**
      - Click "Errors" button if red
      - Check service worker status

### Task 3.5.3: Test Service Worker Console
- [ ] 3.5.3.1 **Click extension details**
- [ ] 3.5.3.2 **Click "Inspect views: service worker"**
      - Opens DevTools for background worker
- [ ] 3.5.3.3 **Check console for install log**
      - Should see "Extension installed" message
- [ ] 3.5.3.4 **Check for errors**
      - No red errors in console
      - Warnings acceptable

### Task 3.5.4: Test Context Menu
- [ ] 3.5.4.1 **Open any website**
      - Navigate to wikipedia.org or similar
- [ ] 3.5.4.2 **Select text on page**
      - Highlight a few words
- [ ] 3.5.4.3 **Right-click selected text**
      - Context menu should appear
- [ ] 3.5.4.4 **Verify "Translate to Esperanto" option**
      - Should be in context menu
- [ ] 3.5.4.5 **Click "Translate to Esperanto"**
- [ ] 3.5.4.6 **Verify notification appears**
      - Should show translated text
      - Check notification content

### Task 3.5.5: Test Message Passing (Manual)
- [ ] 3.5.5.1 **Open service worker console**
- [ ] 3.5.5.2 **Send test message**
      ```javascript
      chrome.runtime.sendMessage(
        { type: 'GET_STATE' },
        (response) => console.log(response)
      );
      ```
- [ ] 3.5.5.3 **Verify response**
      - Should see response in console
      - success: true
      - data contains state object
- [ ] 3.5.5.4 **Test unknown message type**
      ```javascript
      chrome.runtime.sendMessage(
        { type: 'INVALID' },
        (response) => console.log(response)
      );
      ```
      - Should return error

### Task 3.5.6: Test State Management
- [ ] 3.5.6.1 **Get current tab ID**
      ```javascript
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        console.log('Tab ID:', tabs[0].id);
      });
      ```
- [ ] 3.5.6.2 **Manually save state**
      ```javascript
      chrome.storage.local.set({
        'translation_state_123': {
          isTranslated: true,
          timestamp: Date.now()
        }
      });
      ```
      - Replace 123 with actual tab ID
- [ ] 3.5.6.3 **Retrieve state**
      ```javascript
      chrome.storage.local.get('translation_state_123', result => {
        console.log('State:', result);
      });
      ```
- [ ] 3.5.6.4 **Verify state persistence**
      - State saved and retrieved correctly

### Task 3.5.7: Final Validation Checklist
- [ ] 3.5.7.1 **All event listeners registered**:
      - [ ] onInstalled
      - [ ] onStartup
      - [ ] onMessage
      - [ ] contextMenus.onClicked
      - [ ] tabs.onRemoved
      - [ ] tabs.onUpdated
- [ ] 3.5.7.2 **All message handlers implemented**:
      - [ ] handleTranslatePage
      - [ ] handleRevertPage
      - [ ] handleGetState
      - [ ] handleTranslateSelection
- [ ] 3.5.7.3 **State management functions work**:
      - [ ] saveTranslationState
      - [ ] getTranslationState
      - [ ] clearTranslationState
- [ ] 3.5.7.4 **Context menu functional**
      - Creates successfully
      - Shows on text selection
      - Translates and shows notification
- [ ] 3.5.7.5 **No console errors**
      - Service worker logs clean
      - No unhandled promise rejections
- [ ] 3.5.7.6 **TypeScript compilation successful**
      ```powershell
      npx tsc --noEmit
      ```
- [ ] 3.5.7.7 **Git commit (optional)**
      ```powershell
      git add src/background/
      git commit -m "feat: implement background service worker with message passing"
      ```
- [ ] 3.5.7.8 **Ready for Phase 4**
      - ✅ ALL PHASE 3 TASKS COMPLETE (48/48)
      - Background worker fully functional
      - Can proceed to popup UI

---

## 📊 PHASE 3 PROGRESS TRACKING

**Overall Completion**: 0/48 tasks (0%)

### Step Breakdown:
- [ ] Step 3.1: Service Worker Structure (15 tasks, 0%)
- [ ] Step 3.2: Context Menu (9 tasks, 0%)
- [ ] Step 3.3: Message Passing (15 tasks, 0%)
- [ ] Step 3.4: State Management (13 tasks, 0%)
- [ ] Step 3.5: Testing (16 tasks, 0%)

---

**Next File**: PHASE-04-MATERIAL-UI-POPUP.instructions.md
