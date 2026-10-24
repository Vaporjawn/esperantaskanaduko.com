# Pendumulo — Esperanto Hangman

[![Deploy Status](https://github.com/Vaporjawn/esperanto-hangman/actions/workflows/deploy.yml/badge.svg)](https://github.com/Vaporjawn/esperanto-hangman/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A modern, accessible hangman game built specifically for the Esperanto language, featuring all 28 Esperanto letters including the special diacritics (ĉ, ĝ, ĥ, ĵ, ŝ, ŭ).

<img width="855" height="792" alt="Screenshot 2025-10-19 at 11 58 34" src="https://github.com/user-attachments/assets/a1aa3903-04b9-496a-b98b-a86667b933d0" />
<img width="859" height="840" alt="Screenshot 2025-10-19 at 11 58 55" src="https://github.com/user-attachments/assets/0fd094dd-9bad-46ba-9b3a-d0d329a67107" />


## 🎮 Play Now

- **GitHub Pages**: [https://vaporjawn.github.io/esperanto-hangman/](https://vaporjawn.github.io/esperanto-hangman/)
- **Surge**: [https://esperanto-hangman.surge.sh](https://esperanto-hangman.surge.sh)

## Features

- ✅ **Full Esperanto Support**: All 28 Esperanto letters including diacritics
- ⌨️ **X-Notation Input**: Type `cx`, `gx`, `hx`, `jx`, `sx`, `ux` to input diacritics
- 🎮 **Dual Input**: Click on-screen keyboard or use physical keyboard
- ♿ **Accessible**: WCAG compliant with ARIA labels, keyboard navigation, and screen reader support
- 📊 **Statistics**: Track games played, wins, and current streak (localStorage)
- 🎨 **Material Design**: Clean, modern UI with Material-UI components
- 🌐 **Pure Client-Side**: No backend required, works offline
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## 📖 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy your own instance
- **[Security Policy](SECURITY.md)** - Report security vulnerabilities
- **[Changelog](CHANGELOG.md)** - Version history and changes

## Getting Started

### Prerequisites

- Node.js 20+ (specified in `.nvmrc`)
- npm or yarn
- Git

### Quick Installation

```bash
# Clone the repository
git clone https://github.com/Vaporjawn/esperanto-hangman.git
cd esperanto-hangman

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 to play!

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npm run lint:fix     # Fix linting issues
npm run format       # Format code
npm run type-check   # TypeScript type checking
npm run deploy       # Deploy to GitHub Pages
npm run deploy:surge # Deploy to Surge
```

For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md).

## How to Play

1. A random Esperanto word is selected and shown as underscores
2. Guess letters by:
   - Clicking buttons on the virtual keyboard
   - Typing on your physical keyboard
   - Using x-notation: `cx` → `ĉ`, `gx` → `ĝ`, `hx` → `ĥ`, `jx` → `ĵ`, `sx` → `ŝ`, `ux` → `ŭ`
3. Each wrong guess adds a body part to the hangman figure
4. Win by guessing all letters before 6 mistakes
5. Click "Nova ludo" to start a new game

## Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7 (with experimental Rolldown)
- **UI Library**: Material-UI (MUI) v6
- **State Management**: Zustand
- **Styling**: Emotion (CSS-in-JS)
- **Validation**: Zod
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppShell.tsx    # Main layout wrapper
│   ├── Controls.tsx    # New game button and stats
│   ├── HangmanFigure.tsx # SVG hangman drawing (7 states)
│   ├── KeyboardEO.tsx  # Virtual Esperanto keyboard
│   ├── StatusBar.tsx   # Win/lose/playing status
│   └── WordSlots.tsx   # Letter slots display
├── data/
│   └── words-eo.json   # 250+ Esperanto words
├── pages/
│   └── GamePage.tsx    # Main game page
├── store/
│   └── game.ts         # Zustand game state
├── utils/
│   └── eo.ts           # Esperanto language utilities
├── types.ts            # TypeScript type definitions
├── App.tsx             # Root component with theme
└── main.tsx            # Entry point
```

## Esperanto Alphabet

The game uses the complete 28-letter Esperanto alphabet:

```
a b c ĉ d e f g ĝ h ĥ i j ĵ k l m n o p r s ŝ t u ŭ v z
```

Note: Esperanto does not use q, w, x, y (except in x-notation).

## Accessibility Features

- ✅ **ARIA Labels**: All interactive elements have descriptive labels
- ✅ **Keyboard Navigation**: Full keyboard support with visible focus indicators
- ✅ **Screen Readers**: Game state announcements via `aria-live`
- ✅ **High Contrast**: Clear focus rings and color contrasts
- ✅ **Semantic HTML**: Proper heading hierarchy and landmarks

## Configuration

### LocalStorage Keys

- `ehm-stats`: Game statistics (games, wins, streak)
- `ehm-settings`: Game settings (maxMistakes, allowHints)

### Customization

Edit `src/App.tsx` to customize the theme:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' }, // Deep green
    error: { main: '#c62828' },   // Brick red
  },
});
```

## Development

### Code Quality Tools

```bash
# Run ESLint
npx eslint src

# Format code with Prettier
npx prettier --write src

# Type check
npx tsc --noEmit
```

### Adding Words

Edit `src/data/words-eo.json` to add or modify words:

```json
[
  "hundo",
  "kato",
  "domo"
]
```

All words should be:
- Lowercase
- NFC normalized
- Valid Esperanto words
- Without spaces or hyphens

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Mobile

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub issue tracker](https://github.com/Vaporjawn/esperanto-hangman/issues) to report bugs or request features.

## 📄 License

[MIT](LICENSE) © Victor Williams (@Vaporjawn)

## 🙏 Acknowledgments

- Word list curated from common Esperanto vocabulary
- Inspired by the classic Hangman game
- Built with ❤️ for the Esperanto community

## ⭐ Show Your Support

Give a ⭐️ if this project helped you learn or practice Esperanto!

