# Esperanto Translator Chrome Extension - MVP Roadmap

**Project Goal**: Build a Chrome extension using React, TypeScript, Vite, and Material-UI that translates web page content into Esperanto.

**Tech Stack**:
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Library**: Material-UI (MUI) v5
- **Chrome Extension**: Manifest V3
- **Translation API**: Google Cloud Translation API (with fallback options)
- **State Management**: React Context API + Local Storage
- **Testing**: Vitest + React Testing Library

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [MVP Features](#mvp-features)
3. [Technical Architecture](#technical-architecture)
4. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
5. [Folder Structure](#folder-structure)
6. [Key Implementation Details](#key-implementation-details)
7. [Testing Strategy](#testing-strategy)
8. [Deployment & Distribution](#deployment--distribution)
9. [Future Enhancements](#future-enhancements)

---

## Project Overview

### What We're Building

A Chrome extension that allows users to:
- Translate entire web pages to Esperanto with one click
- Translate selected text on any webpage
- Toggle between original and translated content
- Store translation preferences and history
- Work offline with cached translations (stretch goal)

### Why This Stack?

- **React + TypeScript**: Type-safe, component-based architecture
- **Vite**: Lightning-fast HMR and optimized builds
- **Material-UI**: Professional, accessible UI components out of the box
- **Manifest V3**: Latest Chrome extension standard (future-proof)

---

## MVP Features

### Core Features (Must-Have)

1. **Browser Action Popup**
   - ✅ Toggle translation on/off for current page
   - ✅ Language detection status (IMPLEMENTED)
   - ✅ Translation progress indicator (IMPLEMENTED)
   - ✅ Settings access

2. **Content Script Translation**
   - ✅ Translate all visible text on page (IMPLEMENTED)
   - ✅ Preserve HTML structure and styling (IMPLEMENTED)
   - ✅ Exclude script/style/code blocks (IMPLEMENTED)
   - ✅ Handle dynamic content (IMPLEMENTED)

3. **Text Selection Translation**
   - ✅ Right-click context menu (IMPLEMENTED)
   - ✅ Translate selected text inline (IMPLEMENTED)
   - ✅ Show translation in tooltip/modal (IMPLEMENTED)

4. **Translation Settings**
   - ✅ Enable/disable auto-translation (IMPLEMENTED)
   - ✅ Translation quality preference (speed vs accuracy) (IMPLEMENTED)
   - ✅ Whitelist/blacklist domains (IMPLEMENTED)
   - ✅ Keyboard shortcuts (IMPLEMENTED)

5. **Basic Storage**
   - ✅ Save user preferences (IMPLEMENTED)
   - ✅ Cache recent translations (IMPLEMENTED with LRU)
   - ✅ Store domain whitelist (IMPLEMENTED)

### Nice-to-Have (Post-MVP)

- Translation history viewer
- ✅ Custom dictionary/glossary (IMPLEMENTED)
- ✅ Multiple translation provider support (IMPLEMENTED)
- ✅ Offline translation cache (IMPLEMENTED - IndexedDB with two-tier caching architecture)
- Translation comparison mode
- Export translated pages

---

## Technical Architecture

### Chrome Extension Components

```
┌─────────────────────────────────────────────────────────────┐
│                       Background Service Worker              │
│  - Manages extension lifecycle                              │
│  - Handles translation API calls                            │
│  - Coordinates between components                           │
│  - Manages chrome.storage                                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Content Scripts                        │
│  - Injected into web pages                                  │
│  - DOM manipulation for translations                        │
│  - Text extraction and replacement                          │
│  - Mutation observer for dynamic content                    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Popup UI (React)                       │
│  - Main user interface                                      │
│  - Translation controls                                     │
│  - Settings page                                            │
│  - Status display                                           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Popup or Context Menu
2. **Message Passing** → Content Script ↔ Background Script
3. **API Call** → Background Script → Translation API
4. **Response Processing** → Background Script → Content Script
5. **DOM Update** → Content Script → Web Page

---

## Phase-by-Phase Implementation

### Phase 0: Project Setup (Est: 2-3 hours)

**Goal**: Set up development environment and project scaffolding

**Tasks**:
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install and configure Material-UI
- [ ] Set up Chrome extension structure (manifest.json)
- [ ] Configure Vite for Chrome extension builds
- [ ] Install necessary dependencies
- [ ] Set up ESLint + Prettier
- [ ] Create basic folder structure
- [ ] Set up Git repository

**Key Commands**:
```bash
npm create vite@latest esperanto-translator -- --template react-ts
cd esperanto-translator
npm install

# Install dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @crxjs/vite-plugin -D
npm install webextension-polyfill
npm install @types/webextension-polyfill -D
```

**Deliverables**:
- ✅ Working Vite dev server
- ✅ Basic manifest.json (Manifest V3)
- ✅ Project builds successfully
- ✅ Chrome can load the extension in developer mode

---

### Phase 1: Extension Foundation (Est: 4-5 hours)

**Goal**: Create basic Chrome extension structure with popup UI

**Tasks**:
- [ ] Create manifest.json with proper permissions
- [ ] Build popup UI with React + MUI
- [ ] Implement basic popup functionality
- [ ] Add extension icons (16x16, 48x48, 128x128)
- [ ] Set up chrome.storage for settings
- [ ] Create basic settings page
- [ ] Test extension loading in Chrome

**Manifest V3 Configuration**:
```json
{
  "manifest_version": 3,
  "name": "Esperanto Translator",
  "version": "1.0.0",
  "description": "Translate web pages to Esperanto",
  "permissions": [
    "activeTab",
    "storage",
    "contextMenus",
    "scripting"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "index.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "src/background/service-worker.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/content-script.ts"],
      "run_at": "document_idle"
    }
  ]
}
```

**UI Components to Build**:
- `PopupApp.tsx` - Main popup component
- `TranslateButton.tsx` - Primary action button
- `SettingsDrawer.tsx` - Settings panel
- `StatusIndicator.tsx` - Translation status
- `LanguageDetector.tsx` - Shows detected language

**Deliverables**:
- ✅ Functional popup UI with Material-UI styling
- ✅ Settings page with theme toggle
- ✅ Extension communicates with background script
- ✅ chrome.storage saves user preferences

---

### Phase 2: Translation Service Integration (Est: 5-6 hours)

**Goal**: Integrate translation API and create service layer

**Tasks**:
- [ ] Set up Google Cloud Translation API credentials
- [ ] Create translation service abstraction layer
- [ ] Implement API request/response handling
- [ ] Add error handling and retry logic
- [ ] Create rate limiting mechanism
- [ ] Add translation caching
- [ ] Test API integration

**Translation Service Architecture**:

```typescript
// src/services/translationService.ts

interface TranslationRequest {
  text: string;
  sourceLang?: string;
  targetLang: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

class TranslationService {
  private apiKey: string;
  private cache: Map<string, string>;

  async translate(request: TranslationRequest): Promise<TranslationResponse>
  async detectLanguage(text: string): Promise<string>
  async batchTranslate(texts: string[]): Promise<string[]>
}
```

**API Options**:

**Primary: Google Cloud Translation API**
- Pros: Best accuracy, supports Esperanto, enterprise-grade
- Cons: Requires API key, paid service (free tier available)
- Setup: Enable API in GCP Console, generate API key

**Fallback: LibreTranslate (Open Source)**
- Pros: Free, self-hostable, privacy-friendly
- Cons: Lower accuracy, may not support Esperanto well
- Setup: Can use public instance or host your own

**Alternative: Microsoft Translator**
- Pros: Good accuracy, free tier available
- Cons: Requires Azure account

**Implementation Strategy**:
1. Start with Google Cloud Translation API for MVP
2. Add provider abstraction for future flexibility
3. Implement graceful fallback if API fails

**Environment Variables**:
```env
VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
VITE_TRANSLATION_CACHE_SIZE=1000
VITE_RATE_LIMIT_PER_MINUTE=60
```

**Deliverables**:
- ✅ Working translation API integration
- ✅ Translation service with caching
- ✅ Error handling for API failures
- ✅ Rate limiting to prevent quota exhaustion

---

### Phase 3: Content Script Implementation (Est: 6-8 hours)

**Goal**: Build content script that translates web page content

**Tasks**:
- [ ] Create content script entry point
- [ ] Implement DOM text extraction
- [ ] Build text node traversal algorithm
- [ ] Add HTML structure preservation
- [ ] Implement translation replacement logic
- [ ] Handle special elements (code, script, style)
- [ ] Add loading indicators
- [ ] Test on various websites

**Content Script Architecture**:

```typescript
// src/content/content-script.ts

class PageTranslator {
  private originalContent: Map<Node, string>;
  private translatedContent: Map<Node, string>;
  private isTranslated: boolean;

  // Extract all text nodes from page
  extractTextNodes(root: Node): Text[]

  // Filter out code/script/style elements
  filterTranslatableNodes(nodes: Text[]): Text[]

  // Send text to background for translation
  async translateNodes(nodes: Text[]): Promise<void>

  // Replace original text with translations
  applyTranslations(nodes: Text[], translations: string[]): void

  // Toggle between original and translated
  toggleTranslation(): void

  // Restore original content
  restoreOriginal(): void

  // Watch for dynamic content
  observeMutations(): void
}
```

**Text Extraction Strategy**:

1. **Walk the DOM Tree**:
   - Use `TreeWalker` API for efficient traversal
   - Filter for `Text` nodes only
   - Skip hidden elements

2. **Exclude Non-Translatable Elements**:
   - `<script>`, `<style>`, `<code>`, `<pre>`
   - Elements with `translate="no"` attribute
   - Input fields, textareas (for now)

3. **Batch Text for Translation**:
   - Group text nodes into chunks (max 5000 chars per API call)
   - Maintain order for accurate replacement
   - Track node references for later replacement

4. **Handle Dynamic Content**:
   - Use `MutationObserver` to watch for new content
   - Re-translate new text nodes
   - Maintain translation state

**Edge Cases to Handle**:
- Single-page applications (SPAs)
- Infinite scroll pages
- Forms and input fields
- iframes
- Shadow DOM elements
- Very large pages (pagination strategy)

**Deliverables**:
- ✅ Content script translates visible text
- ✅ HTML structure preserved
- ✅ Code blocks not translated
- ✅ Can toggle back to original

---

### Phase 4: Context Menu & Selection Translation (Est: 3-4 hours)

**Goal**: Add right-click translation for selected text

**Tasks**:
- [ ] Register context menu in background script
- [ ] Capture text selection in content script
- [ ] Create translation tooltip/modal component
- [ ] Implement inline translation display
- [ ] Add copy translated text feature
- [ ] Style tooltip with MUI components
- [ ] Test on various selection scenarios

**Context Menu Implementation**:

```typescript
// src/background/contextMenu.ts

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translateSelection',
    title: 'Translate to Esperanto',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translateSelection') {
    const selectedText = info.selectionText;
    // Send to content script for display
  }
});
```

**Selection Translation UI**:
- Floating tooltip near cursor
- MUI Card component for styling
- Copy button
- "Translate full page" action
- Close button

**Deliverables**:
- ✅ Right-click context menu works
- ✅ Selected text translates
- ✅ Translation displays in tooltip
- ✅ Can copy translation

---

### Phase 5: Message Passing & State Management (Est: 3-4 hours)

**Goal**: Implement robust communication between extension components

**Tasks**:
- [ ] Design message passing protocol
- [ ] Implement background script message handlers
- [ ] Add content script message listeners
- [ ] Create popup messaging system
- [ ] Add error handling for disconnections
- [ ] Implement state synchronization
- [ ] Test message reliability

**Message Types**:

```typescript
// src/types/messages.ts

type MessageType =
  | 'TRANSLATE_PAGE'
  | 'TRANSLATE_SELECTION'
  | 'TOGGLE_TRANSLATION'
  | 'UPDATE_SETTINGS'
  | 'GET_STATUS'
  | 'CLEAR_CACHE';

interface Message {
  type: MessageType;
  payload?: any;
  tabId?: number;
}

interface Response {
  success: boolean;
  data?: any;
  error?: string;
}
```

**Communication Flow**:

```
Popup → Background:
- User clicks "Translate Page"
- Popup sends TRANSLATE_PAGE message
- Background receives and processes

Background → Content Script:
- Background gets translation from API
- Sends translated content to tab
- Content script applies translations

Content Script → Background:
- Reports translation status
- Sends errors if translation fails
- Updates progress
```

**State Management Strategy**:
- Use Chrome Storage API for persistence
- React Context for popup state
- Message passing for cross-component state
- Local cache in background script

**Deliverables**:
- ✅ Reliable message passing
- ✅ Error handling for disconnects
- ✅ State syncs across components
- ✅ Progress updates work

---

### Phase 6: Settings & Preferences (Est: 3-4 hours)

**Goal**: Build comprehensive settings interface

**Tasks**:
- [ ] Create settings page UI
- [ ] Implement settings storage
- [ ] Add domain whitelist/blacklist
- [ ] Create keyboard shortcuts
- [ ] Add translation quality options
- [ ] Implement auto-translate toggle
- [ ] Test settings persistence

**Settings Schema**:

```typescript
// src/types/settings.ts

interface ExtensionSettings {
  // General
  autoTranslate: boolean;
  showNotifications: boolean;

  // Translation
  translationQuality: 'fast' | 'balanced' | 'accurate';
  preserveFormatting: boolean;
  translateDynamicContent: boolean;

  // Domains
  whitelistedDomains: string[];
  blacklistedDomains: string[];

  // UI
  tooltipPosition: 'top' | 'bottom' | 'auto';
  theme: 'light' | 'dark' | 'auto';

  // Cache
  enableCache: boolean;
  cacheSize: number;

  // API
  apiProvider: 'google' | 'microsoft' | 'libre';
  apiKey?: string;
}
```

**Settings UI Components**:
- `GeneralSettings.tsx` - Auto-translate, notifications
- `TranslationSettings.tsx` - Quality, formatting options
- `DomainManager.tsx` - Whitelist/blacklist management
- `CacheSettings.tsx` - Cache size, clear cache button
- `ApiSettings.tsx` - Provider selection, API key input
- `KeyboardShortcuts.tsx` - Shortcut configuration

**Keyboard Shortcuts**:
- `Ctrl+Shift+E` - Translate current page
- `Ctrl+Shift+R` - Restore original
- `Ctrl+Shift+S` - Open settings

**Deliverables**:
- ✅ Complete settings page
- ✅ Settings persist across sessions
- ✅ Domain management works
- ✅ Keyboard shortcuts functional

---

### Phase 7: Polish & User Experience (Est: 4-5 hours)

**Goal**: Enhance UX with animations, error handling, and feedback

**Tasks**:
- [ ] Add loading states and spinners
- [ ] Implement error messages and notifications
- [ ] Add success feedback
- [ ] Create onboarding tutorial
- [ ] Add translation progress bar
- [ ] Implement undo/redo functionality
- [ ] Polish animations and transitions
- [ ] Test user flows

**UX Enhancements**:

1. **Loading States**:
   - Skeleton loaders for translated text
   - Progress bar for page translation
   - Spinner for API requests

2. **Error Handling**:
   - Network error messages
   - API quota exceeded warning
   - Invalid API key notification
   - Graceful degradation

3. **User Feedback**:
   - Toast notifications for actions
   - Success animations
   - Translation complete indicator
   - Character count display

4. **Onboarding**:
   - First-time setup wizard
   - API key configuration guide
   - Feature highlights
   - Quick tutorial

**Material-UI Components to Use**:
- `Snackbar` - Notifications
- `LinearProgress` - Progress bar
- `Skeleton` - Loading placeholders
- `Tooltip` - Help text
- `Dialog` - Onboarding modals
- `Alert` - Error messages

**Deliverables**:
- ✅ Smooth loading states
- ✅ Clear error messages
- ✅ User feedback for all actions
- ✅ Onboarding experience

---

### Phase 8: Testing & Bug Fixes (Est: 5-6 hours)

**Goal**: Comprehensive testing and bug fixing

**Tasks**:
- [ ] Write unit tests for utilities
- [ ] Test on major websites (Wikipedia, news sites, blogs)
- [ ] Test on SPAs (Gmail, Twitter, YouTube)
- [ ] Test on e-commerce sites
- [ ] Cross-browser testing (Chrome, Edge, Brave)
- [ ] Performance testing (large pages)
- [ ] Fix identified bugs
- [ ] Optimize performance

**Testing Checklist**:

**Functional Testing**:
- [ ] Popup opens and displays correctly
- [ ] Translate button works
- [ ] Settings save and load
- [ ] Context menu translates selection
- [ ] Toggle between original/translated
- [ ] Keyboard shortcuts work
- [ ] Domain whitelist/blacklist works
- [ ] Cache works correctly

**Compatibility Testing**:
- [ ] Static HTML pages
- [ ] Single-page applications
- [ ] Dynamic content (infinite scroll)
- [ ] Forms and inputs
- [ ] Various encodings (UTF-8, etc.)
- [ ] RTL languages (for UI, not translation)
- [ ] Mobile-responsive sites

**Performance Testing**:
- [ ] Large pages (10,000+ words)
- [ ] Multiple rapid translations
- [ ] Memory usage
- [ ] API rate limiting
- [ ] Cache hit rates

**Edge Cases**:
- [ ] No internet connection
- [ ] Invalid API key
- [ ] API quota exceeded
- [ ] Very long text segments
- [ ] Special characters
- [ ] Malformed HTML

**Deliverables**:
- ✅ All critical bugs fixed
- ✅ Extension works on major sites
- ✅ Performance is acceptable
- ✅ Test coverage >70%

---

### Phase 9: Documentation & Deployment (Est: 3-4 hours)

**Goal**: Prepare for release and create documentation

**Tasks**:
- [ ] Write README.md
- [ ] Create user guide
- [ ] Document API setup process
- [ ] Add code comments
- [ ] Create privacy policy
- [ ] Prepare Chrome Web Store listing
- [ ] Create promotional images
- [ ] Build production version

**Documentation Structure**:

```
README.md
- Project overview
- Features list
- Installation instructions (for development)
- API setup guide
- Build instructions
- Contributing guidelines

USER_GUIDE.md
- How to install from Chrome Web Store
- First-time setup
- How to translate pages
- Settings explanation
- Troubleshooting
- FAQ

PRIVACY_POLICY.md
- Data collection statement
- API usage disclosure
- Storage explanation
- Third-party services

CHANGELOG.md
- Version history
- Feature additions
- Bug fixes
```

**Chrome Web Store Requirements**:
- Extension name and description
- 5 screenshots (1280x800 or 640x400)
- 128x128 store icon
- Small promotional tile (440x280)
- Privacy policy link
- Category selection
- Version number

**Build for Production**:
```bash
npm run build
# Creates optimized build in dist/
# Zip the dist/ folder for upload
```

**Deliverables**:
- ✅ Complete documentation
- ✅ Privacy policy
- ✅ Chrome Web Store listing ready
- ✅ Production build created

---

## Folder Structure

```
esperanto-translator/
├── public/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── manifest.json
├── src/
│   ├── popup/                      # Popup UI (React)
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── TranslateButton.tsx
│   │   │   ├── SettingsDrawer.tsx
│   │   │   ├── StatusIndicator.tsx
│   │   │   └── LanguageDetector.tsx
│   │   ├── hooks/
│   │   │   ├── useTranslation.ts
│   │   │   ├── useSettings.ts
│   │   │   └── useStorage.ts
│   │   ├── theme.ts
│   │   └── index.tsx
│   ├── content/                    # Content Scripts
│   │   ├── content-script.ts
│   │   ├── pageTranslator.ts
│   │   ├── domUtils.ts
│   │   └── selectionHandler.ts
│   ├── background/                 # Background Service Worker
│   │   ├── service-worker.ts
│   │   ├── messageHandler.ts
│   │   ├── contextMenu.ts
│   │   └── storageManager.ts
│   ├── services/                   # Business Logic
│   │   ├── translationService.ts
│   │   ├── apiClient.ts
│   │   ├── cacheService.ts
│   │   └── languageDetector.ts
│   ├── types/                      # TypeScript Types
│   │   ├── messages.ts
│   │   ├── settings.ts
│   │   ├── translation.ts
│   │   └── chrome.d.ts
│   ├── utils/                      # Utilities
│   │   ├── storage.ts
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   └── styles/                     # Global Styles
│       └── global.css
├── tests/                          # Test Files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## Key Implementation Details

### 1. Vite Configuration for Chrome Extension

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
      }
    }
  }
});
```

### 2. Translation Service with Caching

```typescript
// src/services/translationService.ts
export class TranslationService {
  private cache = new Map<string, string>();
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(text: string, targetLang = 'eo'): Promise<string> {
    const cacheKey = `${text}-${targetLang}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Call API
    const url = `https://translation.googleapis.com/language/translate/v2`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        key: this.apiKey
      })
    });

    const data = await response.json();
    const translated = data.data.translations[0].translatedText;

    // Cache result
    this.cache.set(cacheKey, translated);

    return translated;
  }
}
```

### 3. Content Script DOM Manipulation

```typescript
// src/content/pageTranslator.ts
export class PageTranslator {
  private textNodes: Text[] = [];
  private translations = new Map<Text, string>();

  extractTextNodes(root: Node = document.body): Text[] {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip empty text nodes
          if (!node.textContent?.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip script, style, code elements
          const parent = node.parentElement;
          if (parent?.matches('script, style, code, pre')) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes: Text[] = [];
    let node: Node | null;
    while (node = walker.nextNode()) {
      nodes.push(node as Text);
    }

    return nodes;
  }

  async translatePage(): Promise<void> {
    this.textNodes = this.extractTextNodes();

    // Extract text content
    const texts = this.textNodes.map(node => node.textContent || '');

    // Send to background for translation
    const response = await chrome.runtime.sendMessage({
      type: 'BATCH_TRANSLATE',
      payload: { texts }
    });

    // Apply translations
    this.textNodes.forEach((node, index) => {
      const original = node.textContent;
      const translated = response.translations[index];

      // Store original for toggling
      this.translations.set(node, original!);

      // Replace with translation
      node.textContent = translated;
    });
  }
}
```

### 4. Message Passing Pattern

```typescript
// src/background/messageHandler.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'TRANSLATE_PAGE':
      handleTranslatePage(message.payload, sender.tab?.id)
        .then(sendResponse);
      return true; // Keep channel open for async

    case 'BATCH_TRANSLATE':
      handleBatchTranslate(message.payload)
        .then(sendResponse);
      return true;

    case 'UPDATE_SETTINGS':
      handleUpdateSettings(message.payload)
        .then(sendResponse);
      return true;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});
```

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
// tests/unit/translationService.test.ts
import { describe, it, expect } from 'vitest';
import { TranslationService } from '@/services/translationService';

describe('TranslationService', () => {
  it('should cache translations', async () => {
    const service = new TranslationService('test-key');
    const text = 'Hello world';

    const first = await service.translate(text);
    const second = await service.translate(text);

    expect(first).toBe(second);
    // Verify only one API call was made
  });
});
```

### Integration Tests

```typescript
// tests/integration/extension.test.ts
describe('Extension Integration', () => {
  it('should translate page via popup', async () => {
    // Load extension
    // Open popup
    // Click translate button
    // Verify page is translated
  });
});
```

### Manual Testing Checklist

- [ ] Install extension in Chrome
- [ ] Open Wikipedia article
- [ ] Click translate button
- [ ] Verify text is translated
- [ ] Toggle back to original
- [ ] Right-click translate selection
- [ ] Check settings persistence
- [ ] Test on Gmail (SPA)
- [ ] Test on YouTube (dynamic)
- [ ] Verify error handling

---

## Deployment & Distribution

### Pre-Release Checklist

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Privacy policy published
- [ ] API key instructions clear
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Screenshots prepared
- [ ] Icons finalized

### Chrome Web Store Submission

1. **Create Developer Account**
   - Pay $5 one-time registration fee
   - Verify identity

2. **Prepare Listing**
   - Extension name (30 chars max)
   - Short description (132 chars max)
   - Detailed description (16,000 chars max)
   - Category selection
   - Language selection

3. **Upload Extension**
   - Zip the build folder
   - Upload to developer dashboard
   - Fill out store listing
   - Add screenshots and promotional images

4. **Submit for Review**
   - Review typically takes 1-3 days
   - Address any feedback
   - Publish once approved

### Distribution Options

- **Chrome Web Store** (recommended)
- **Self-hosted** (.crx file)
- **Enterprise deployment**
- **GitHub releases** (for developers)

---

## Future Enhancements

### Post-MVP Features

**Phase 10: Advanced Features**
- [ ] Translation history viewer with search
- [ ] Custom dictionary/glossary support
- [ ] Side-by-side comparison mode
- [ ] Export translated pages as PDF/HTML
- [ ] Translation quality feedback system
- [ ] Multi-language support (not just Esperanto)

**Phase 11: Performance Optimization**
- [ ] Implement service worker caching
- [ ] Add IndexedDB for large cache
- [ ] Optimize DOM operations
- [ ] Lazy loading for large pages
- [ ] Progressive translation (visible content first)

**Phase 12: Enterprise Features**
- [ ] Team collaboration features
- [ ] Translation memory sharing
- [ ] Custom API endpoint support
- [ ] Analytics dashboard
- [ ] Usage tracking and reporting

**Phase 13: AI Enhancements**
- [ ] Context-aware translation
- [ ] Learning from user corrections
- [ ] Automatic quality assessment
- [ ] Alternative translation suggestions
- [ ] Terminology extraction

---

## Timeline Estimate

| Phase | Description | Hours | Days (4h/day) |
|-------|-------------|-------|---------------|
| 0 | Project Setup | 2-3 | 0.5 |
| 1 | Extension Foundation | 4-5 | 1.0 |
| 2 | Translation Service | 5-6 | 1.5 |
| 3 | Content Script | 6-8 | 1.5 |
| 4 | Context Menu | 3-4 | 1.0 |
| 5 | Message Passing | 3-4 | 1.0 |
| 6 | Settings | 3-4 | 1.0 |
| 7 | Polish & UX | 4-5 | 1.0 |
| 8 | Testing | 5-6 | 1.5 |
| 9 | Documentation | 3-4 | 1.0 |
| **Total** | | **38-49 hours** | **10-12 days** |

**Note**: This is a rough estimate. Actual time may vary based on:
- Your experience with the technologies
- Complexity of edge cases encountered
- Debugging time
- API integration challenges

---

## Success Metrics

### MVP Success Criteria

- [ ] Extension loads without errors
- [ ] Can translate at least 90% of text on standard pages
- [ ] Translation accuracy >80% (spot checks)
- [ ] Performance: < 3 seconds for average page
- [ ] No console errors on major websites
- [ ] Settings persist correctly
- [ ] Works on Chrome, Edge, and Brave
- [ ] User can install and use without technical knowledge

### User Experience Goals

- Simple, intuitive interface
- Clear feedback for all actions
- Graceful error handling
- Fast response times
- Minimal configuration needed
- Professional appearance

---

## Risk Mitigation

### Potential Challenges

1. **Translation API Costs**
   - **Risk**: High usage could incur costs
   - **Mitigation**: Implement aggressive caching, rate limiting, and usage warnings

2. **Translation Quality**
   - **Risk**: Esperanto support may vary by provider
   - **Mitigation**: Test multiple providers, allow user to switch, provide feedback mechanism

3. **Complex Websites**
   - **Risk**: SPAs and dynamic sites are hard to translate
   - **Mitigation**: Use MutationObserver, implement retry logic, allow manual refresh

4. **Performance on Large Pages**
   - **Risk**: Translating 10,000+ words may be slow
   - **Mitigation**: Implement progressive translation, show progress indicator

5. **Browser Compatibility**
   - **Risk**: Manifest V3 has some limitations
   - **Mitigation**: Thorough testing, graceful degradation, clear requirements

---

## Getting Started

### Quick Start Guide

1. **Clone and Setup**
```bash
git clone <repository-url>
cd esperanto-translator
npm install
```

2. **Configure API Key**
```bash
cp .env.example .env
# Edit .env and add your Google Translate API key
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Load Extension in Chrome**
- Open `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist/` folder

5. **Test the Extension**
- Click the extension icon
- Navigate to any webpage
- Click "Translate Page"

---

## Resources

### Documentation Links

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Google Cloud Translation API](https://cloud.google.com/translate/docs)
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

### Helpful Tools

- [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
- [Extension Icon Generator](https://www.iconfinder.com/)
- [Esperanto Dictionary](https://www.reta-vortaro.de/)

### Community

- [Chrome Extension Developers Group](https://groups.google.com/a/chromium.org/g/chromium-extensions)
- [Stack Overflow - Chrome Extensions](https://stackoverflow.com/questions/tagged/google-chrome-extension)
- [Reddit - r/chrome_extensions](https://www.reddit.com/r/chrome_extensions/)

---

## Conclusion

This roadmap provides a comprehensive, step-by-step plan to build a fully functional Esperanto translator Chrome extension. The MVP focuses on core functionality while maintaining high code quality and user experience standards.

**Key Success Factors**:
- ✅ Clear phase-by-phase approach
- ✅ Modern tech stack (React, TypeScript, Vite, MUI)
- ✅ Manifest V3 compliance
- ✅ Comprehensive testing strategy
- ✅ Focus on UX and polish
- ✅ Scalable architecture for future enhancements

**Next Steps**:
1. Review this roadmap
2. Set up development environment (Phase 0)
3. Start with Phase 1 (Extension Foundation)
4. Work through phases sequentially
5. Test thoroughly at each phase
6. Iterate based on feedback

Let's build something amazing! 🚀🌐

---

**Document Version**: 1.0
**Last Updated**: November 24, 2025
**Author**: Victor Williams (@Vaporjawn)
