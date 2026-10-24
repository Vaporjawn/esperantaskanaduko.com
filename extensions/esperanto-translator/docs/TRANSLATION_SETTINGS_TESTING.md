# Translation Settings - Testing Guide

This comprehensive testing guide covers all Translation Settings features: auto-translation, quality preferences, domain management, and keyboard shortcuts.

## Prerequisites

### Before Testing

- [ ] Extension built successfully: `npm run build`
- [ ] Extension loaded in Chrome: `chrome://extensions/` → Load unpacked → Select `dist/` folder
- [ ] Developer mode enabled in Chrome
- [ ] Valid Google Translate API key configured
- [ ] Background script and content script working
- [ ] Extension icon visible in toolbar

### Testing Environment

**Recommended test domains**:
- `wikipedia.org` - Multi-language, good for auto-translate
- `github.com` - Complex layout, good for blacklist testing
- `stackoverflow.com` - Good for wildcard testing (*.stackoverflow.com)
- `news.ycombinator.com` - Simple layout, quick page loads
- `reddit.com` - Dynamic content testing

**Browser setup**:
- Clear browsing data between test runs
- Open DevTools Console for debugging
- Enable verbose logging in extension
- Test on clean profile if issues arise

---

## Test Suite 1: Auto-Translation

### Test 1.1: Enable Auto-Translation

**Objective**: Verify toggle enables auto-translation feature

**Steps**:
1. Click extension icon in toolbar
2. Click settings gear icon (⚙️)
3. Find "Auto-translate pages" toggle
4. Verify toggle is OFF by default
5. Click toggle to turn it ON
6. Verify toggle shows ON state

**Expected Results**:
- ✅ Toggle changes from OFF to ON
- ✅ Settings save automatically (no save button)
- ✅ Toggle state persists if popup is closed and reopened

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 1.2: Add Domain to Whitelist

**Objective**: Successfully add domain to whitelist

**Steps**:
1. In settings drawer, scroll to "Whitelisted Domains"
2. Type `wikipedia.org` in text field
3. Click blue "Add" button
4. Verify domain appears in list below

**Expected Results**:
- ✅ Domain appears in list with delete icon
- ✅ Text field clears after adding
- ✅ No error message displayed
- ✅ Domain persists after closing popup

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 1.3: Auto-Translate Whitelisted Domain

**Objective**: Verify auto-translation triggers on whitelisted domain

**Pre-conditions**:
- Auto-translate toggle: ON
- `wikipedia.org` in whitelist

**Steps**:
1. Open new tab
2. Navigate to `https://wikipedia.org` (or any language version)
3. Wait 2 seconds after page loads
4. Observe if page content changes to target language

**Expected Results**:
- ✅ Page waits ~1 second after load
- ✅ Translation progress indicator appears
- ✅ Content changes to target language
- ✅ Console logs show auto-translation triggered
- ✅ Page layout remains functional

**Status**: ⬜ Pass | ⬜ Fail

**Console Verification**:
```javascript
// Should see in console:
"Checking auto-translate conditions"
"Auto-translate triggered for wikipedia.org"
```

**Notes**:
_______________________________________

---

### Test 1.4: No Translation on Non-Whitelisted Domain

**Objective**: Verify auto-translation doesn't trigger on non-whitelisted sites

**Pre-conditions**:
- Auto-translate toggle: ON
- Whitelist contains only `wikipedia.org`

**Steps**:
1. Open new tab
2. Navigate to `https://github.com`
3. Wait 3 seconds
4. Verify page remains in original language

**Expected Results**:
- ✅ No translation occurs
- ✅ No progress indicator appears
- ✅ Console shows "Domain not whitelisted"
- ✅ Page functions normally

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 1.5: Disable Auto-Translation

**Objective**: Verify disabling toggle prevents auto-translation

**Pre-conditions**:
- Auto-translate toggle: ON
- `wikipedia.org` in whitelist

**Steps**:
1. Click extension icon
2. Open settings drawer
3. Toggle "Auto-translate pages" to OFF
4. Close popup
5. Navigate to `https://wikipedia.org`
6. Wait 3 seconds

**Expected Results**:
- ✅ No auto-translation occurs
- ✅ Page remains in original language
- ✅ Manual translation still works via icon
- ✅ Toggle state persists

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 2: Domain Blacklist

### Test 2.1: Add Domain to Blacklist

**Objective**: Successfully add domain to blacklist

**Steps**:
1. Open settings drawer
2. Scroll to "Blacklisted Domains"
3. Type `github.com` in text field
4. Click "Add" button (outlined style)
5. Verify domain appears in blacklist

**Expected Results**:
- ✅ Domain appears in blacklist with delete icon
- ✅ Text field clears
- ✅ No error message
- ✅ Domain persists

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 2.2: Blacklist Prevents Translation

**Objective**: Verify blacklisted domain never translates

**Pre-conditions**:
- Auto-translate toggle: ON
- `github.com` in blacklist
- `github.com` NOT in whitelist

**Steps**:
1. Navigate to `https://github.com`
2. Wait 3 seconds
3. Verify no translation occurs

**Expected Results**:
- ✅ Page remains in original language
- ✅ No translation progress indicator
- ✅ Console shows "Domain blacklisted"
- ✅ Manual translation via icon also blocked

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 2.3: Blacklist Overrides Whitelist

**Objective**: Verify blacklist takes precedence over whitelist

**Pre-conditions**:
- Auto-translate toggle: ON

**Steps**:
1. Add `github.com` to whitelist
2. Add `github.com` to blacklist
3. Navigate to `https://github.com`
4. Wait 3 seconds

**Expected Results**:
- ✅ No translation occurs
- ✅ Blacklist wins the conflict
- ✅ Console logs show blacklist check before whitelist

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 2.4: Remove Domain from Blacklist

**Objective**: Successfully remove domain from blacklist

**Steps**:
1. Find `github.com` in blacklist
2. Click trash icon (🗑️) next to domain
3. Verify domain disappears from list

**Expected Results**:
- ✅ Domain removed immediately
- ✅ No confirmation dialog (instant removal)
- ✅ Removal persists after closing popup
- ✅ Domain can now translate (if in whitelist)

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 3: Wildcard Domain Patterns

### Test 3.1: Add Wildcard Pattern to Whitelist

**Objective**: Successfully add wildcard domain pattern

**Steps**:
1. Open settings drawer
2. Navigate to "Whitelisted Domains"
3. Type `*.wikipedia.org` in text field
4. Click "Add" button
5. Verify pattern appears in list

**Expected Results**:
- ✅ `*.wikipedia.org` appears in list
- ✅ No validation error
- ✅ Pattern saved correctly

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 3.2: Wildcard Matches Subdomains

**Objective**: Verify wildcard pattern matches multiple subdomains

**Pre-conditions**:
- Auto-translate toggle: ON
- `*.wikipedia.org` in whitelist

**Test domains**:
- `en.wikipedia.org`
- `es.wikipedia.org`
- `fr.wikipedia.org`
- `de.wikipedia.org`

**Steps**:
1. Navigate to `https://en.wikipedia.org`
2. Wait for auto-translation
3. Verify translation occurs
4. Repeat for other language subdomains

**Expected Results**:
- ✅ All Wikipedia language versions auto-translate
- ✅ Pattern matching works consistently
- ✅ Console logs show pattern match success

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 3.3: Wildcard Doesn't Match Wrong Domains

**Objective**: Verify wildcard is specific to pattern

**Pre-conditions**:
- Auto-translate toggle: ON
- `*.wikipedia.org` in whitelist

**Steps**:
1. Navigate to `https://wikimedia.org` (different root domain)
2. Wait 3 seconds
3. Verify NO translation occurs

**Expected Results**:
- ✅ No translation on `wikimedia.org`
- ✅ Pattern is specific to `*.wikipedia.org`
- ✅ Console shows pattern mismatch

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 3.4: Exact Match vs Wildcard

**Objective**: Verify exact match doesn't match subdomains

**Pre-conditions**:
- Auto-translate toggle: ON
- `wikipedia.org` (exact) in whitelist (NOT `*.wikipedia.org`)

**Steps**:
1. Navigate to `https://en.wikipedia.org` (subdomain)
2. Wait 3 seconds
3. Verify NO translation occurs
4. Navigate to `https://wikipedia.org` (root domain)
5. Wait 3 seconds
6. Verify translation DOES occur

**Expected Results**:
- ✅ `en.wikipedia.org` does NOT translate
- ✅ `wikipedia.org` DOES translate
- ✅ Exact match is precise

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 4: Translation Quality

### Test 4.1: Default Quality (Balanced)

**Objective**: Verify default quality is "Balanced"

**Steps**:
1. Fresh extension install
2. Open settings drawer
3. Check "Translation Quality" section
4. Verify "Balanced" is selected

**Expected Results**:
- ✅ "Balanced" radio button is selected
- ✅ Description visible below option

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 4.2: Select Fast Quality

**Objective**: Change quality to Fast mode

**Steps**:
1. Open settings drawer
2. Click "Fast" radio button
3. Close popup
4. Trigger page translation
5. Observe translation speed

**Expected Results**:
- ✅ "Fast" radio button becomes selected
- ✅ Setting saves immediately
- ✅ Translation completes quickly
- ✅ Console shows `model: 'base'` in API request

**Status**: ⬜ Pass | ⬜ Fail

**API Verification**:
Check Network tab for translate API request:
```json
{
  "q": "text to translate",
  "target": "en",
  "model": "base",
  "format": "text",
  "key": "..."
}
```

**Notes**:
_______________________________________

---

### Test 4.3: Select Accurate Quality

**Objective**: Change quality to Accurate mode

**Steps**:
1. Open settings drawer
2. Click "Accurate" radio button
3. Close popup
4. Translate page with complex formatting
5. Observe translation quality and formatting

**Expected Results**:
- ✅ "Accurate" radio button selected
- ✅ Translation may take longer
- ✅ Better handling of complex sentences
- ✅ HTML formatting preserved
- ✅ Console shows `model: 'nmt', format: 'html'`

**Status**: ⬜ Pass | ⬜ Fail

**API Verification**:
```json
{
  "q": "text to translate",
  "target": "en",
  "model": "nmt",
  "format": "html",
  "key": "..."
}
```

**Notes**:
_______________________________________

---

### Test 4.4: Quality Affects All Translations

**Objective**: Verify quality setting applies to all translation types

**Pre-conditions**:
- Quality set to "Fast"

**Steps**:
1. Test auto-translation on whitelisted domain
2. Test manual translation via popup button
3. Test translation via keyboard shortcut
4. Verify all use Fast quality

**Expected Results**:
- ✅ All translation types use selected quality
- ✅ Consistent API parameters across all translation methods
- ✅ Quality persists across sessions

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 5: Domain Validation

### Test 5.1: Valid Domain Formats

**Objective**: Verify various valid domain formats are accepted

**Test cases**:
| Domain Input | Should Accept? |
|--------------|----------------|
| `example.com` | ✅ Yes |
| `subdomain.example.com` | ✅ Yes |
| `*.example.com` | ✅ Yes |
| `example.co.uk` | ✅ Yes |
| `my-domain.com` | ✅ Yes |
| `123.example.com` | ✅ Yes |

**Steps**:
1. For each test case, enter domain in text field
2. Click "Add" button
3. Verify domain is accepted or rejected

**Expected Results**:
- ✅ All valid formats accepted
- ✅ No error messages for valid domains
- ✅ Domains appear in list

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 5.2: Invalid Domain Formats

**Objective**: Verify invalid formats are rejected with error

**Test cases**:
| Domain Input | Should Reject? | Expected Error |
|--------------|----------------|----------------|
| `https://example.com` | ✅ Yes | Invalid format |
| `example.com/` | ✅ Yes | Invalid format |
| `example .com` | ✅ Yes | Invalid format |
| `` (empty) | ✅ Yes | Cannot be empty |
| `.example.com` | ✅ Yes | Invalid format |
| `example..com` | ✅ Yes | Invalid format |

**Steps**:
1. For each test case, enter input in text field
2. Click "Add" button
3. Verify error message appears

**Expected Results**:
- ✅ All invalid formats rejected
- ✅ Appropriate error message displayed
- ✅ Domain NOT added to list
- ✅ Error clears when typing new input

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 5.3: Duplicate Domain Detection

**Objective**: Prevent adding duplicate domains

**Steps**:
1. Add `github.com` to whitelist
2. Try adding `github.com` again
3. Verify error message

**Expected Results**:
- ✅ Error message: "Domain already exists"
- ✅ Domain not added twice
- ✅ List shows only one entry

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 5.4: Error Message Clearing

**Objective**: Verify errors clear on valid input

**Steps**:
1. Enter invalid domain (e.g., `https://example.com`)
2. Observe error message
3. Clear field and enter valid domain
4. Verify error disappears

**Expected Results**:
- ✅ Error disappears when field is cleared
- ✅ Error disappears when typing valid input
- ✅ Add button becomes usable again

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 6: Keyboard Shortcuts

### Test 6.1: Translate Page Shortcut

**Objective**: Verify Ctrl+Shift+E translates page

**Steps**:
1. Navigate to any foreign language page
2. Press `Ctrl+Shift+E` (Windows) or `Cmd+Shift+E` (Mac)
3. Observe translation

**Expected Results**:
- ✅ Translation starts immediately
- ✅ Progress indicator appears
- ✅ Page translates to target language
- ✅ Works on any tab

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 6.2: Restore Original Shortcut

**Objective**: Verify Ctrl+Shift+R restores original content

**Pre-conditions**:
- Page is currently translated

**Steps**:
1. On translated page
2. Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Observe restoration

**Expected Results**:
- ✅ Original content restored immediately
- ✅ No progress indicator needed
- ✅ Page returns to original language
- ✅ Works reliably

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 6.3: Shortcuts Display Correctly

**Objective**: Verify correct shortcut display based on platform

**Steps**:
1. Open settings drawer
2. Scroll to "Keyboard Shortcuts" section
3. Verify displayed shortcuts match platform

**Expected Results**:

**On Mac**:
- ✅ Shows `Cmd+Shift+E` for translate
- ✅ Shows `Cmd+Shift+R` for restore

**On Windows/Linux**:
- ✅ Shows `Ctrl+Shift+E` for translate
- ✅ Shows `Ctrl+Shift+R` for restore

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 6.4: Shortcut Customization Link

**Objective**: Verify link to Chrome shortcuts page

**Steps**:
1. In settings, find keyboard shortcuts section
2. Read the blue alert message
3. Click the link in the alert
4. Verify Chrome shortcuts page opens

**Expected Results**:
- ✅ Link opens `chrome://extensions/shortcuts`
- ✅ Extension shortcuts are listed
- ✅ Shortcuts can be customized
- ✅ Changes apply immediately

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 7: Settings Persistence

### Test 7.1: Persistence After Popup Close

**Objective**: Settings persist when closing popup

**Steps**:
1. Change all settings (quality, domains, toggles)
2. Close popup
3. Reopen popup
4. Verify all settings maintained

**Expected Results**:
- ✅ Quality selection persists
- ✅ Domain lists unchanged
- ✅ Toggle states preserved
- ✅ No data loss

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 7.2: Persistence After Browser Restart

**Objective**: Settings survive browser restart

**Steps**:
1. Configure all settings
2. Close Chrome completely
3. Reopen Chrome
4. Open extension popup
5. Verify settings

**Expected Results**:
- ✅ All settings preserved
- ✅ Domain lists intact
- ✅ Quality setting maintained
- ✅ Auto-translate still functional

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 7.3: Chrome Sync (If Enabled)

**Objective**: Settings sync across devices

**Pre-conditions**:
- Chrome sync enabled
- Multiple devices logged into same Google account

**Steps**:
1. Configure settings on Device A
2. Wait 30 seconds for sync
3. Open extension on Device B
4. Verify settings match

**Expected Results**:
- ✅ Quality setting synced
- ✅ Domain lists synced
- ✅ Toggle states synced
- ✅ Both devices have identical settings

**Status**: ⬜ Pass | ⬜ Fail | ⬜ N/A (Sync disabled)

**Notes**:
_______________________________________

---

## Test Suite 8: UI/UX Testing

### Test 8.1: Settings Drawer Width

**Objective**: Verify drawer is wide enough for content

**Steps**:
1. Open settings drawer
2. Check all sections fit properly
3. Verify no horizontal scrolling needed

**Expected Results**:
- ✅ Drawer width is 400px
- ✅ All content visible
- ✅ No text truncation
- ✅ Buttons fully visible

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 8.2: Vertical Scrolling

**Objective**: Verify scrolling works when content exceeds viewport

**Steps**:
1. Open settings drawer
2. Add many domains to lists
3. Scroll through settings
4. Verify smooth scrolling

**Expected Results**:
- ✅ Drawer scrolls vertically
- ✅ Smooth scrolling experience
- ✅ All content accessible
- ✅ No layout issues

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 8.3: Empty State Messages

**Objective**: Appropriate messages when lists are empty

**Steps**:
1. Remove all whitelisted domains
2. Verify empty state message appears
3. Remove all blacklisted domains
4. Verify empty state message appears

**Expected Results**:
- ✅ "No whitelisted domains" message shown
- ✅ "No blacklisted domains" message shown
- ✅ Messages styled in italic gray text
- ✅ Messages clear when domains added

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 8.4: Visual Feedback on Actions

**Objective**: User receives clear feedback for actions

**Actions to test**:
- Adding domain
- Removing domain
- Changing quality
- Toggling switches
- Validation errors

**Expected Results**:
- ✅ Immediate visual feedback for each action
- ✅ Clear error messages
- ✅ Success states obvious (domain appears in list)
- ✅ Loading states where appropriate

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 9: Edge Cases & Stress Testing

### Test 9.1: Many Domains in Lists

**Objective**: Handle large number of domains

**Steps**:
1. Add 50+ domains to whitelist
2. Add 50+ domains to blacklist
3. Test scrolling and performance
4. Test auto-translation still works

**Expected Results**:
- ✅ All domains display correctly
- ✅ Scrolling smooth
- ✅ No performance degradation
- ✅ Auto-translation logic unaffected

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 9.2: Very Long Domain Names

**Objective**: Handle extremely long domain names

**Test input**: `this-is-a-very-long-subdomain-name-for-testing-purposes.example.com`

**Steps**:
1. Enter long domain name
2. Add to whitelist
3. Verify display handling

**Expected Results**:
- ✅ Long domain accepted if valid
- ✅ Text wraps or truncates appropriately
- ✅ Delete button still accessible
- ✅ No layout breaking

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 9.3: Rapid Settings Changes

**Objective**: Handle rapid user interactions

**Steps**:
1. Rapidly toggle auto-translate on/off multiple times
2. Quickly add and remove domains
3. Rapidly change quality settings
4. Verify no errors or data corruption

**Expected Results**:
- ✅ No crashes or errors
- ✅ Final state is consistent
- ✅ Settings save correctly
- ✅ No race conditions

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 9.4: Translation During Auto-Translate

**Objective**: Handle concurrent translation requests

**Steps**:
1. Enable auto-translate with whitelisted domain
2. Visit whitelisted page
3. While auto-translation is in progress, press Ctrl+Shift+E
4. Observe behavior

**Expected Results**:
- ✅ No errors occur
- ✅ Translation completes successfully
- ✅ No duplicate translations
- ✅ Graceful handling of concurrent requests

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Test Suite 10: Integration Testing

### Test 10.1: Settings + Manual Translation

**Objective**: Quality settings affect manual translation

**Steps**:
1. Set quality to "Accurate"
2. Navigate to page
3. Click extension icon
4. Click "Translate Page" button
5. Verify high quality translation

**Expected Results**:
- ✅ Manual translation uses "Accurate" quality
- ✅ API request includes NMT model parameter
- ✅ Translation quality is noticeably better

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 10.2: Settings + Keyboard Shortcuts

**Objective**: Quality settings apply to shortcut translations

**Steps**:
1. Set quality to "Fast"
2. Navigate to page
3. Press Ctrl+Shift+E
4. Verify fast translation

**Expected Results**:
- ✅ Shortcut respects quality setting
- ✅ Translation completes quickly
- ✅ API includes base model parameter

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

### Test 10.3: Complex Workflow

**Objective**: Full workflow with all features

**Scenario**: User wants to auto-translate all Wikipedia but exclude English version

**Steps**:
1. Enable auto-translate
2. Add `*.wikipedia.org` to whitelist
3. Add `en.wikipedia.org` to blacklist
4. Set quality to "Balanced"
5. Visit `fr.wikipedia.org` - should translate
6. Visit `en.wikipedia.org` - should NOT translate
7. Visit `es.wikipedia.org` - should translate

**Expected Results**:
- ✅ French Wikipedia translates automatically
- ✅ English Wikipedia does NOT translate
- ✅ Spanish Wikipedia translates automatically
- ✅ All use Balanced quality
- ✅ Workflow is smooth and intuitive

**Status**: ⬜ Pass | ⬜ Fail

**Notes**:
_______________________________________

---

## Bug Report Template

Use this template when reporting issues found during testing:

```markdown
### Bug Report: [Short Description]

**Date**: [Date found]
**Tester**: [Your name]
**Test Case**: [Test ID from this guide]

**Environment**:
- Browser: Chrome [version]
- Extension Version: [version]
- OS: [operating system]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Screenshots/Logs**:
[Attach screenshots or paste console logs]

**Severity**:
- [ ] Critical (Blocks major functionality)
- [ ] High (Major feature impacted)
- [ ] Medium (Minor feature impacted)
- [ ] Low (Cosmetic or edge case)

**Additional Notes**:
[Any other relevant information]
```

---

## Testing Summary Report Template

After completing all tests:

```markdown
# Translation Settings - Test Results

**Test Date**: [Date]
**Tester**: [Name]
**Extension Version**: [Version]
**Browser**: Chrome [Version]

## Test Results Summary

**Total Tests**: 44
**Passed**: [X]
**Failed**: [Y]
**Skipped/N/A**: [Z]

**Pass Rate**: [X/44 * 100]%

## Test Suite Results

| Suite | Tests | Passed | Failed | Pass Rate |
|-------|-------|--------|--------|-----------|
| Auto-Translation | 5 | | | |
| Domain Blacklist | 4 | | | |
| Wildcard Patterns | 4 | | | |
| Translation Quality | 4 | | | |
| Domain Validation | 4 | | | |
| Keyboard Shortcuts | 4 | | | |
| Settings Persistence | 3 | | | |
| UI/UX Testing | 4 | | | |
| Edge Cases | 4 | | | |
| Integration Testing | 3 | | | |

## Critical Issues Found

[List any critical bugs]

## Recommendations

[Suggestions for improvements]

## Sign-off

- [ ] All critical tests passed
- [ ] No blocking issues found
- [ ] Ready for production

**Tester Signature**: ________________
**Date**: ________________
```

---

## Continuous Testing Checklist

### Before Each Release

- [ ] Run all test suites
- [ ] Test on fresh browser profile
- [ ] Test with clean extension install
- [ ] Test Chrome sync functionality
- [ ] Verify documentation is up-to-date
- [ ] Check all links in settings work
- [ ] Test on multiple devices/platforms
- [ ] Review console for errors/warnings

### Regression Testing

After any code changes, always test:
- [ ] Auto-translation still works
- [ ] Domain matching logic unchanged
- [ ] Quality settings apply correctly
- [ ] Keyboard shortcuts functional
- [ ] Settings persist properly
- [ ] No new console errors

---

**Last Updated**: November 24, 2025  
**Version**: 1.0.0  
**Author**: Victor Williams (@Vaporjawn)
