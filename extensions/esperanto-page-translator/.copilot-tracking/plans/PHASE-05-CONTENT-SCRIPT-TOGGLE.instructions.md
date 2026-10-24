# PHASE 5: CONTENT SCRIPT TOGGLE FUNCTIONALITY

**Phase Objective**: Implement DOM manipulation for translating and reverting page content

**Estimated Time**: 3-4 hours
**Total Tasks in Phase 5**: 52 tasks
**Completion**: 0/52 tasks complete (0%)

**Prerequisites**:
- ✅ Phase 1 Complete (Vite project setup)
- ✅ Phase 2 Complete (Translation service)
- ✅ Phase 3 Complete (Background service worker)
- ✅ Phase 4 Complete (Popup UI)
- ✅ Chrome scripting API configured

---

## STEP 5.1: Create Content Script Structure

**Step Objective**: Set up content script file and message listener

### Task 5.1.1: Create Content Script File
- [ ] 5.1.1.1 **Create content directory**
      ```powershell
      New-Item -Path "src/content" -ItemType Directory
      ```
- [ ] 5.1.1.2 **Verify directory created**
      ```powershell
      ls src
      ```
      - Confirm `content/` in list
- [ ] 5.1.1.3 **Create content-script.ts**
      ```powershell
      New-Item -Path "src/content/content-script.ts" -ItemType File
      ```
- [ ] 5.1.1.4 **Open content-script.ts**
      ```powershell
      code src/content/content-script.ts
      ```

### Task 5.1.2: Add Content Script Header and Types
- [ ] 5.1.2.1 **Add file header**
      ```typescript
      /**
       * Content Script
       * Handles page translation by traversing DOM and replacing text nodes
       * Preserves original content for reverting
       */
      ```
- [ ] 5.1.2.2 **Add Chrome types reference**
      ```typescript
      /// <reference types="chrome"/>
      ```
- [ ] 5.1.2.3 **Import translation service**
      ```typescript
      import { translationService } from '../services/TranslationService';
      ```

### Task 5.1.3: Define Content Script Interfaces
- [ ] 5.1.3.1 **Create TextNodeSnapshot interface**
      ```typescript
      interface TextNodeSnapshot {
        node: Text;
        originalText: string;
        translatedText?: string;
      }
      ```
      - Stores original and translated text per node
- [ ] 5.1.3.2 **Create PageSnapshot interface**
      ```typescript
      interface PageSnapshot {
        snapshots: TextNodeSnapshot[];
        timestamp: number;
        isTranslated: boolean;
      }
      ```
- [ ] 5.1.3.3 **Create ContentMessage interface**
      ```typescript
      interface ContentMessage {
        type: 'START_TRANSLATION' | 'REVERT_TRANSLATION' | 'GET_STATUS';
      }
      ```

### Task 5.1.4: Initialize Global State
- [ ] 5.1.4.1 **Create page snapshot variable**
      ```typescript
      let pageSnapshot: PageSnapshot | null = null;
      ```
      - Stores current translation state
- [ ] 5.1.4.2 **Create translation in progress flag**
      ```typescript
      let translationInProgress = false;
      ```
- [ ] 5.1.4.3 **Add console log for script injection**
      ```typescript
      console.log('Esperanto Translator content script loaded');
      ```

---

## STEP 5.2: Implement DOM Text Node Extraction

**Step Objective**: Find and collect all text nodes in the page

### Task 5.2.1: Create Text Node Filter
- [ ] 5.2.1.1 **Define isTextNodeVisible function**
      ```typescript
      function isTextNodeVisible(node: Text): boolean {
      ```
- [ ] 5.2.1.2 **Check if node has meaningful text**
      ```typescript
        const text = node.textContent?.trim();
        if (!text || text.length === 0) {
          return false;
        }
      ```
      - Skip empty/whitespace-only nodes
- [ ] 5.2.1.3 **Get parent element**
      ```typescript
        const parent = node.parentElement;
        if (!parent) {
          return false;
        }
      ```
- [ ] 5.2.1.4 **Check if parent is visible**
      ```typescript
        const style = window.getComputedStyle(parent);

        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        ) {
          return false;
        }
      ```
- [ ] 5.2.1.5 **Exclude script and style tags**
      ```typescript
        const tagName = parent.tagName.toLowerCase();
        const excludedTags = ['script', 'style', 'noscript', 'iframe', 'object'];

        if (excludedTags.includes(tagName)) {
          return false;
        }
      ```
- [ ] 5.2.1.6 **Return true if visible**
      ```typescript
        return true;
      }
      ```

### Task 5.2.2: Create TreeWalker for Text Nodes
- [ ] 5.2.2.1 **Define extractTextNodes function**
      ```typescript
      function extractTextNodes(): Text[] {
      ```
- [ ] 5.2.2.2 **Create TreeWalker**
      ```typescript
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              if (isTextNodeVisible(node as Text)) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_REJECT;
            },
          }
        );
      ```
      - Walks entire DOM tree
      - Only accepts visible text nodes
- [ ] 5.2.2.3 **Collect all text nodes**
      ```typescript
        const textNodes: Text[] = [];
        let currentNode: Node | null;

        while ((currentNode = walker.nextNode())) {
          textNodes.push(currentNode as Text);
        }
      ```
- [ ] 5.2.2.4 **Return collected nodes**
      ```typescript
        console.log(`Found ${textNodes.length} text nodes`);
        return textNodes;
      }
      ```

### Task 5.2.3: Create Snapshot Builder
- [ ] 5.2.3.1 **Define createPageSnapshot function**
      ```typescript
      function createPageSnapshot(textNodes: Text[]): PageSnapshot {
      ```
- [ ] 5.2.3.2 **Map nodes to snapshots**
      ```typescript
        const snapshots: TextNodeSnapshot[] = textNodes.map(node => ({
          node,
          originalText: node.textContent || '',
        }));
      ```
- [ ] 5.2.3.3 **Return snapshot object**
      ```typescript
        return {
          snapshots,
          timestamp: Date.now(),
          isTranslated: false,
        };
      }
      ```

---

## STEP 5.3: Implement Translation Logic

**Step Objective**: Translate collected text nodes and update DOM

### Task 5.3.1: Create Batch Translation Function
- [ ] 5.3.1.1 **Define translateTextNodes function**
      ```typescript
      async function translateTextNodes(
        snapshots: TextNodeSnapshot[]
      ): Promise<void> {
      ```
- [ ] 5.3.1.2 **Extract unique texts**
      ```typescript
        const textsToTranslate = snapshots
          .map(s => s.originalText.trim())
          .filter((text, index, self) => {
            return text.length > 0 && self.indexOf(text) === index;
          });

        console.log(`Translating ${textsToTranslate.length} unique texts`);
      ```
      - Removes duplicates for efficiency
- [ ] 5.3.1.3 **Batch translate texts**
      ```typescript
        try {
          const translations = await translationService.batchTranslate(
            textsToTranslate,
            'auto',
            'eo'
          );
      ```
- [ ] 5.3.1.4 **Create translation map**
      ```typescript
          const translationMap = new Map<string, string>();

          textsToTranslate.forEach((text, index) => {
            translationMap.set(text.trim(), translations[index]);
          });
      ```
      - Maps original → translated
- [ ] 5.3.1.5 **Apply translations to snapshots**
      ```typescript
          snapshots.forEach(snapshot => {
            const trimmed = snapshot.originalText.trim();
            const translated = translationMap.get(trimmed);

            if (translated) {
              snapshot.translatedText = translated;
            }
          });
        } catch (error) {
          console.error('Translation error:', error);
          throw error;
        }
      }
      ```

### Task 5.3.2: Create DOM Update Function
- [ ] 5.3.2.1 **Define applyTranslations function**
      ```typescript
      function applyTranslations(snapshots: TextNodeSnapshot[]): void {
      ```
- [ ] 5.3.2.2 **Update each text node**
      ```typescript
        snapshots.forEach(snapshot => {
          if (snapshot.translatedText && snapshot.node.parentElement) {
            snapshot.node.textContent = snapshot.translatedText;
          }
        });
      ```
      - Only updates if translation exists and node still in DOM
- [ ] 5.3.2.3 **Add logging**
      ```typescript
        console.log(`Applied ${snapshots.length} translations to DOM`);
      }
      ```

### Task 5.3.3: Create Main Translation Orchestrator
- [ ] 5.3.3.1 **Define translatePage function**
      ```typescript
      async function translatePage(): Promise<void> {
      ```
- [ ] 5.3.3.2 **Check if already translating**
      ```typescript
        if (translationInProgress) {
          console.warn('Translation already in progress');
          return;
        }

        translationInProgress = true;
      ```
- [ ] 5.3.3.3 **Check if already translated**
      ```typescript
        if (pageSnapshot?.isTranslated) {
          console.log('Page already translated');
          translationInProgress = false;
          return;
        }
      ```
- [ ] 5.3.3.4 **Extract text nodes**
      ```typescript
        try {
          console.log('Starting page translation...');

          const textNodes = extractTextNodes();

          if (textNodes.length === 0) {
            console.warn('No text nodes found');
            translationInProgress = false;
            return;
          }
      ```
- [ ] 5.3.3.5 **Create snapshot**
      ```typescript
          pageSnapshot = createPageSnapshot(textNodes);
      ```
- [ ] 5.3.3.6 **Translate and apply**
      ```typescript
          await translateTextNodes(pageSnapshot.snapshots);
          applyTranslations(pageSnapshot.snapshots);

          pageSnapshot.isTranslated = true;

          console.log('Page translation complete');
        } catch (error) {
          console.error('Translation failed:', error);
          pageSnapshot = null;
          throw error;
        } finally {
          translationInProgress = false;
        }
      }
      ```

---

## STEP 5.4: Implement Revert Functionality

**Step Objective**: Restore original page content from snapshot

### Task 5.4.1: Create Revert Function
- [ ] 5.4.1.1 **Define revertPage function**
      ```typescript
      function revertPage(): void {
      ```
- [ ] 5.4.1.2 **Check if snapshot exists**
      ```typescript
        if (!pageSnapshot) {
          console.warn('No translation to revert');
          return;
        }
      ```
- [ ] 5.4.1.3 **Check if page is translated**
      ```typescript
        if (!pageSnapshot.isTranslated) {
          console.log('Page not translated');
          return;
        }
      ```
- [ ] 5.4.1.4 **Restore original text**
      ```typescript
        console.log('Reverting page translation...');

        pageSnapshot.snapshots.forEach(snapshot => {
          if (snapshot.node.parentElement) {
            snapshot.node.textContent = snapshot.originalText;
          }
        });
      ```
      - Restores original text for each node
- [ ] 5.4.1.5 **Update snapshot state**
      ```typescript
        pageSnapshot.isTranslated = false;
        console.log('Page reverted to original');
      }
      ```

### Task 5.4.2: Create Clear Snapshot Function
- [ ] 5.4.2.1 **Define clearSnapshot function**
      ```typescript
      function clearSnapshot(): void {
      ```
- [ ] 5.4.2.2 **Clear snapshot**
      ```typescript
        pageSnapshot = null;
        translationInProgress = false;
        console.log('Translation snapshot cleared');
      }
      ```
      - Used for cleanup

---

## STEP 5.5: Implement Message Handlers

**Step Objective**: Handle messages from background script and popup

### Task 5.5.1: Create Message Router
- [ ] 5.5.1.1 **Add runtime message listener**
      ```typescript
      chrome.runtime.onMessage.addListener(
        (message: ContentMessage, sender, sendResponse) => {
      ```
- [ ] 5.5.1.2 **Log incoming message**
      ```typescript
          console.log('Content script received message:', message.type);
      ```
- [ ] 5.5.1.3 **Route START_TRANSLATION**
      ```typescript
          if (message.type === 'START_TRANSLATION') {
            translatePage()
              .then(() => {
                sendResponse({ success: true });
              })
              .catch(error => {
                sendResponse({
                  success: false,
                  error: error.message
                });
              });

            return true; // Keep channel open for async
          }
      ```
- [ ] 5.5.1.4 **Route REVERT_TRANSLATION**
      ```typescript
          if (message.type === 'REVERT_TRANSLATION') {
            try {
              revertPage();
              sendResponse({ success: true });
            } catch (error) {
              sendResponse({
                success: false,
                error: error.message
              });
            }

            return true;
          }
      ```
- [ ] 5.5.1.5 **Route GET_STATUS**
      ```typescript
          if (message.type === 'GET_STATUS') {
            sendResponse({
              success: true,
              data: {
                isTranslated: pageSnapshot?.isTranslated || false,
                nodeCount: pageSnapshot?.snapshots.length || 0,
                timestamp: pageSnapshot?.timestamp,
              },
            });

            return true;
          }
      ```
- [ ] 5.5.1.6 **Handle unknown message**
      ```typescript
          sendResponse({
            success: false,
            error: 'Unknown message type'
          });

          return false;
        }
      );
      ```

### Task 5.5.2: Add Navigation Cleanup
- [ ] 5.5.2.1 **Listen for page unload**
      ```typescript
      window.addEventListener('beforeunload', () => {
      ```
- [ ] 5.5.2.2 **Clear snapshot on navigation**
      ```typescript
        clearSnapshot();
      });
      ```
      - Prevents stale snapshots

---

## STEP 5.6: Update Vite Configuration

**Step Objective**: Configure Vite to build content script

### Task 5.6.1: Update vite.config.ts
- [ ] 5.6.1.1 **Open vite.config.ts**
      ```powershell
      code vite.config.ts
      ```
- [ ] 5.6.1.2 **Add content-script to rollupOptions.input**
      ```typescript
      input: {
        popup: 'public/popup.html',
        background: 'src/background/background.ts',
        'content-script': 'src/content/content-script.ts',
      },
      ```
- [ ] 5.6.1.3 **Save file**

### Task 5.6.2: Update manifest.json
- [ ] 5.6.2.1 **Open public/manifest.json**
      ```powershell
      code public/manifest.json
      ```
- [ ] 5.6.2.2 **Add host_permissions**
      ```json
      "host_permissions": [
        "<all_urls>"
      ],
      ```
      - Allows content script injection on all sites
- [ ] 5.6.2.3 **Add scripting permission**
      - Should already be in permissions array
      - If not, add "scripting"
- [ ] 5.6.2.4 **Save file**

---

## STEP 5.7: Testing and Validation

**Step Objective**: Test translation and revert on real websites

### Task 5.7.1: Build Extension
- [ ] 5.7.1.1 **Run build**
      ```powershell
      npm run build
      ```
      - Wait for build
- [ ] 5.7.1.2 **Check for errors**
      - No build errors
- [ ] 5.7.1.3 **Verify dist/ contains content-script.js**
      ```powershell
      ls dist
      ```
      - content-script.js should exist

### Task 5.7.2: Reload Extension
- [ ] 5.7.2.1 **Open chrome://extensions/**
- [ ] 5.7.2.2 **Click reload** on extension
- [ ] 5.7.2.3 **Check for errors**
      - No manifest errors

### Task 5.7.3: Test on Simple Page
- [ ] 5.7.3.1 **Navigate to simple site**
      - Example: wikipedia.org article
- [ ] 5.7.3.2 **Open extension popup**
      - Click extension icon
- [ ] 5.7.3.3 **Open DevTools console**
      - F12 → Console tab
- [ ] 5.7.3.4 **Click "Translate to Esperanto"**
      - Button should show loading state
- [ ] 5.7.3.5 **Wait for translation**
      - Usually 3-10 seconds depending on page size
- [ ] 5.7.3.6 **Verify page translated**
      - Text changed to Esperanto
      - Check console logs
- [ ] 5.7.3.7 **Check popup status**
      - Should show "Translated to Esperanto"
      - Revert button now enabled
- [ ] 5.7.3.8 **Click "Revert to Original"**
- [ ] 5.7.3.9 **Verify page reverted**
      - Original text restored
      - Console shows revert message

### Task 5.7.4: Test Text Node Extraction
- [ ] 5.7.4.1 **Open content script in DevTools**
      - Console tab
      - Look for "Found X text nodes" message
- [ ] 5.7.4.2 **Verify node count reasonable**
      - Wikipedia article: typically 200-500 nodes
      - Simple page: 50-150 nodes
- [ ] 5.7.4.3 **Check excluded elements**
      - Script tags not translated
      - Hidden elements skipped
      - Navigation/menus included

### Task 5.7.5: Test on Complex Page
- [ ] 5.7.5.1 **Navigate to complex site**
      - Example: news website, GitHub repo
- [ ] 5.7.5.2 **Click translate**
- [ ] 5.7.5.3 **Verify translation works**
      - All visible text translated
      - Layout not broken
      - Interactive elements still work
- [ ] 5.7.5.4 **Test revert**
      - Original text restored
      - Page still functional

### Task 5.7.6: Test Edge Cases
- [ ] 5.7.6.1 **Test empty page**
      - Navigate to blank page
      - Try translate
      - Should show "No text nodes found"
- [ ] 5.7.6.2 **Test already translated**
      - Translate page
      - Click translate again
      - Should show "already translated"
- [ ] 5.7.6.3 **Test navigation during translation**
      - Start translation
      - Immediately navigate away
      - No errors in console
- [ ] 5.7.6.4 **Test multiple tabs**
      - Translate tab 1
      - Switch to tab 2
      - Translate tab 2
      - Both work independently

### Task 5.7.7: Test Context Menu Integration
- [ ] 5.7.7.1 **Select text on page**
- [ ] 5.7.7.2 **Right-click selection**
- [ ] 5.7.7.3 **Click "Translate to Esperanto"**
- [ ] 5.7.7.4 **Verify notification appears**
      - Shows translated text
      - Not full page translation

### Task 5.7.8: Performance Testing
- [ ] 5.7.8.1 **Test large page**
      - Wikipedia featured article
      - ~1000+ text nodes
- [ ] 5.7.8.2 **Measure translation time**
      - Check console timestamps
      - Should complete in <30 seconds
- [ ] 5.7.8.3 **Check memory usage**
      - Chrome Task Manager
      - Extension should use <50MB
- [ ] 5.7.8.4 **Verify no memory leaks**
      - Translate and revert multiple times
      - Memory should not continuously grow

### Task 5.7.9: Final Validation Checklist
- [ ] 5.7.9.1 **DOM traversal working**:
      - [ ] Finds all visible text nodes
      - [ ] Excludes script/style tags
      - [ ] Excludes hidden elements
      - [ ] Handles edge cases
- [ ] 5.7.9.2 **Translation working**:
      - [ ] Batch translates efficiently
      - [ ] Handles duplicates
      - [ ] Updates DOM correctly
      - [ ] Preserves layout
- [ ] 5.7.9.3 **Revert working**:
      - [ ] Restores original text
      - [ ] Maintains DOM structure
      - [ ] Clears snapshot properly
- [ ] 5.7.9.4 **Message handling working**:
      - [ ] Receives START_TRANSLATION
      - [ ] Receives REVERT_TRANSLATION
      - [ ] Receives GET_STATUS
      - [ ] Sends proper responses
- [ ] 5.7.9.5 **State management working**:
      - [ ] Snapshot created correctly
      - [ ] Translation state tracked
      - [ ] Cleanup on navigation
- [ ] 5.7.9.6 **No console errors**
      - Clean console logs
      - No unhandled rejections
- [ ] 5.7.9.7 **TypeScript compilation successful**
      ```powershell
      npx tsc --noEmit
      ```
- [ ] 5.7.9.8 **Works across different sites**:
      - [ ] Wikipedia
      - [ ] News sites
      - [ ] GitHub
      - [ ] Simple HTML pages
- [ ] 5.7.9.9 **Git commit (optional)**
      ```powershell
      git add src/content/
      git commit -m "feat: implement content script with DOM translation"
      ```
- [ ] 5.7.9.10 **Ready for Phase 6**
      - ✅ ALL PHASE 5 TASKS COMPLETE (52/52)
      - Content script fully functional
      - Can proceed to error handling

---

## 📊 PHASE 5 PROGRESS TRACKING

**Overall Completion**: 0/52 tasks (0%)

### Step Breakdown:
- [ ] Step 5.1: Content Script Structure (13 tasks, 0%)
- [ ] Step 5.2: DOM Text Extraction (11 tasks, 0%)
- [ ] Step 5.3: Translation Logic (16 tasks, 0%)
- [ ] Step 5.4: Revert Functionality (6 tasks, 0%)
- [ ] Step 5.5: Message Handlers (8 tasks, 0%)
- [ ] Step 5.6: Vite Configuration (4 tasks, 0%)
- [ ] Step 5.7: Testing (34 tasks, 0%)

---

**Next File**: PHASE-06-ERROR-HANDLING.instructions.md
