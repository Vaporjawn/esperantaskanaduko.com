# Quick Start Guide

## Setup Instructions

Follow these steps to set up and run the Esperanto Translator Chrome extension:

### 1. Install Dependencies

```bash
cd /Users/victorwilliams/Documents/GitHub/esperanto-translator
npm install
```

This will install all required packages including:
- React 18 & React DOM
- TypeScript
- Vite & @crxjs/vite-plugin
- Material-UI (MUI) components
- Chrome extension types
- Testing libraries (Vitest, React Testing Library)

### 2. Configure API Key

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Google Cloud Translation API key
# Open in your editor and replace 'your_api_key_here' with your actual key
```

**Getting a Google Cloud Translation API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Cloud Translation API"
4. Go to "APIs & Services" → "Credentials"
5. Click "Create Credentials" → "API Key"
6. Copy the key and paste it in your `.env` file

### 3. Replace Placeholder Icons

The boilerplate includes SVG placeholder icons. You should replace them with proper PNG icons:

**Icon Requirements:**
- `public/icons/icon16.png` - 16x16px
- `public/icons/icon48.png` - 48x48px
- `public/icons/icon128.png` - 128x128px

**Design Guidelines:**
- Use the Esperanto star symbol (green star on white background)
- Primary color: #2e7d32 (green)
- Save as PNG with transparent background
- Use crisp, high-quality icons

**Quick Icon Creation Options:**
1. Use [Figma](https://figma.com) or [Canva](https://canva.com)
2. Convert SVG placeholders to PNG using online tools
3. Hire a designer on Fiverr for professional icons
4. Use AI image generators (DALL-E, Midjourney) with prompt: "Esperanto star icon, green, minimalist, transparent background"

After creating icons, update the manifest to reference PNG files:
- The `public/manifest.json` already references `.png` files
- Simply place your PNG icons in `public/icons/` folder

### 4. Build the Extension

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
```

### 5. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `dist/` folder from your project directory
5. The extension icon should appear in your toolbar

### 6. Test the Extension

1. Click the extension icon in your Chrome toolbar
2. Navigate to any webpage
3. Click "Translate to Esperanto" button
4. The page content should be translated

### Common Issues & Solutions

**Issue: "chrome is not defined" errors**
- Solution: These are expected during local development. They only work when loaded as a Chrome extension.

**Issue: Translation not working**
- Solution: Verify your API key is correctly set in `.env` file
- Check Google Cloud Console for API quota limits
- Ensure the Cloud Translation API is enabled

**Issue: Build errors**
- Solution: Delete `node_modules/` and `package-lock.json`, then run `npm install` again
- Ensure you're using Node.js 18+ (`node --version`)

**Issue: Extension not loading**
- Solution: Check for errors in Chrome's extension page
- Try rebuilding with `npm run build`
- Verify all files are in the `dist/` folder

## Development Workflow

### Running Development Server

```bash
npm run dev
```

This starts Vite dev server with hot module replacement. After making changes:
1. Save your files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test your changes

### Code Quality Commands

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Project Structure

```
esperanto-translator/
├── public/                 # Static assets
│   ├── icons/             # Extension icons (PNG)
│   └── manifest.json      # Chrome extension manifest
├── src/
│   ├── popup/             # Popup UI (React)
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── App.tsx        # Main app
│   ├── content/           # Content scripts
│   ├── background/        # Background service worker
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── tests/                 # Test files
└── index.html            # Popup HTML
```

## Next Steps

After completing the setup:

1. **Customize the UI**: Edit components in `src/popup/components/`
2. **Enhance Translation**: Improve `src/services/translationService.ts`
3. **Add Features**: Follow the roadmap in `ESPERANTO_TRANSLATOR_MVP_ROADMAP.md`
4. **Write Tests**: Add tests in `tests/` directory
5. **Deploy**: Build and publish to Chrome Web Store

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Components](https://mui.com/material-ui/getting-started/)
- [React Documentation](https://react.dev/)
- [Google Cloud Translation API](https://cloud.google.com/translate/docs)

## Getting Help

If you encounter issues:

1. Check this guide's "Common Issues" section
2. Review the full roadmap: `ESPERANTO_TRANSLATOR_MVP_ROADMAP.md`
3. Check Chrome DevTools console for errors
4. Verify API key and quotas in Google Cloud Console

---

**Ready to Start?** Run `npm install` to begin! 🚀
