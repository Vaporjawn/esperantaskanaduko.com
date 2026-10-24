# Quick Start Guide

Get Esperanto Hangman up and running in 5 minutes!

## Prerequisites

- **Node.js 20+**: [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **Code Editor**: We recommend [VS Code](https://code.visualstudio.com/)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Vaporjawn/esperanto-hangman.git
cd esperanto-hangman
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including React, TypeScript, Vite, and Material-UI.

### 3. Start Development Server

```bash
npm run dev
```

Your game will be available at: **http://localhost:5173**

## Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev

# Type checking
npm run type-check

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Building

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy

# Deploy to Surge
npm run deploy:surge

# Deploy to both platforms
npm run deploy:both
```

### Maintenance

```bash
# Clean build artifacts and dependencies
npm run clean

# Clean and reinstall everything
npm run reinstall
```

## Project Structure

```
esperanto-hangman/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── data/           # Esperanto word list
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Game pages
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main app component
├── .github/            # GitHub configuration
│   ├── workflows/      # CI/CD workflows
│   └── ISSUE_TEMPLATE/ # Issue templates
└── package.json        # Dependencies and scripts
```

## Configuration Files

- **`.nvmrc`**: Node version specification
- **`vite.config.ts`**: Build configuration
- **`tsconfig.json`**: TypeScript configuration
- **`eslint.config.js`**: Linting rules
- **`.prettierrc`**: Code formatting rules
- **`.editorconfig`**: Editor settings

## Testing the Game

### Manual Testing Checklist

1. **Start the game**: Click "Nova ludo" (New Game)
2. **Test keyboard input**:
   - Type regular letters: a, b, c
   - Type x-notation: cx → ĉ, gx → ĝ, hx → ĥ, jx → ĵ, sx → ŝ, ux → ŭ
3. **Test mouse input**: Click letter buttons
4. **Test game completion**:
   - Win a game (guess all letters)
   - Lose a game (6 wrong guesses)
5. **Test statistics**: Check that stats update correctly
6. **Test responsive design**: Resize browser window
7. **Test accessibility**: Use Tab key for navigation

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
npm run reinstall
```

### Build Errors

```bash
# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint
```

### Git Issues

```bash
# Reset local changes
git reset --hard HEAD
git clean -fd
```

## IDE Setup

### VS Code (Recommended)

Install these extensions:

1. **ESLint**: `dbaeumer.vscode-eslint`
2. **Prettier**: `esbenp.prettier-vscode`
3. **TypeScript**: Built-in
4. **Error Lens**: `usernamehw.errorlens`
5. **GitLens**: `eamodio.gitlens`

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Environment Variables

This project doesn't require environment variables for local development. All configuration is in the source code.

For production deployments, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Next Steps

1. ✅ **Play the game**: Test all features
2. 📚 **Read the docs**: Check out [README.md](README.md)
3. 🤝 **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md)
4. 🐛 **Report bugs**: Use the [issue tracker](https://github.com/Vaporjawn/esperanto-hangman/issues)
5. ⭐ **Star the repo**: Show your support!

## Getting Help

- 📖 **Documentation**: Check the `/docs` folder
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Vaporjawn/esperanto-hangman/discussions)
- 🐛 **Bug Reports**: [Issue Tracker](https://github.com/Vaporjawn/esperanto-hangman/issues)
- 📧 **Email**: victor.williams.dev@gmail.com

## Learn Esperanto

New to Esperanto? Here are some resources:

- [lernu.net](https://lernu.net/) - Free Esperanto courses
- [Duolingo Esperanto](https://www.duolingo.com/course/eo/en) - Interactive lessons
- [Esperanto-USA](https://esperanto-usa.org/) - US Esperanto organization
- [r/Esperanto](https://reddit.com/r/Esperanto) - Reddit community

**Bonan lernadon! (Happy learning!)** 🎉
