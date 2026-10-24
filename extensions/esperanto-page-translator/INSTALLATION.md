# Installation Guide - Esperanto Page Translator

## Quick Start

Follow these steps to install and use the Esperanto Page Translator Chrome extension.

## Prerequisites

- Google Chrome or Chromium-based browser (Edge, Brave, etc.)
- The extension has already been built and is ready in the `dist/` folder

## Installation Steps

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome
2. Type `chrome://extensions/` in the address bar and press Enter
3. Or click the three-dot menu → More Tools → Extensions

### Step 2: Enable Developer Mode

1. Look for the "Developer mode" toggle in the top-right corner
2. Click to enable it (it should turn blue/on)

### Step 3: Load the Extension

1. Click the "Load unpacked" button (appears after enabling Developer mode)
2. Navigate to this project folder: `esperanto-page-translator`
3. Select the `dist` folder (NOT the project root)
4. Click "Select Folder"

### Step 4: Verify Installation

You should now see "Esperanto Page Translator" in your extensions list with:
- ✅ Green icon with white "E"
- ✅ Version 1.0.0
- ✅ Status: Enabled

### Step 5: Pin the Extension (Optional but Recommended)

1. Click the puzzle piece icon in Chrome toolbar (Extensions)
2. Find "Esperanto Page Translator"
3. Click the pin icon to keep it visible in your toolbar

## Usage

### Method 1: Using the Popup

1. Navigate to any web page (e.g., https://en.wikipedia.org)
2. Click the green "E" icon in your Chrome toolbar
3. Click "Translate to Esperanto" button
4. Wait for the translation to complete
5. Click "Revert to Original" to restore the original text

### Method 2: Using Context Menu (Right-Click)

1. Navigate to any web page
2. Right-click anywhere on the page
3. Select "Translate Page to Esperanto" from the menu
4. To revert, right-click and select "Revert to Original Text"

## Testing the Extension

### Test on a Simple Page

1. Navigate to: `https://example.com`
2. Click the extension icon
3. Click "Translate to Esperanto"
4. You should see the text change to Esperanto

### Test on Wikipedia

1. Navigate to: `https://en.wikipedia.org/wiki/Esperanto`
2. Use either method to translate
3. Verify that the page content changes to Esperanto
4. Click "Revert to Original" to restore

## Troubleshooting

### Extension Not Appearing

- Make sure you selected the `dist` folder, not the project root
- Check that Developer mode is enabled
- Try refreshing the extensions page (F5)

### Translation Not Working

- Check your internet connection (requires LibreTranslate API access)
- Open DevTools (F12) and check Console for errors
- Make sure the page has loaded completely before translating
- Some pages with heavy JavaScript may require a refresh

### Icons Not Showing

- The icons should be green with white "E"
- If missing, make sure `dist/icons/` folder contains the PNG files
- Try removing and re-adding the extension

### Errors in Console

- Open Chrome DevTools (F12)
- Check the Console tab for error messages
- Common issues:
  - Network errors: Check internet connection
  - Content Security Policy: Some sites block content scripts
  - API rate limiting: LibreTranslate free tier has limits

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Esperanto Page Translator"
3. Click "Remove"
4. Confirm removal

## Development Mode

If you want to modify the extension:

1. Make changes to source files in `src/`
2. Run `npm run build` in terminal
3. Click the refresh icon on the extension card in `chrome://extensions/`
4. Test your changes

## Rebuilding After Changes

```bash
# In the project directory
npm run build
```

Then refresh the extension in Chrome:
1. Go to `chrome://extensions/`
2. Find the extension
3. Click the circular refresh icon

## Known Limitations

- ✅ Works on most websites
- ⚠️ May not work on:
  - Chrome Web Store pages (security restriction)
  - chrome:// pages (browser restriction)
  - Some sites with strict Content Security Policies
  - Pages with heavy dynamic content loading

## Getting Help

- Check the Console for error messages (F12 → Console)
- Verify network requests are reaching LibreTranslate API
- Make sure the page has text content to translate
- Try on a simple page like example.com first

## Success Indicators

You'll know it's working when:
- ✅ Extension icon appears in toolbar
- ✅ Clicking icon opens popup with two buttons
- ✅ Text on page changes when clicking "Translate to Esperanto"
- ✅ Original text returns when clicking "Revert to Original"
- ✅ Green success message appears in popup

Enjoy translating web pages to Esperanto! 🌍💚
