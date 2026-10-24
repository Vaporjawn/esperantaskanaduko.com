<h1 align="center">
  <img src='./src/frontend/assets/Flag_of_Esperanto.png' width='50' height='30' align='center' alt='Esperanto Flag' />
  Esperanta Skanduko
  <img src='./src/frontend/assets/Flag_of_Esperanto.png' width='50' height='30' align='center' alt='Esperanto Flag' />
</h1>

<p align="center">
  <strong>A comprehensive Esperanto learning and resource website</strong>
</p>

<p align="center">
  <a href="https://esperantaskanaduko.com">🌐 Live Website</a> •
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-contributing">Contributing</a>
</p>

<div align="center">

[![CI](https://github.com/Vaporjawn/esperantaskanaduko.com/actions/workflows/ci.yml/badge.svg)](https://github.com/Vaporjawn/esperantaskanaduko.com/actions/workflows/ci.yml)
[![GitHub Forks](https://img.shields.io/github/forks/Vaporjawn/esperantaskanaduko.com?style=for-the-badge&logo=github&logoColor=white&labelColor=black&color=blue)](https://github.com/Vaporjawn/esperantaskanaduko.com/network)
[![GitHub Stars](https://img.shields.io/github/stars/Vaporjawn/esperantaskanaduko.com?style=for-the-badge&logo=github&logoColor=white&labelColor=black&color=yellow)](https://github.com/Vaporjawn/esperantaskanaduko.com/stargazers)
[![Contributors](https://img.shields.io/github/contributors-anon/Vaporjawn/esperantaskanaduko.com?style=for-the-badge&logo=github&logoColor=white&labelColor=black&color=green)](https://github.com/Vaporjawn/esperantaskanaduko.com/graphs/contributors)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=black)](./LICENSE)

</div>

---

## 📖 About

Esperanta Skanduko is a modern, comprehensive web platform dedicated to making Esperanto learning accessible and engaging. Built with cutting-edge web technologies, this project provides learners with a rich collection of resources, interactive tools, and educational materials.

### What is Esperanto?

Esperanto is an international auxiliary language designed for ease of learning and international communication. This platform aims to preserve and share Esperanto literature, learning materials, and cultural resources.

## ✨ Features

- 🌍 **Comprehensive Resource Library** - Access to Esperanto books, articles, and learning materials
- 🔥 **Firebase Integration** - Real-time database and authentication for personalized learning
- 🎨 **Material UI Design System** - Beautiful, accessible components with custom theming
- 🌐 **Internationalization (i18n)** - Full English/Esperanto language support with react-i18next
- ⚡ **Lightning Fast** - Powered by Vite and SWC for optimal performance
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🔍 **Easy Navigation** - Intuitive routing with React Router
- ♿ **Accessibility First** - WCAG compliant with built-in MUI accessibility features
- 🧪 **Well Tested** - Comprehensive test coverage with Jest
- 🎮 **Pendumulo** - A hangman game for the 28-letter Esperanto alphabet (`/games/pendumulo`)
- 🔎 **Analyzer** - Part-of-speech and grammar analysis of Esperanto text (`/tools/analyzer`)
- 📚 **Free PDF books** - Public-domain Esperanto books hosted by the site, in the Library

## 🛠️ Tech Stack

<div align="center">

![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Material UI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white)

</div>

### Core Technologies

- **Frontend Framework:** React 18.3.1 with TypeScript 5.9.3
- **UI Library:** Material UI (MUI) 6.3.2 with custom theming
- **Internationalization:** react-i18next 15.2.3 with English/Esperanto support
- **Build Tool:** Vite 4.5.14 with SWC for ultra-fast compilation
- **Backend:** Firebase 10.14.1 (Authentication, Realtime Database, Firestore)
- **Routing:** React Router DOM 6.30.1
- **Testing:** Jest 29.7.0 with comprehensive test coverage
- **Code Quality:** ESLint, Prettier, TypeScript strict mode
- **Deployment:** GitHub Pages

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vaporjawn/esperantaskanaduko.com.git
   cd esperantaskanaduko.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (if needed)
   - Copy your Firebase configuration to `src/backend/firebase/firebaseConfig.ts`

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

Or with network access:

```bash
npm start
```

The application will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm start` | Start development server with network access |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run check` | Run all checks (install, build, lint, test) |
| `npm run deploy` | Deploy to GitHub Pages |

## 📁 Project Structure

```
esperantaskanaduko.com/
├── src/
│   ├── backend/           # Backend services and Firebase integration
│   ├── frontend/          # Frontend components, pages and routes
│   │   └── pages/         # Page components (games/, tools/, library/, resources/ ...)
│   ├── features/hangman/  # Pendumulo game logic, components and word list
│   ├── data/              # Resource, library and free-book data
│   ├── i18n/              # Translations (en and eo are complete)
│   └── main.tsx           # Application entry point
├── public/                # Static assets; public/books/ holds the free PDFs
├── packages/
│   └── esperanto-analyzer/  # Morphological analyzer library (imported as @esperanto-analyzer)
├── extensions/
│   ├── esperanto-translator/       # Chrome extension: translate pages and selections to Esperanto
│   └── esperanto-page-translator/  # Chrome extension: whole-page translation via LibreTranslate
└── archive/
    ├── skanaduko-assets/      # Scripts, raws, colour and PSD files for the Esperanta Skanaduko manga projects
    ├── free-esperanto-books/  # Original catalogue READMEs and docs for the free books
    └── esperanto-hangman/     # Licence and README of the original standalone game
```

### Merged projects

Several former repositories now live in this one, with their full git history
(`git log -- <folder>` follows it):

| Folder | Former repository |
| --- | --- |
| `packages/esperanto-analyzer` | `Vaporjawn/esperanto-analyzer` (still published to npm from this folder) |
| `extensions/esperanto-translator` | `esperanto-translator` |
| `extensions/esperanto-page-translator` | `Vaporjawn/esperanto-page-translator` |
| `archive/skanaduko-assets` | `Esperanta-Skanaduko/Esperanta-Skanaduko-Assets` |
| `archive/free-esperanto-books` | `Esperanta-Skanaduko/free-esperanto-books` (PDFs moved to `public/books/`) |
| `src/features/hangman` | `Vaporjawn/esperanto-hangman` (ported into the site; history kept) |

`packages/`, `extensions/` and `archive/` keep their own tooling and are excluded from the
site's ESLint run. Only the analyzer is imported by the site, through the `@esperanto-analyzer`
alias (see `tsconfig.json`, `vite.config.ts` and `jest.config.cjs`). Each extension has its own
README with build and install steps.

## Technologies

<img alt="TypeScript" src="https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white"/><img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/><img alt="Vite" src="https://img.shields.io/badge/vite-%23007ACC.svg?style=for-the-badge&logo=vite&logoColor=white"/><img alt="SWC" src="https://img.shields.io/badge/swc-%23F7B93E.svg?style=for-the-badge&logo=swc&logoColor=white"/><img alt="React router" src="https://img.shields.io/badge/reactrouter-%230671D5.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/><img alt="CodeCov" src="https://img.shields.io/badge/codecov-%23ff0077.svg?style=for-the-badge&logo=codecov&logoColor=white"/><img alt="Prettier" src="https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=white"/><img alt="ESLint" src="https://img.shields.io/badge/eslint-%234B32C3.svg?style=for-the-badge&logo=eslint&logoColor=white"/><img alt="Jest" src="https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white"/><img alt="GitHub Pages" src="https://img.shields.io/badge/githubpages-%23181717.svg?style=for-the-badge&logo=github&logoColor=white"/>


## 🤝 Contributing

We welcome contributions from developers of all skill levels! Whether you're fixing bugs, adding features, improving documentation, or translating content, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

For detailed guidelines, please read [CONTRIBUTING.md](./CODE_OF_CONDUCT.md)

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

<div align="center">

[![GitHub repo Issues](https://img.shields.io/github/issues/Vaporjawn/esperantaskanaduko.com?style=flat&logo=github&logoColor=red&label=Issues)](https://github.com/Vaporjawn/esperantaskanaduko.com/issues)
[![GitHub repo Good Issues for newbies](https://img.shields.io/github/issues/Vaporjawn/esperantaskanaduko.com/good%20first%20issue?style=flat&logo=github&logoColor=green&label=Good%20First%20Issues)](https://github.com/Vaporjawn/esperantaskanaduko.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
[![GitHub Help Wanted issues](https://img.shields.io/github/issues/Vaporjawn/esperantaskanaduko.com/help%20wanted?style=flat&logo=github&logoColor=b545d1&label=Help%20Wanted)](https://github.com/Vaporjawn/esperantaskanaduko.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)
[![GitHub repo PRs](https://img.shields.io/github/issues-pr/Vaporjawn/esperantaskanaduko.com?style=flat&logo=github&logoColor=orange&label=PRs)](https://github.com/Vaporjawn/esperantaskanaduko.com/pulls)

</div>

## 👥 Contributors

Thanks to all the amazing people who have contributed to this project!

[![Contributors](https://contrib.rocks/image?repo=Vaporjawn/esperantaskanaduko.com)](https://github.com/Vaporjawn/esperantaskanaduko.com/graphs/contributors)

## 🙏 Acknowledgments

- **[Project Gutenberg](https://www.gutenberg.org/)** - For providing free access to Esperanto literature and books
- **The Esperanto Community** - For keeping the language alive and thriving
- **All Contributors** - For their valuable contributions to this project

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 💬 Contact

**Victor Williams** - [@Vaporjawn](https://github.com/Vaporjawn)

- 📧 Email: victor.williams.dev@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Vaporjawn/esperantaskanaduko.com/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/Vaporjawn/esperantaskanaduko.com/discussions)

## ⭐ Support

If you find this project helpful, please consider giving it a star! It helps the project grow and reach more people interested in learning Esperanto.

[![Star History Chart](https://api.star-history.com/svg?repos=Vaporjawn/esperantaskanaduko.com&type=Date)](https://star-history.com/#Vaporjawn/esperantaskanaduko.com&Date)

---

<div align="center">

**[⬆ Back to Top](#)**

Made with ❤️ for the Esperanto community

</div>

## Installation

[![Installation](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/actions/workflows/install.js.yml/badge.svg)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/actions/workflows/install.js.yml)

```bash
npm install
```

## Running

```bash
npm start
```
or
```bash
npm run dev
```

## Testing

[![Tests](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/actions/workflows/tests.js.yml/badge.svg)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/actions/workflows/tests.js.yml)

```bash
npm test
```

## Building

[![Build](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/actions/workflows/build.js.yml/badge.svg)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/actions/workflows/build.js.yml)

```bash
npm run build
```


## How To Contribute

Please read [CONTRIBUTING](docs/CONTRIBUTING.md). If you're new to GitHub, [welcome](docs/HOWTO.md)! Remember to abide by our adapted from ![Contributor Covenant 1.3](https://img.shields.io/badge/Contributor%20Covenant-1.3-4baaaa.svg) [Code of Conduct](docs/CODE_OF_CONDUCT.md) too ([translations](#translations) also available).

Click on these badges to see how you might be able to help:

<div align="center" markdown="1">

[![GitHub repo Issues](https://img.shields.io/github/issues/Esperanta-Skanaduko/esperantaskanaduko.com?style=flat&logo=github&logoColor=red&label=Issues)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/issues)&#160;[![GitHub repo Good Issues for newbies](https://img.shields.io/github/issues/Esperanta-Skanaduko/esperantaskanaduko.com/good%20first%20issue?style=flat&logo=github&logoColor=green&label=Good%20First%20issues)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)&#160;[![GitHub Help Wanted issues](https://img.shields.io/github/issues/Esperanta-Skanaduko/esperantaskanaduko.com/help%20wanted?style=flat&logo=github&logoColor=b545d1&label=%22Help%20Wanted%22%20issues)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)[![GitHub repo PRs](https://img.shields.io/github/issues-pr/Esperanta-Skanaduko/esperantaskanaduko.com?style=flat&logo=github&logoColor=orange&label=PRs)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/pulls)&#160;[![GitHub repo Merged PRs](https://img.shields.io/github/issues-search/Esperanta-Skanaduko/esperantaskanaduko.com?style=flat&logo=github&logoColor=green&label=Merged%20PRs&query=is%3Amerged)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/pulls?q=is%3Apr+is%3Amerged)&#160;[![GitHub Help Wanted PRs](https://img.shields.io/github/issues-pr/Esperanta-Skanaduko/esperantaskanaduko.com/help%20wanted?style=flat&logo=github&logoColor=b545d1&label=%22Help%20Wanted%22%20PRs)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/pulls?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)

</div>

## Thanks to all Contributors 💪

- **Thank you** for considering to contribute
- Feel free to submit feature requests, UI updates, bugs as issues.
- Checkout [Contribution Guidelines](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/blob/master/CONTRIBUTING.md) for more information.
- Have a feature request? Feel free to create a issue for it.

[![Contributors](https://contrib.rocks/image?repo=Esperanta-Skanaduko/esperantaskanaduko.com)](https://github.com/Esperanta-Skanaduko/esperantaskanaduko.com/graphs/contributors)

Special thanks to [Project Gutenberg](https://www.gutenberg.org/) for providing free books.

## Your Support means a lot

Give a ⭐ to show support for the project.
