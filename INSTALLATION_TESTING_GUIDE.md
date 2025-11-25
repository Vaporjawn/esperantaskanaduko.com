# Installation & Testing Guide - Connection Error Fix

## Quick Start

### Installation Steps
1. **Build the extension** (if not already done):
   ```bash
   npm run build
   ```

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions`
   - Or click the puzzle icon → "Manage Extensions"

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**:
   - Click "Load unpacked"
   - Navigate to your project folder
   - Select the `/dist` folder
   - Click "Select" or "Open"

5. **Verify Installation**:
   - ✅ Extension icon should appear in Chrome toolbar
   - ✅ Extension should show as "Esperanto Translator" in extensions list
   - ✅ No errors should appear in the extension card

## Testing the Fix

### ✅ Test 1: Normal Webpage Translation
**Purpose**: Verify basic functionality works on regular websites

**Steps**:
1. Navigate to `https://en.wikipedia.org/wiki/Artificial_intelligence`
2. Click the Esperanto Translator extension icon
3. Click the "Translate Page" button

**Expected Result**:
- ✅ Translation starts immediately
- ✅ Progress indicator appears
- ✅ Page content translates to Esperanto
- ✅ Toggle button changes to "Restore Original"
- ✅ No connection errors

**If it fails**: Check browser console (F12) for errors

---

### ✅ Test 2: Restricted Page (Error Handling)
**Purpose**: Verify graceful error handling on chrome:// pages

**Steps**:
1. Navigate to `chrome://extensions`
2. Click the Esperanto Translator extension icon
3. Click the "Translate Page" button

**Expected Result**:
- ✅ Alert message appears: "Cannot access this page. Chrome extensions cannot access chrome:// pages."
- ✅ No browser console errors
- ✅ Extension popup remains functional

**Other restricted URLs to test**:
- `chrome://settings`
- `chrome://history`
- `about:blank`
- `edge://extensions` (if using Edge)

---

### ✅ Test 3: New Tab Race Condition
**Purpose**: Verify content script auto-injection on fresh tabs

**Steps**:
1. Open a brand new tab (Ctrl+T / Cmd+T)
2. Type a URL: `https://www.gutenberg.org/`
3. Press Enter
4. **Immediately** (within 1 second) click the extension icon
5. Click "Translate Page"

**Expected Result**:
- ✅ Content script injects automatically
- ✅ Short delay (< 1 second) before translation starts
- ✅ Translation completes successfully
- ✅ No "Receiving end does not exist" error

**If it fails**: Try again with a slower reaction time (the content script may need more time to initialize naturally)

---

### ✅ Test 4: Toggle Translation (Fast Switching)
**Purpose**: Verify toggle works reliably without connection errors

**Steps**:
1. Navigate to any normal website
2. Click extension icon
3. Click "Translate Page"
4. Wait for translation to complete
5. Click "Restore Original"
6. **Immediately** click "Translate Page" again
7. Repeat steps 5-6 several times rapidly

**Expected Result**:
- ✅ Each toggle operation completes successfully
- ✅ No "Receiving end does not exist" errors
- ✅ Content alternates between translated and original
- ✅ No browser console errors

---

### ✅ Test 5: Page Refresh (State Recovery)
**Purpose**: Verify extension recovers properly after page refresh

**Steps**:
1. Navigate to any normal website
2. Click extension icon
3. Click "Translate Page"
4. Wait for translation to complete
5. Refresh the page (F5)
6. Click extension icon again
7. Click "Translate Page"

**Expected Result**:
- ✅ After refresh, extension popup opens normally
- ✅ Translation works on the refreshed page
- ✅ No stale content script issues
- ✅ No connection errors

---

### ✅ Test 6: Multiple Tabs
**Purpose**: Verify extension works independently across multiple tabs

**Steps**:
1. Open Tab 1: `https://en.wikipedia.org/wiki/Esperanto`
2. Open Tab 2: `https://www.bbc.com/news`
3. Open Tab 3: `chrome://extensions`
4. In Tab 1: Translate the page
5. In Tab 2: Translate the page
6. In Tab 3: Try to translate (should fail gracefully)
7. Switch back to Tab 1: Restore original
8. Switch to Tab 2: Verify it's still translated

**Expected Result**:
- ✅ Tab 1 and Tab 2 translate successfully and independently
- ✅ Tab 3 shows proper error message
- ✅ Each tab maintains its own translation state
- ✅ No cross-contamination between tabs

---

### ✅ Test 7: Slow Network Simulation
**Purpose**: Verify timeout and retry logic work correctly

**Steps**:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Change throttling to "Slow 3G"
4. Navigate to a large website (e.g., `https://www.theguardian.com/`)
5. Click extension icon
6. Click "Translate Page"

**Expected Result**:
- ✅ Translation may take longer but should complete
- ✅ If timeout occurs (> 5 seconds), shows clear error message
- ✅ Retry logic attempts to complete translation
- ✅ No infinite hanging or frozen UI

**Reset**: Change throttling back to "No throttling"

---

## Troubleshooting

### Problem: "Could not establish connection. Receiving end does not exist."
**If you still see this error after the fix**:

1. **Check Extension Installation**:
   - Verify you're running the updated build from `/dist`
   - Check extension version in `chrome://extensions`

2. **Reload the Extension**:
   - Go to `chrome://extensions`
   - Click the reload icon (circular arrow) on the extension card
   - Try translating again

3. **Refresh the Webpage**:
   - Press F5 to refresh the current page
   - Click extension icon and try translating

4. **Check Browser Console**:
   - Press F12 to open DevTools
   - Look for red error messages
   - Share any error messages for debugging

### Problem: Extension icon not visible
**Solution**: Pin the extension to toolbar
1. Click the puzzle icon in Chrome toolbar
2. Find "Esperanto Translator"
3. Click the pin icon next to it

### Problem: Translation not working on any page
**Solution**: Check API configuration
1. Open extension popup
2. Click settings icon
3. Verify Google Cloud Translation API key is configured
4. Test API connection

### Problem: Extension shows "Service worker failed to start"
**Solution**: Rebuild the extension
```bash
npm run build
```
Then reload the extension in `chrome://extensions`

## Verification Checklist

After testing, verify these outcomes:

- [ ] ✅ Normal webpages translate successfully
- [ ] ✅ Restricted pages show clear error messages (no crashes)
- [ ] ✅ Race condition handling works (new tabs)
- [ ] ✅ Toggle translation works reliably (no connection errors)
- [ ] ✅ Page refresh doesn't break functionality
- [ ] ✅ Multiple tabs work independently
- [ ] ✅ Slow network doesn't cause infinite hangs
- [ ] ✅ No "Receiving end does not exist" errors in any scenario
- [ ] ✅ Browser console shows no critical errors

## Performance Benchmarks

**Expected Performance**:
- Normal webpage translation: 1-3 seconds (depends on page size)
- Content script injection: < 200ms
- PING readiness check: 10-50ms
- Retry delay (on failure): 500ms per attempt
- Timeout threshold: 5 seconds

**If performance is poor**:
- Check network throttling is disabled
- Verify page size isn't excessive (> 10MB)
- Clear browser cache and try again

## Next Steps After Testing

1. **Report Results**: Document any issues or unexpected behavior
2. **User Acceptance**: Have multiple users test in different scenarios
3. **Monitor Errors**: Check for any edge cases not covered in tests
4. **Optimize**: If timeout/retry logic impacts UX, adjust parameters
5. **Document**: Update user guide with any new findings

---

**Testing Status**: Ready for User Acceptance Testing
**Build Version**: Latest (check package.json for version number)
**Date Built**: Check dist/ folder modification time
