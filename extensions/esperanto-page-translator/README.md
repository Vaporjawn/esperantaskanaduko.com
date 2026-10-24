# Esperanto Page Translator - Chrome Extension

A Chrome extension that translates web pages to Esperanto using the LibreTranslate API.

## Features

- ✅ Translate entire web pages to Esperanto with one click
- ✅ Revert to original text easily
- ✅ Material-UI popup interface
- ✅ Context menu integration
- ✅ Caching for improved performance
- ✅ Batch translation support

## Project Structure

```
esperanto-page-translator/
├── src/
│   ├── background/
│   │   └── background.ts        # Service worker for extension lifecycle
│   ├── content/
│   │   └── content-script.ts    # DOM manipulation and translation
│   ├── popup/
│   │   └── Popup.tsx            # Material-UI popup interface
│   └── services/
│       └── TranslationService.ts # LibreTranslate API integration
├── public/
│   ├── manifest.json            # Chrome extension manifest
│   ├── popup.html               # Popup entry point
│   └── icons/                   # Extension icons (placeholder)
├── dist/                        # Built extension files
└── package.json
```

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Extension
```bash
npm run build
```

This creates a `dist/` folder with all the built files.

### 3. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project
5. The extension should now appear in your extensions list

## Usage

### Using the Popup

1. Click the extension icon in Chrome toolbar
2. Click "Translate to Esperanto" to translate the current page
3. Click "Revert to Original" to restore the original text

### Using Context Menu

1. Right-click anywhere on a web page
2. Select "Translate Page to Esperanto" or "Revert to Original Text"

## Development

### Technologies

- **React 18.2.0** - UI framework
- **TypeScript 5.2.2** - Type safety
- **Material-UI 5.15.10** - UI components
- **Vite 5.4.21** - Build tool
- **LibreTranslate** - Translation API
- **Chrome Extension Manifest V3** - Extension platform

### Building

```bash
npm run build
```

### Development Mode

For development with hot reload:

```bash
npm run dev
```

Then load the extension from the `dist/` folder in Chrome.

## Architecture

### Translation Service (`src/services/TranslationService.ts`)

- Handles all LibreTranslate API communication
- Implements caching with configurable TTL
- Supports batch translation for performance
- Error handling with typed error responses

### Background Service Worker (`src/background/background.ts`)

- Manages extension lifecycle
- Creates context menu items
- Routes messages between popup and content scripts
- Injects content script when needed

### Content Script (`src/content/content-script.ts`)

- Traverses DOM to find text nodes
- Creates snapshots of original text
- Applies translations to visible text
- Reverts to original text on demand
- Filters out non-visible elements (scripts, styles, hidden elements)

### Popup UI (`src/popup/Popup.tsx`)

- Material-UI interface with green theme
- Translate and Revert buttons
- Loading states and error handling
- Success/error messages with MUI Alerts

## API Configuration

The extension uses the free LibreTranslate API by default:
- Endpoint: `https://libretranslate.com/translate`
- No API key required for basic usage
- Rate limits may apply

To use a different instance or add an API key, modify `src/services/TranslationService.ts`:

```typescript
const DEFAULT_CONFIG: TranslationConfig = {
  apiEndpoint: 'https://your-instance.com/translate',
  apiKey: 'your-api-key', // Optional
  timeout: 10000,
  maxRetries: 3,
  cacheEnabled: true,
  cacheTTL: 86400000,
};
```

## Permissions

The extension requires these permissions:
- `activeTab` - Access current tab for translation
- `storage` - Store cache and settings
- `contextMenus` - Right-click menu integration
- `scripting` - Inject content script
- `<all_urls>` - Translate any website

## Known Limitations

- Translation quality depends on LibreTranslate API
- Large pages may take time to translate
- Some dynamic content may not be translated
- Requires internet connection

## Future Enhancements

See planning documents in `.copilot-tracking/plans/` for:
- Phase 6: Advanced Translation Options
- Phase 7: Translation History
- Phase 8: Custom Dictionary
- Phase 9: UI Enhancements
- Phase 10: Performance Optimization

## License

MIT License

## Author

Created as a Chrome extension development project.
