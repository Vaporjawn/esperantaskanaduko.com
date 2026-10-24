# Esperanto Translator Chrome Extension

A Chrome extension that translates web pages to Esperanto with one click, built with React, TypeScript, Vite, and Material-UI.

## Features

- 🌐 **One-Click Translation** - Translate entire web pages to Esperanto
- 🖱️ **Selection Translation** - Right-click to translate selected text
- ⚡ **Fast Performance** - Built with Vite for lightning-fast builds
- 🎨 **Material Design** - Professional UI with Material-UI components
- 💾 **Smart Caching** - Cache translations for improved performance
- ⚙️ **Customizable Settings** - Configure translation preferences
- 🔄 **Toggle Translation** - Switch between original and translated content
- ⌨️ **Keyboard Shortcuts** - Quick access with customizable shortcuts

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Library**: Material-UI (MUI) v5
- **Chrome Extension**: Manifest V3
- **Translation API**: Google Cloud Translation API
- **State Management**: React Context API
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Translation API key
- Chrome browser (or Chromium-based browser)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd esperanto-translator
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API key**
```bash
cp .env.example .env
# Edit .env and add your Google Cloud Translation API key
```

4. **Start development server**
```bash
npm run dev
```

5. **Load extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

## Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build production version
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report

### Project Structure

```
esperanto-translator/
├── public/
│   ├── icons/              # Extension icons
│   └── manifest.json       # Chrome extension manifest
├── src/
│   ├── popup/              # Popup UI (React)
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── App.tsx         # Main app component
│   ├── content/            # Content scripts
│   ├── background/         # Background service worker
│   ├── services/           # Business logic
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities
├── tests/                  # Test files
└── index.html             # Popup HTML
```

## Usage

### Translate a Page

1. Click the extension icon in your toolbar
2. Click "Translate to Esperanto" button
3. The page content will be translated
4. Click "Restore Original" to revert

### Translate Selected Text

1. Select text on any webpage
2. Right-click and choose "Translate to Esperanto"
3. View the translation in a tooltip

### Keyboard Shortcuts

- `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`) - Translate current page
- `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`) - Restore original content

### Settings

Click the "Settings" button in the popup to configure:

- Auto-translate pages
- Translation quality preference
- Domain whitelist/blacklist
- Cache settings
- API configuration

## API Configuration

This extension uses the Google Cloud Translation API. To get an API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Cloud Translation API
4. Create credentials (API key)
5. Add the API key to your `.env` file

**Note**: The Google Cloud Translation API has a free tier with limitations. Monitor your usage to avoid unexpected charges.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder. To distribute:

1. Zip the `dist/` folder
2. Upload to Chrome Web Store Developer Dashboard
3. Fill out store listing information
4. Submit for review

## Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Generate coverage report:
```bash
npm run test:coverage
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Material-UI](https://mui.com/)
- Translation powered by [Google Cloud Translation API](https://cloud.google.com/translate)
- Chrome extension structure inspired by [@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools)

## Documentation

### Translation Settings (NEW! ✨)
- **[📋 Project Completion Summary](PROJECT_COMPLETION_SUMMARY.md)** - Complete project overview and status
- **[🚀 Quick Start Guide](docs/TRANSLATION_SETTINGS_QUICKSTART.md)** - Get started in 5 minutes
- **[📖 User Guide](docs/TRANSLATION_SETTINGS_USER_GUIDE.md)** - Complete user documentation
- **[🧪 Testing Guide](docs/TRANSLATION_SETTINGS_TESTING.md)** - Comprehensive testing procedures (44 test cases)
- **[🔧 Implementation Details](docs/TRANSLATION_SETTINGS_IMPLEMENTATION.md)** - Technical documentation
- **[💻 Code Changes Summary](docs/TRANSLATION_SETTINGS_CODE_CHANGES.md)** - Complete code modifications
- **[📦 Git Commit Guide](GIT_COMMIT_GUIDE.md)** - Git workflow and version control

### General Documentation
- **[MVP Roadmap](ESPERANTO_TRANSLATOR_MVP_ROADMAP.md)** - Development plans and feature tracking
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Detailed setup instructions
- **[Testing Guide](docs/TESTING_GUIDE.md)** - General testing procedures

## Support

For issues and questions:
- [GitHub Issues](https://github.com/Vaporjawn/esperanto-translator/issues)
- Check the [User Guide](docs/TRANSLATION_SETTINGS_USER_GUIDE.md) for common questions
- Review [Quick Start](docs/TRANSLATION_SETTINGS_QUICKSTART.md) for troubleshooting
- See [Project Completion Summary](PROJECT_COMPLETION_SUMMARY.md) for latest updates

---

**Author**: Victor Williams (@Vaporjawn)
**Version**: 1.0.0
**Last Updated**: November 24, 2025
