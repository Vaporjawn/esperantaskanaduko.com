# Testing Guide: Toggle Translation Feature

## Quick Start

### Load Extension in Chrome

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist/` folder from your project

3. **Verify Installation**:
   - Extension icon should appear in toolbar
   - Click icon to open popup
   - Should see "Esperanto Translator" interface

## Testing Checklist

### ✅ Basic Toggle Functionality

**Test 1: Initial Translation**
1. Navigate to any webpage (e.g., https://en.wikipedia.org/wiki/JavaScript)
2. Click extension icon to open popup
3. Click "Translate to Esperanto" button
4. **Expected**:
   - Button shows loading state with spinner
   - Button text changes to "Translating..."
   - Page content translates to Esperanto
   - Button changes to "Restore Original"
   - Status indicator shows "ready" with green check

**Test 2: Toggle Back to Original**
1. With page translated, click "Restore Original" button
2. **Expected**:
   - Button shows brief loading state
   - Page content restores to original language
   - Button changes back to "Translate to Esperanto"
   - Operation completes in <100ms

**Test 3: Quick Toggle (Cache Test)**
1. Click "Translate to Esperanto" again
2. **Expected**:
   - Translation applies almost instantly (<100ms)
   - No API call needed (cached)
   - Smooth transition

### ✅ State Persistence

**Test 4: Popup Close/Reopen**
1. Translate a page
2. Close popup (click outside or press Esc)
3. Reopen popup by clicking extension icon
4. **Expected**:
   - Button shows "Restore Original" (remembers state)
   - Status shows correct translation state

**Test 5: Browser Tab Switching**
1. Translate page in Tab A
2. Switch to Tab B (not translated)
3. Open popup in Tab B
4. **Expected**: Button shows "Translate to Esperanto" (different state)
5. Switch back to Tab A
6. Open popup
7. **Expected**: Button shows "Restore Original" (preserved state)

**Test 6: Page Refresh**
1. Translate a page
2. Refresh the page (F5)
3. Open popup
4. **Expected**:
   - Button shows "Translate to Esperanto" (state reset)
   - Can translate page again

### ✅ Content Handling

**Test 7: Code Blocks Not Translated**
1. Navigate to page with code (e.g., GitHub README with code blocks)
2. Translate page
3. **Expected**: Code blocks remain in original language

**Test 8: Large Page Performance**
1. Navigate to long article (e.g., https://en.wikipedia.org/wiki/World_War_II)
2. Translate page
3. **Expected**:
   - Translation completes in reasonable time (3-10 seconds)
   - Page remains responsive during translation
   - All visible text is translated

**Test 9: Dynamic Content (SPA)**
1. Navigate to single-page app (e.g., Gmail, Twitter)
2. Translate page
3. Interact with page (scroll, click, navigate)
4. **Expected**:
   - Initial content translates
   - New content translation behavior depends on MutationObserver implementation

### ✅ Error Handling

**Test 10: Network Error**
1. Disconnect internet
2. Try to translate new page
3. **Expected**:
   - Error message displayed
   - Status shows "error" state
   - Button remains clickable
   - No crashes

**Test 11: Invalid API Key**
1. Set invalid API key in .env file
2. Try to translate
3. **Expected**:
   - API error caught gracefully
   - Error status displayed
   - User-friendly error message

**Test 12: Very Long Text**
1. Navigate to page with very long paragraphs
2. Translate page
3. **Expected**:
   - Batch translation handles large text
   - No timeout errors
   - Complete translation

### ✅ UI/UX Testing

**Test 13: Button States**
1. Observe button through translation cycle
2. **Expected States**:
   - Idle: "Translate to Esperanto" with translate icon
   - Loading: "Translating..." with spinner
   - Translated: "Restore Original" with restore icon

**Test 14: Status Indicator**
1. Watch status chip through operations
2. **Expected**:
   - Ready state: Green chip with checkmark
   - Translating: Yellow/orange chip
   - Error: Red chip with error icon

**Test 15: Detected Language Display**
1. Translate English page
2. Check popup
3. **Expected**: Shows "Detected language: en"

## Performance Benchmarks

### Expected Timing:

| Operation | Expected Time | Acceptable Range |
|-----------|---------------|------------------|
| Initial Translation (small page) | 2-3 seconds | 1-5 seconds |
| Initial Translation (large page) | 5-8 seconds | 3-15 seconds |
| Toggle to Cached | <100ms | <200ms |
| Restore Original | <50ms | <100ms |
| State Load on Popup | <10ms | <50ms |

### Memory Usage:
- Extension idle: <5MB
- After translation: <20MB (includes cache)
- Large page translated: <50MB

## Test Pages Recommendations

### Good Test Pages:
- **Wikipedia articles**: Clean HTML, good test case
- **News sites**: Various content types, images, formatting
- **GitHub**: Code blocks, markdown, dynamic content
- **Medium**: Clean article format, images
- **Stack Overflow**: Code blocks, user-generated content

### Challenging Test Pages:
- **Gmail**: Heavy SPA, dynamic content
- **Twitter/X**: Infinite scroll, dynamic updates
- **YouTube**: Videos, comments, dynamic loading
- **Reddit**: Comment threads, dynamic content
- **Google Docs**: Rich text editor, complex DOM

## Known Limitations (MVP)

1. **Dynamic Content**: New content after translation may not auto-translate (MutationObserver TODO)
2. **Input Fields**: Form inputs not translated (by design)
3. **Images**: Alt text not translated (future enhancement)
4. **iframes**: Content in iframes not translated
5. **Shadow DOM**: Components with shadow DOM not reached

## Debugging Tips

### Check Console Logs:
```javascript
// Content script logs
console.log('Esperanto Translator content script loaded');

// Translation errors
console.error('Translation error:', error);

// Background script logs
console.error('Message handler error:', error);
```

### Inspect Chrome Storage:
1. Open DevTools (F12)
2. Application tab → Storage → Local Storage
3. Look for keys: `translation_state_*`
4. Verify state is being saved/loaded

### Check Extension Background Page:
1. Go to `chrome://extensions/`
2. Click "service worker" link under your extension
3. View background script console logs
4. Check for API errors or message passing issues

## Bug Reporting Template

If you find a bug, please report with:

```
**Bug**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happened]
**Page URL**: [Where it occurred]
**Browser**: Chrome [version]
**Console Errors**: [Any error messages]
**Screenshots**: [If applicable]
```

## Success Criteria

✅ All basic toggle tests pass
✅ State persistence works across sessions
✅ No console errors during normal operation
✅ Performance within acceptable ranges
✅ UI responsive and intuitive
✅ Error handling graceful and user-friendly

## Next Steps After Testing

1. Document any bugs found
2. Create GitHub issues for enhancements
3. Update roadmap with next phase priorities
4. Consider user feedback integration
5. Prepare for Chrome Web Store submission

---

**Happy Testing! 🧪✅**
