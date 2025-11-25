# Translation Feature Testing Guide

## Overview

This guide provides step-by-step instructions for testing the "Translate all visible text on page" feature in the Esperanto Translator Chrome Extension.

---

## Pre-Testing Setup

### 1. Build the Extension

```bash
cd /Users/victorwilliams/Documents/GitHub/esperanto-translator
npm run build
```

Expected output:
```
✓ built in ~500ms
dist/assets/content-script.ts-*.js
dist/assets/popup-*.js
dist/manifest.json
```

### 2. Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"**
5. Select the `dist/` folder from the project directory
6. Verify extension appears with icon and no errors

### 3. Configure API Key

1. Click the extension icon in Chrome toolbar
2. Open Settings drawer
3. Enter your Google Cloud Translation API key
4. Save settings

---

## Test Suite 1: Basic Translation

### Test 1.1: Simple Web Page

**Objective**: Verify basic translation functionality works

**Steps**:
1. Open the test page: `file:///Users/victorwilliams/Documents/GitHub/esperanto-translator/test-page.html`
2. Click extension icon in toolbar
3. Click **"Translate Page"** button
4. Observe progress indicator in popup

**Expected Results**:
- ✅ Progress indicator shows 0% → 100%
- ✅ Visible text is translated to Esperanto
- ✅ Page layout and formatting preserved
- ✅ Translation completes in 5-10 seconds

**Pass/Fail**: ☐

---

### Test 1.2: Toggle Translation

**Objective**: Verify translation can be toggled on/off

**Steps**:
1. With page already translated (from Test 1.1)
2. Click extension icon
3. Click **"Toggle Translation"** button
4. Observe page returns to original English
5. Click **"Toggle Translation"** again
6. Observe page returns to Esperanto

**Expected Results**:
- ✅ Instant toggle to original text (no API call)
- ✅ Instant toggle back to translated text (cached)
- ✅ All text restored correctly in both directions
- ✅ No layout shifts or glitches

**Pass/Fail**: ☐

---

### Test 1.3: Restore Original

**Objective**: Verify restore functionality clears translation

**Steps**:
1. With page translated
2. Click extension icon
3. Click **"Restore Original"** button

**Expected Results**:
- ✅ Page immediately shows original English text
- ✅ Translation state cleared
- ✅ Next translation will be fresh (not cached)

**Pass/Fail**: ☐

---

## Test Suite 2: Edge Cases

### Test 2.1: Hidden Content Exclusion

**Objective**: Verify hidden elements are not translated

**Steps**:
1. On test page, locate "Test Case 2: Hidden Content"
2. Before translation, note the hidden text elements:
   - `display: none` paragraph
   - `visibility: hidden` paragraph
   - `opacity: 0` paragraph
3. Translate the page
4. Inspect hidden elements in DevTools

**Expected Results**:
- ✅ Visible text before and after hidden elements IS translated
- ✅ Hidden `display: none` text is NOT translated
- ✅ Invisible `visibility: hidden` text is NOT translated
- ✅ Zero opacity text is NOT translated

**Verification Method**:
```javascript
// In DevTools Console:
document.querySelector('.hidden-text').textContent
// Should still be English: "This text is display:none..."
```

**Pass/Fail**: ☐

---

### Test 2.2: Code Block Preservation

**Objective**: Verify code blocks remain untranslated

**Steps**:
1. On test page, locate "Test Case 3: Code Blocks"
2. Note the JavaScript code in `<pre><code>` block
3. Translate the page
4. Verify code block content

**Expected Results**:
- ✅ Surrounding descriptive text IS translated
- ✅ Code inside `<pre>` tags is NOT translated
- ✅ Inline `<code>` elements are NOT translated
- ✅ Code syntax and formatting preserved

**Verification Method**:
```javascript
// In DevTools Console:
document.querySelector('.code-block').textContent
// Should still contain "function translatePage()" etc.
```

**Pass/Fail**: ☐

---

### Test 2.3: Form Element Exclusion

**Objective**: Verify form inputs are not translated

**Steps**:
1. On test page, locate "Test Case 5: Form Elements"
2. Note form input values:
   - Input field: "John Doe"
   - Textarea: "This is a user input field"
   - Select options: "English", "Spanish", "French"
3. Translate the page
4. Check form field values

**Expected Results**:
- ✅ Form field VALUES are NOT translated
- ✅ Labels and surrounding text ARE translated
- ✅ Placeholder text in inputs is NOT translated
- ✅ Form remains fully functional

**Verification Method**:
```javascript
// In DevTools Console:
document.querySelector('#name').value
// Should still be "John Doe"
```

**Pass/Fail**: ☐

---

### Test 2.4: Special Characters

**Objective**: Verify special characters handled correctly

**Steps**:
1. On test page, locate "Test Case 6: Special Characters"
2. Note special characters before translation
3. Translate the page
4. Verify special characters preserved

**Expected Results**:
- ✅ Copyright symbols (©, ®, ™) preserved
- ✅ Currency symbols (€, £, ¥) preserved
- ✅ HTML entities rendered correctly
- ✅ Emojis (😀 🎉 🚀) preserved
- ✅ Accented characters handled properly

**Pass/Fail**: ☐

---

### Test 2.5: Table Translation

**Objective**: Verify table content is translated correctly

**Steps**:
1. On test page, locate "Test Case 8: Tables"
2. Note table structure and content
3. Translate the page
4. Verify table translation

**Expected Results**:
- ✅ Table headers ARE translated
- ✅ Table cell content IS translated
- ✅ Table structure preserved (rows, columns, borders)
- ✅ No layout breaks or misalignments

**Pass/Fail**: ☐

---

## Test Suite 3: Dynamic Content

### Test 3.1: Dynamic Content Addition

**Objective**: Verify newly added content is automatically translated

**Steps**:
1. On test page, translate the page first
2. Locate "Test Case 9: Dynamic Content Loading"
3. Click **"Add Dynamic Content"** button multiple times
4. Observe new content as it appears

**Expected Results**:
- ✅ New content appears with translated text
- ✅ Translation happens automatically (no manual action)
- ✅ Each added block is translated correctly
- ✅ Console shows "Dynamic content added" logs

**Verification Method**:
```javascript
// In DevTools Console - should see MutationObserver logs:
// "Translating X new nodes..."
```

**Pass/Fail**: ☐

---

### Test 3.2: MutationObserver Performance

**Objective**: Verify mutation observer doesn't cause performance issues

**Steps**:
1. With page translated and mutation observer active
2. Click "Add Dynamic Content" button 10 times rapidly
3. Monitor CPU usage in DevTools Performance tab
4. Verify all content translates correctly

**Expected Results**:
- ✅ All dynamic content translates successfully
- ✅ No significant CPU spikes
- ✅ No UI freezing or lag
- ✅ Translation batching works for multiple additions

**Pass/Fail**: ☐

---

## Test Suite 4: Large Pages

### Test 4.1: Wikipedia Article

**Objective**: Test translation on real large page

**Steps**:
1. Open a large Wikipedia article (e.g., "History of the United States")
2. Click extension icon
3. Click "Translate Page"
4. Monitor progress in popup

**Expected Results**:
- ✅ Progress indicator shows incremental progress
- ✅ Page translates in chunks (not all at once)
- ✅ Translation completes without errors
- ✅ Page remains scrollable and usable during translation
- ✅ All sections are translated

**Estimated Time**: 10-30 seconds depending on article length

**Pass/Fail**: ☐

---

### Test 4.2: News Website

**Objective**: Test on real-world content with ads and mixed elements

**Steps**:
1. Open a news article (e.g., CNN, BBC, Reuters)
2. Translate the page
3. Verify article content translation

**Expected Results**:
- ✅ Article headline translated
- ✅ Article body translated
- ✅ Navigation links translated
- ✅ Ads remain functional (may or may not be translated)
- ✅ Images and videos preserved

**Pass/Fail**: ☐

---

## Test Suite 5: Single Page Applications (SPAs)

### Test 5.1: Gmail

**Objective**: Test on Gmail SPA with dynamic content

**Steps**:
1. Open Gmail in Chrome
2. Translate the page
3. Click through to different emails
4. Observe if new content is translated

**Expected Results**:
- ✅ Initial page content translated
- ✅ Email list items translated
- ✅ Email content translated when opened
- ✅ New emails loaded dynamically are translated

**Note**: Gmail structure may be complex; focus on main content areas

**Pass/Fail**: ☐

---

### Test 5.2: Twitter/X

**Objective**: Test on infinite scroll feed

**Steps**:
1. Open Twitter/X feed
2. Translate the page
3. Scroll down to load more tweets
4. Observe new tweets as they load

**Expected Results**:
- ✅ Initial visible tweets translated
- ✅ New tweets from infinite scroll are translated automatically
- ✅ Tweet thread content translated
- ✅ No performance degradation with many tweets

**Pass/Fail**: ☐

---

## Test Suite 6: Error Handling

### Test 6.1: Invalid API Key

**Objective**: Verify graceful error handling for API failures

**Steps**:
1. Open extension settings
2. Enter an invalid API key
3. Attempt to translate a page
4. Observe error handling

**Expected Results**:
- ✅ Clear error message displayed
- ✅ Original text remains visible
- ✅ No browser console errors (except expected API error)
- ✅ Page remains functional

**Pass/Fail**: ☐

---

### Test 6.2: Network Failure

**Objective**: Verify handling of network issues

**Steps**:
1. Open DevTools → Network tab
2. Set network throttling to "Offline"
3. Attempt to translate a page
4. Observe behavior

**Expected Results**:
- ✅ Error message about network failure
- ✅ Original text preserved
- ✅ Extension doesn't crash
- ✅ Can retry when network returns

**Pass/Fail**: ☐

---

### Test 6.3: Partial Translation Failure

**Objective**: Verify handling when some chunks fail

**Steps**:
1. On large page, start translation
2. Quickly toggle airplane mode during translation
3. Observe partial translation state

**Expected Results**:
- ✅ Successfully translated chunks are applied
- ✅ Failed chunks fall back to original text
- ✅ Clear indication of partial success
- ✅ Can retry to complete translation

**Pass/Fail**: ☐

---

## Test Suite 7: Performance Metrics

### Test 7.1: Translation Speed

**Objective**: Measure translation performance

**Test Pages**:
- Small page (~50 text nodes): _______ seconds
- Medium page (~200 text nodes): _______ seconds
- Large page (~500+ text nodes): _______ seconds

**Target Performance**:
- Small: < 2 seconds
- Medium: < 5 seconds
- Large: < 15 seconds

**Pass/Fail**: ☐

---

### Test 7.2: Memory Usage

**Objective**: Verify no memory leaks

**Steps**:
1. Open DevTools → Memory tab
2. Take heap snapshot
3. Translate page
4. Restore original
5. Take another heap snapshot
6. Compare memory usage

**Expected Results**:
- ✅ Memory usage returns to near-baseline after restore
- ✅ No significant memory leaks detected
- ✅ Detached DOM nodes cleaned up

**Pass/Fail**: ☐

---

## Test Suite 8: Browser Compatibility

### Test 8.1: Chrome Version Compatibility

Test on multiple Chrome versions:
- ☐ Chrome 120+ (latest)
- ☐ Chrome 115-119 (recent)
- ☐ Chrome 110-114 (older but supported)

**Expected Results**:
- ✅ Works on all tested versions
- ✅ No console errors
- ✅ All features functional

---

### Test 8.2: Chromium-Based Browsers

Test on other Chromium browsers:
- ☐ Microsoft Edge
- ☐ Brave Browser
- ☐ Opera

**Expected Results**:
- ✅ Extension loads correctly
- ✅ All features work as expected

---

## Regression Testing Checklist

After any code changes, verify these core functions:

- [ ] Basic page translation works
- [ ] Toggle between original and translated
- [ ] Hidden elements not translated
- [ ] Code blocks preserved
- [ ] Dynamic content handled
- [ ] Progress indicator shows
- [ ] No console errors
- [ ] Extension popup responsive

---

## Bug Report Template

If any test fails, use this template:

```
**Test Case**: [Test number and name]
**Date**: [Date of testing]
**Chrome Version**: [e.g., 120.0.6099.109]
**OS**: [e.g., macOS 14.0]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Screenshots/Videos**:
[Attach if possible]

**Console Errors**:
[Copy any errors from console]

**Severity**: [Critical/High/Medium/Low]
```

---

## Success Criteria

For the feature to be considered **production-ready**, the following must pass:

### Critical Tests (Must Pass)
- ✅ Test 1.1: Basic translation
- ✅ Test 1.2: Toggle translation
- ✅ Test 2.1: Hidden content exclusion
- ✅ Test 2.2: Code block preservation
- ✅ Test 3.1: Dynamic content translation
- ✅ Test 6.1: Error handling

### Important Tests (Should Pass)
- ✅ Test 2.3: Form element exclusion
- ✅ Test 2.5: Table translation
- ✅ Test 4.1: Large page (Wikipedia)
- ✅ Test 5.2: SPA (Twitter/X)

### Nice-to-Have Tests
- ✅ Test 5.1: Gmail
- ✅ Test 7.1: Performance benchmarks
- ✅ Test 8.2: Other browsers

---

## Testing Progress Tracker

**Tester Name**: _________________
**Date Started**: _________________
**Date Completed**: _________________

**Tests Passed**: _____ / 25
**Tests Failed**: _____
**Tests Skipped**: _____

**Overall Status**: ☐ Ready for Production ☐ Needs Work ☐ Blocked

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## Next Steps After Testing

1. **If all tests pass**:
   - Mark feature as complete in roadmap
   - Update documentation
   - Prepare for user beta testing
   - Plan next feature from roadmap

2. **If tests fail**:
   - Create GitHub issues for failed tests
   - Prioritize critical failures
   - Fix bugs and re-test
   - Document workarounds if needed

3. **Performance Optimization**:
   - Review performance metrics
   - Optimize slow operations
   - Implement progressive translation if needed
   - Add caching improvements

---

**Testing Complete**: ☐

**Approved By**: _________________

**Date**: _________________
