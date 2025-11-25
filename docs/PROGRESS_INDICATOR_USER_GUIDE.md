# Translation Progress Indicator - User Guide

## What is the Translation Progress Indicator?

The Translation Progress Indicator is a visual component in the Esperanto Translator extension that shows you real-time progress when translating web pages. It provides transparency into the translation process and helps reduce perceived wait time.

## How It Works

### When You Click "Translate Page"

1. **Progress Bar Appears**
   - A green progress bar appears below the translate button
   - Shows percentage completion (0-100%)
   - Displays descriptive status messages

2. **Progress Stages**

   **Stage 1: Starting (0%)**
   ```
   Status: "Starting translation..."
   ```
   - Extension initializes the translation process
   - Prepares to scan the page

   **Stage 2: Extracting Text (10%)**
   ```
   Status: "Extracting text..."
   ```
   - Scans the page for translatable content
   - Identifies all text elements

   ```
   Status: "Found 243 text elements"
   ```
   - Reports how many text elements were found
   - Gives you an idea of translation scope

   **Stage 3: Sending to API (20%)**
   ```
   Status: "Sending to translation service..."
   ```
   - Sends text to Google Cloud Translation API
   - This stage may take longer on slower connections

   **Stage 4: Receiving Translation (60%)**
   ```
   Status: "Translation received, applying..."
   ```
   - Translations have been received from API
   - Ready to apply to the page

   **Stage 5: Applying Translations (60-95%)**
   ```
   Status: "Applying translations (143/243)..."
   ```
   - Updates the page with translated text
   - Shows current progress (e.g., 143 out of 243 elements)
   - Progress bar advances smoothly

   **Stage 6: Finalizing (95%)**
   ```
   Status: "Finalizing..."
   ```
   - Final cleanup and validation
   - Preparing to complete

   **Stage 7: Complete (100%)**
   ```
   Status: "Translation complete!"
   ```
   - Translation finished successfully
   - Progress indicator fades out after a moment

## Visual Example

```
┌─────────────────────────────────────────────┐
│  Esperanto Translator                       │
├─────────────────────────────────────────────┤
│                                             │
│  Language: English (en)                     │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │        TRANSLATE PAGE               │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ████████████████░░░░░░░░░░░░░░░   65%    │
│  Applying translations (156/243)...         │
│                                             │
└─────────────────────────────────────────────┘
```

## What Each Stage Means

### Extracting Text (Fast)
- **Duration**: Usually < 1 second
- **What's happening**: The extension scans your page's HTML to find all text that should be translated
- **Why it matters**: Determines how much work needs to be done

### Sending to API (Variable)
- **Duration**: 1-5 seconds depending on:
  - Amount of text to translate
  - Your internet connection speed
  - API server response time
- **What's happening**: Text is sent to Google's translation servers
- **Why it matters**: This is where the actual translation happens

### Applying Translations (Medium)
- **Duration**: 1-3 seconds for average pages
- **What's happening**: Each piece of translated text is inserted back into the page
- **Why it matters**: You'll see the page gradually update with Esperanto text

## Typical Translation Times

### Small Page (< 50 elements)
- **Total Time**: 2-4 seconds
- **Example**: Short blog post, simple webpage

### Medium Page (50-500 elements)
- **Total Time**: 4-8 seconds
- **Example**: News article, product page

### Large Page (500-2000 elements)
- **Total Time**: 8-15 seconds
- **Example**: Wikipedia article, long-form content

### Very Large Page (2000+ elements)
- **Total Time**: 15-30+ seconds
- **Example**: Documentation sites, forums

## Troubleshooting

### Progress Bar Stuck at 20%
**Issue**: Progress stuck at "Sending to translation service..."
**Possible Causes**:
- Slow internet connection
- Google API temporary slowdown
- Very large amount of text to translate

**Solutions**:
- Wait a bit longer (up to 30 seconds for very large pages)
- Check your internet connection
- Try refreshing the page and translating again

### Progress Disappears Suddenly
**Issue**: Progress bar vanishes without completing
**Possible Causes**:
- Translation error occurred
- API key issues
- Network connection lost

**Solutions**:
- Check the status indicator for error messages
- Verify your internet connection
- Try translating again

### No Progress Bar Shows
**Issue**: You click translate but don't see progress
**Possible Causes**:
- Page has no translatable content
- Extension not properly loaded
- Popup closed during translation

**Solutions**:
- Make sure the page has actual text content
- Try reloading the extension
- Keep the popup open during translation

## Benefits of the Progress Indicator

### 1. Transparency
- You know exactly what's happening at each stage
- No more wondering "Is it working?"
- Clear indication of progress

### 2. Reduced Anxiety
- Visual feedback reduces perceived wait time
- You can see the extension is working
- Predictable experience

### 3. Better Planning
- You can estimate how long translation will take
- Helps decide whether to translate large pages
- Useful for understanding page complexity

### 4. Error Detection
- If progress stops, you know something's wrong
- Clear indication of which stage failed
- Easier to troubleshoot issues

## Advanced Usage Tips

### 1. Watch for Element Count
- "Found 2,453 text elements" → Large page, expect longer wait
- "Found 43 text elements" → Small page, very quick

### 2. Monitor Application Phase
- This is often the longest phase for large pages
- Progress updates show you exactly how far along you are
- "Applying translations (1,892/2,453)" gives precise status

### 3. Multiple Translations
- If you translate multiple pages in a row, you'll start to recognize patterns
- Some sites consistently take longer (more dynamic content)
- You can plan your workflow accordingly

## Technical Details (For Advanced Users)

### Progress Calculation
- Progress percentage is calculated based on predefined stage weights
- Text extraction: 0-10%
- API communication: 10-60%
- Application: 60-95%
- Finalization: 95-100%

### Update Frequency
- Progress updates sent in batches during application phase
- Prevents excessive message passing between extension components
- Ensures smooth visual progress without performance impact

### Message Protocol
- Uses Chrome extension message passing
- Non-blocking async operations
- Graceful handling if popup closes mid-translation

## Frequently Asked Questions

**Q: Can I cancel translation mid-progress?**
A: Currently not supported. Once started, translation runs to completion. This is planned for a future update.

**Q: Why does progress sometimes jump?**
A: Different stages take different amounts of time. The API call might complete quickly, causing progress to jump from 20% to 60%.

**Q: Is the progress bar accurate?**
A: Yes, within each stage. The "Applying translations" phase shows exact progress (e.g., 156/243 elements).

**Q: What happens if I close the popup during translation?**
A: Translation continues in the background, but you won't see progress updates. Reopen the popup to see final status.

**Q: Can I speed up translation?**
A: Translation speed depends on:
- Your internet connection
- Google API response time
- Page complexity
These factors are outside the extension's control.

## Related Features

- **Language Detection**: Shows detected source language before translation
- **Toggle Translation**: Switch between original and translated instantly
- **Status Indicator**: Shows overall extension state
- **Settings**: Configure translation preferences

## Feedback

If you notice issues with the progress indicator or have suggestions for improvement, please report them through the extension's feedback system.

---

**Feature Version**: 1.0
**Last Updated**: November 24, 2025
**Status**: ✅ Fully Implemented
