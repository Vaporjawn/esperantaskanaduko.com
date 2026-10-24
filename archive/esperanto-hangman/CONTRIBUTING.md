# Contributing to Pendumulo (Esperanto Hangman) 🎮

First off, thank you for considering contributing to Pendumulo! It's people like you that make open source such a great community. Whether you're fixing bugs, adding features, improving documentation, or helping with translations, your contributions are welcome!

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to victor.williams.dev@gmail.com.

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the [issue tracker](https://github.com/Vaporjawn/esperanto-hangman/issues) to avoid duplicates. When creating a bug report, include as many details as possible using the bug report template:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples
- Describe the behavior you observed and what you expected
- Include screenshots if applicable
- Note your browser, OS, and versions

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this enhancement would be useful
- List examples of how the feature would be used
- Note if you're willing to implement the feature yourself

### Adding or Improving Esperanto Words 📚

The word list is crucial for the game! To contribute words:

1. Edit `src/data/words-eo.json`
2. Add words that are:
   - Valid Esperanto words
   - Lowercase and NFC normalized
   - Appropriate for all ages
   - Between 3-12 letters (optimal for gameplay)
3. Ensure proper use of Esperanto diacritics (ĉ, ĝ, ĥ, ĵ, ŝ, ŭ)
4. Test that the words work correctly in the game

### Improving Documentation 📝

Documentation improvements are always welcome:

- Fix typos or clarify existing documentation
- Add examples or use cases
- Translate documentation to other languages
- Create tutorials or guides
- Improve code comments

### First-Time Contributors 🌟

Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements
- `enhancement` - New features

## 🛠 Development Setup

### Prerequisites

- Node.js 20+ (we recommend using the version specified in `.nvmrc`)
- npm or yarn
- Git

### Setup Steps

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/esperanto-hangman.git
   cd esperanto-hangman
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

4. **Verify Installation**
   - Play a game and test all Esperanto characters
   - Try both keyboard and mouse input
   - Check that statistics are tracked

### Project Structure

```
src/
├── components/     # Reusable React components
├── pages/          # Main game page
├── store/          # Zustand state management
├── data/           # Esperanto word list
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── types.ts        # TypeScript definitions
└── App.tsx         # Root component
```

## ✏️ Making Changes

### Branch Naming

Create a descriptive branch name:

- `feature/add-difficulty-levels`
- `fix/keyboard-input-bug`
- `docs/update-readme`
- `refactor/simplify-game-logic`

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code patterns
   - Add comments for complex logic
   - Ensure Esperanto character support

3. **Test Thoroughly**
   ```bash
   # Run linter
   npm run lint

   # Build production version
   npm run build

   # Preview production build
   npm run preview
   ```

4. **Manual Testing Checklist**
   - [ ] Test all 28 Esperanto letters
   - [ ] Test x-notation input (cx → ĉ, etc.)
   - [ ] Test both keyboard and mouse input
   - [ ] Test on different browsers
   - [ ] Test on mobile devices
   - [ ] Verify accessibility with screen reader
   - [ ] Check that statistics persist

## 📤 Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add entry to CHANGELOG.md
   - Update relevant documentation files

2. **Create Pull Request**
   - Use the pull request template
   - Link related issues
   - Provide clear description of changes
   - Add screenshots for UI changes

3. **PR Review**
   - Address feedback promptly
   - Keep commits focused and clean
   - Be open to suggestions
   - Update your branch if needed

4. **After Merge**
   - Delete your branch
   - Pull latest changes
   - Celebrate! 🎉

### Pull Request Title Format

Use conventional commit format:

- `feat: Add difficulty level selection`
- `fix: Correct keyboard input for ĝ character`
- `docs: Update installation instructions`
- `style: Improve button hover effects`
- `refactor: Simplify word selection logic`
- `test: Add tests for game state`
- `chore: Update dependencies`

## 🎨 Code Style Guidelines

### TypeScript

```typescript
// Use clear, descriptive names
const isGameWon = guessedLetters.length === uniqueLetters.length;

// Use type annotations
const selectRandomWord = (words: string[]): string => {
  return words[Math.floor(Math.random() * words.length)];
};

// Prefer const over let
const maxMistakes = 6;
```

### React Components

```tsx
// Use functional components with TypeScript
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  children
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

### Accessibility

```tsx
// Always include ARIA labels
<button
  aria-label={`Litero ${letter}`}
  aria-pressed={isGuessed}
>
  {letter}
</button>

// Use semantic HTML
<main role="main">
  <section aria-label="Ludego">
    {/* Game content */}
  </section>
</main>
```

### Code Formatting

- Use Prettier for formatting (automatic)
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas in objects/arrays
- Semicolons required

Run formatter:
```bash
npx prettier --write src
```

## 📝 Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat: add sound effects for correct guesses

fix: resolve x-notation input bug for ŭ character

docs: add Esperanto learning resources to README

style: improve mobile responsive layout

refactor: simplify game state management logic
```

## 👥 Community

### Getting Help

- 💬 [GitHub Discussions](https://github.com/Vaporjawn/esperanto-hangman/discussions)
- 🐛 [Issue Tracker](https://github.com/Vaporjawn/esperanto-hangman/issues)
- 📧 Email: victor.williams.dev@gmail.com

### Recognition

Contributors will be:
- Listed in the Contributors section (GitHub automatic)
- Mentioned in release notes for significant contributions
- Credited in CHANGELOG.md for major features

## 🙏 Thank You!

Your contributions help make learning Esperanto more fun and accessible. Whether you're fixing a typo, adding a feature, or helping others, your efforts are appreciated!

**Dankon! 🎉**
