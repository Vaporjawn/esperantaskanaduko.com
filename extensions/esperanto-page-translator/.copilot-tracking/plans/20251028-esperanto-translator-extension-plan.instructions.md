# Chrome Extension Esperanto Translator - Implementation Plan

**Plan Date**: October 28, 2025
**Project**: Esperanto Page Translator Chrome Extension
**Tech Stack**: Vite + TypeScript + React + Material-UI
**Target**: Chrome Manifest V3

---

## Project Overview

Build a Chrome extension that translates web pages to Esperanto with toggle functionality and right-click context menu support. Uses modern tooling (Vite, TypeScript, React) with Material-UI for the popup interface.

**Core Features**:
- Full-page translation to Esperanto via extension icon click
- Revert to original content with second click (toggle functionality)
- Right-click context menu option for translating selected text
- Material-UI powered popup interface
- LibreTranslate API integration (free, open-source)

**Research Foundation**: See `.copilot-tracking/research/20251028-chrome-extension-esperanto-translator-research.md` (Lines 1-500+)

---

## Implementation Checklist

### Phase 1: Project Setup and Foundation (Lines 1-150 in details file)
- [ ] **Step 1.1**: Initialize Vite + React + TypeScript project
  - Use `npm create vite@latest esperanto-translator -- --template react-ts`
  - Configure for Chrome extension build output
  - Install Material-UI dependencies
  - **Success Criteria**: Dev server runs successfully, MUI components render

- [ ] **Step 1.2**: Configure Chrome Extension structure
  - Create `public/manifest.json` with Manifest V3 configuration
  - Add required permissions: `activeTab`, `storage`, `contextMenus`, `scripting`
  - Set up icons (16x16, 48x48, 128x128)
  - **Success Criteria**: Extension loads in Chrome without errors
  - **Details**: Lines 15-80 in details file

- [ ] **Step 1.3**: Configure Vite for Chrome extension build
  - Modify `vite.config.ts` for multi-entry build (popup, content script, background)
  - Configure output structure matching Chrome extension requirements
  - Set up HMR (Hot Module Replacement) for development
  - **Success Criteria**: `npm run build` produces correct extension structure in `dist/`
  - **Details**: Lines 81-150 in details file

### Phase 2: Translation Service Integration (Lines 151-280 in details file)
- [ ] **Step 2.1**: Create Translation Service module
  - Implement `src/services/translationService.ts` with LibreTranslate API integration
  - Add TypeScript interfaces for API request/response
  - Implement error handling and retry logic
  - Add request caching to avoid duplicate translations
  - **Success Criteria**: Can translate sample text to Esperanto via API
  - **Details**: Lines 151-210 in details file

- [ ] **Step 2.2**: Create Content Script for DOM manipulation
  - Implement `src/content/contentScript.ts` for text extraction from page
  - Create DOM traversal logic to find translatable text nodes
  - Implement original content preservation (data attributes approach)
  - Add batch processing for large pages (avoid freezing)
  - **Success Criteria**: Can extract all text from webpage, preserve original state
  - **Details**: Lines 211-280 in details file

### Phase 3: Background Service Worker (Lines 281-380 in details file)
- [ ] **Step 3.1**: Implement background service worker
  - Create `src/background/background.ts` for extension lifecycle management
  - Set up message passing between content script and popup
  - Implement Chrome storage management for translation state
  - Add context menu creation on extension install
  - **Success Criteria**: Background worker responds to messages, manages state
  - **Details**: Lines 281-330 in details file

- [ ] **Step 3.2**: Implement context menu functionality
  - Create context menu item for "Translate to Esperanto" on text selection
  - Set up click handler to send selected text for translation
  - Implement in-place translation replacement for selected text
  - **Success Criteria**: Right-clicking selected text shows translation option, translates on click
  - **Details**: Lines 331-380 in details file

### Phase 4: Material-UI Popup Interface (Lines 381-520 in details file)
- [ ] **Step 4.1**: Design and implement popup UI components
  - Create `src/popup/App.tsx` with Material-UI components
  - Implement toggle button (Translate ↔ Revert)
  - Add loading state with CircularProgress
  - Create settings icon for future options page
  - Apply Esperanto-themed color scheme (green from flag)
  - **Success Criteria**: Popup renders with professional Material-UI design
  - **Details**: Lines 381-450 in details file

- [ ] **Step 4.2**: Connect popup to background worker
  - Implement message passing to trigger translation from popup
  - Add state synchronization (show current translation state)
  - Handle loading states during translation
  - Display error messages for failed translations
  - **Success Criteria**: Clicking popup button translates page, shows accurate state
  - **Details**: Lines 451-520 in details file

### Phase 5: Toggle Functionality (Lines 521-620 in details file)
- [ ] **Step 5.1**: Implement original content storage
  - Create system to store original text in data attributes before translation
  - Implement per-tab state management in chrome.storage
  - Add translation state flag (translated/original)
  - **Success Criteria**: Original content perfectly preserved and retrievable
  - **Details**: Lines 521-570 in details file

- [ ] **Step 5.2**: Implement revert functionality
  - Create revert logic to restore original text from data attributes
  - Update tab state to "original" after revert
  - Clear translation cache for tab
  - Update popup UI to reflect original state
  - **Success Criteria**: Clicking "Revert" perfectly restores original page
  - **Details**: Lines 571-620 in details file

### Phase 6: Error Handling and Edge Cases (Lines 621-720 in details file)
- [ ] **Step 6.1**: Implement comprehensive error handling
  - Add try-catch blocks around API calls
  - Handle network failures with user-friendly messages
  - Implement rate limit handling for LibreTranslate API
  - Add timeout handling for slow API responses
  - **Success Criteria**: Extension gracefully handles all error scenarios
  - **Details**: Lines 621-670 in details file

- [ ] **Step 6.2**: Handle edge cases
  - Skip translation for `<script>`, `<style>`, `<code>` elements
  - Handle dynamic content (SPAs) with MutationObserver
  - Preserve input field values during translation
  - Handle iframes appropriately
  - **Success Criteria**: Extension works correctly on complex websites
  - **Details**: Lines 671-720 in details file

### Phase 7: Testing and Quality Assurance (Lines 721-850 in details file)
- [ ] **Step 7.1**: Unit testing
  - Write tests for translation service API integration
  - Test text extraction and DOM manipulation logic
  - Test original content storage/retrieval
  - **Success Criteria**: All unit tests pass with ≥80% coverage
  - **Details**: Lines 721-770 in details file

- [ ] **Step 7.2**: Integration testing
  - Test background worker ↔ content script messaging
  - Test popup ↔ background worker communication
  - Test context menu integration
  - **Success Criteria**: All integration tests pass
  - **Details**: Lines 771-820 in details file

- [ ] **Step 7.3**: Manual testing on real websites
  - Test on Wikipedia (complex DOM)
  - Test on news sites (dynamic content)
  - Test on GitHub (code blocks should not translate)
  - Test on Gmail (verify no functionality breaking)
  - Test on large pages (performance validation)
  - **Success Criteria**: Extension works correctly on all test sites
  - **Details**: Lines 821-850 in details file

### Phase 8: Performance Optimization (Lines 851-920 in details file)
- [ ] **Step 8.1**: Optimize bundle size
  - Implement Material-UI tree-shaking
  - Use dynamic imports for heavy components
  - Minimize third-party dependencies
  - **Success Criteria**: Extension bundle < 500KB
  - **Details**: Lines 851-890 in details file

- [ ] **Step 8.2**: Optimize translation performance
  - Implement request batching (translate multiple text nodes together)
  - Add translation result caching
  - Implement incremental translation (visible content first)
  - **Success Criteria**: Large pages translate in < 5 seconds
  - **Details**: Lines 891-920 in details file

### Phase 9: Polish and Documentation (Lines 921-1000 in details file)
- [ ] **Step 9.1**: Accessibility improvements
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works properly
  - Test with screen readers
  - **Success Criteria**: WCAG 2.1 AA compliance verified
  - **Details**: Lines 921-960 in details file

- [ ] **Step 9.2**: Create user documentation
  - Write README.md with installation instructions
  - Create user guide for features
  - Add troubleshooting section
  - Document known limitations
  - **Success Criteria**: Non-technical users can install and use extension
  - **Details**: Lines 961-1000 in details file

### Phase 10: Deployment Preparation (Lines 1001-1050 in details file)
- [ ] **Step 10.1**: Prepare for Chrome Web Store
  - Create promotional images (screenshots, hero image)
  - Write store description
  - Prepare privacy policy
  - Create demo video (optional)
  - **Success Criteria**: All Chrome Web Store assets ready
  - **Details**: Lines 1001-1030 in details file

- [ ] **Step 10.2**: Final validation
  - Review all Chrome Extension best practices
  - Security audit of API key handling
  - Performance benchmarking on slow connections
  - Cross-browser testing (Chrome, Edge)
  - **Success Criteria**: Extension ready for public release
  - **Details**: Lines 1031-1050 in details file

---

## Success Metrics

**Functionality**:
- ✅ Full page translates to Esperanto accurately
- ✅ Toggle restores 100% of original content
- ✅ Context menu translates selected text
- ✅ Works on 95%+ of websites tested

**Performance**:
- ✅ Translation completes in < 5 seconds for average page
- ✅ Extension bundle size < 500KB
- ✅ No noticeable lag or freezing

**Quality**:
- ✅ Zero critical bugs
- ✅ Unit test coverage ≥ 80%
- ✅ Integration tests passing
- ✅ WCAG 2.1 AA compliance

**User Experience**:
- ✅ Intuitive Material-UI interface
- ✅ Clear loading states
- ✅ Helpful error messages
- ✅ Keyboard accessible

---

## Risk Mitigation Strategies

**Risk**: LibreTranslate API rate limiting
**Mitigation**: Implement request queue, add retry with exponential backoff
**Fallback**: Prepare Google Translate API integration as backup

**Risk**: Complex websites breaking during translation
**Mitigation**: Whitelist/blacklist specific sites, skip problematic elements
**Fallback**: Show error message with manual refresh option

**Risk**: Poor translation quality
**Mitigation**: User testing phase, feedback collection
**Fallback**: Document as beta feature, add manual correction option in future

**Risk**: Extension performance on large pages
**Mitigation**: Batch processing, incremental translation
**Fallback**: Add page size warning, allow partial translation

---

## Dependencies and Prerequisites

**Required Tools**:
- Node.js 18+ and npm
- Chrome browser (latest version)
- TypeScript 5.0+
- Git for version control

**Key Dependencies**:
- Vite 5.x (build tool)
- React 18.x (UI framework)
- Material-UI 5.x (component library)
- @types/chrome (TypeScript definitions)

**Optional Tools**:
- ESLint + Prettier (code quality)
- Vitest or Jest (testing framework)
- Chrome Extension testing framework

---

## Timeline Estimate

**Phase 1-2** (Setup + Translation): 2-3 days
**Phase 3-4** (Background + Popup): 2-3 days
**Phase 5-6** (Toggle + Error Handling): 2 days
**Phase 7** (Testing): 2-3 days
**Phase 8-9** (Optimization + Polish): 2 days
**Phase 10** (Deployment Prep): 1 day

**Total Estimate**: 11-14 days (full-time work)

---

## Next Steps

1. Review this implementation plan
2. Review detailed specifications in `20251028-esperanto-translator-extension-details.md`
3. Set up development environment
4. Begin Phase 1: Project Setup
5. Follow checklist sequentially, marking items complete

**Ready for Implementation**: ✅ YES - Comprehensive research foundation established

