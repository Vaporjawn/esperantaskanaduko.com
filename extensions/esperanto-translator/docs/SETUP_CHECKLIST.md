# Esperanto Translator - Setup Checklist

Use this checklist to track your setup progress:

## Initial Setup

- [ ] **Clone/Navigate to Repository**
  ```bash
  cd /Users/victorwilliams/Documents/GitHub/esperanto-translator
  ```

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```
  Expected: Should install ~500+ packages without errors

- [ ] **Configure Environment Variables**
  ```bash
  cp .env.example .env
  # Edit .env and add your Google Cloud Translation API key
  ```

## Icon Setup

- [ ] **Create 16x16 PNG Icon**
  - File: `public/icons/icon16.png`
  - Size: 16x16 pixels
  - Format: PNG with transparent background
  - Design: Esperanto green star (#2e7d32)

- [ ] **Create 48x48 PNG Icon**
  - File: `public/icons/icon48.png`
  - Size: 48x48 pixels
  - Format: PNG with transparent background
  - Design: Esperanto green star (#2e7d32)

- [ ] **Create 128x128 PNG Icon**
  - File: `public/icons/icon128.png`
  - Size: 128x128 pixels
  - Format: PNG with transparent background
  - Design: Esperanto green star (#2e7d32)

- [ ] **Remove SVG Placeholders** (optional)
  ```bash
  rm public/icons/*.svg
  ```

## API Configuration

- [ ] **Get Google Cloud API Key**
  - Create Google Cloud project
  - Enable Cloud Translation API
  - Create API key credentials
  - Copy key to `.env` file

- [ ] **Test API Key**
  - Verify key works in Google Cloud Console
  - Check billing is set up (free tier available)
  - Verify translation quota limits

## Build & Test

- [ ] **Run Development Build**
  ```bash
  npm run dev
  ```
  Expected: Vite dev server starts without errors

- [ ] **Run Production Build**
  ```bash
  npm run build
  ```
  Expected: Creates `dist/` folder with extension files

- [ ] **Check Build Output**
  - Verify `dist/` folder exists
  - Check `dist/manifest.json` is present
  - Verify `dist/assets/` contains compiled files

## Chrome Extension Setup

- [ ] **Open Chrome Extensions Page**
  - Navigate to `chrome://extensions/`
  - Enable "Developer mode" (top-right toggle)

- [ ] **Load Unpacked Extension**
  - Click "Load unpacked" button
  - Select the `dist/` folder
  - Extension should appear in list

- [ ] **Verify Extension Loaded**
  - Check extension icon appears in toolbar
  - No errors shown on extensions page
  - Extension shows as "Esperanto Translator v1.0.0"

## Functionality Testing

- [ ] **Test Popup Opens**
  - Click extension icon in toolbar
  - Popup window should open
  - No console errors in DevTools

- [ ] **Test Translation Button**
  - Navigate to any webpage
  - Click extension icon
  - Click "Translate to Esperanto" button
  - Verify page translates (may need valid API key)

- [ ] **Test Settings Panel**
  - Open extension popup
  - Click "Settings" button
  - Verify settings drawer opens
  - Check all settings controls work

- [ ] **Test Keyboard Shortcuts**
  - Press `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`)
  - Verify translation activates
  - Press `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`)
  - Verify original content restores

- [ ] **Test Context Menu**
  - Right-click selected text on any page
  - Look for "Translate to Esperanto" option
  - Click and verify translation tooltip appears

## Code Quality

- [ ] **Run Linter**
  ```bash
  npm run lint
  ```
  Expected: No critical errors (warnings okay for now)

- [ ] **Run Formatter**
  ```bash
  npm run format
  ```
  Expected: Code formatted successfully

- [ ] **Run Tests**
  ```bash
  npm test
  ```
  Expected: All tests pass (currently 1 example test)

## Documentation Review

- [ ] **Read README.md**
  - Understand project overview
  - Review features list
  - Check tech stack

- [ ] **Read SETUP_GUIDE.md**
  - Follow quick start instructions
  - Review common issues section
  - Bookmark resources

- [ ] **Read ESPERANTO_TRANSLATOR_MVP_ROADMAP.md**
  - Understand full implementation plan
  - Review 9 development phases
  - Note timeline estimates (38-49 hours)

## Optional: Advanced Setup

- [ ] **Configure VSCode**
  - Install recommended extensions (ESLint, Prettier)
  - Verify TypeScript IntelliSense works
  - Check auto-format on save

- [ ] **Set Up Git**
  ```bash
  git init
  git add .
  git commit -m "Initial boilerplate setup"
  ```

- [ ] **Create Feature Branch**
  ```bash
  git checkout -b feature/initial-development
  ```

- [ ] **Configure GitHub Repository**
  - Create repository on GitHub
  - Add remote: `git remote add origin <your-repo-url>`
  - Push: `git push -u origin main`

## Troubleshooting Checklist

If something isn't working, verify:

- [ ] Node.js version is 18+ (`node --version`)
- [ ] npm version is 9+ (`npm --version`)
- [ ] `.env` file exists with valid API key
- [ ] PNG icons exist in `public/icons/` folder
- [ ] `dist/` folder was created by build command
- [ ] Chrome is using `dist/` folder (not `src/`)
- [ ] Chrome extensions page shows no errors
- [ ] DevTools console shows no critical errors
- [ ] Google Cloud Translation API is enabled
- [ ] API key has proper permissions and quota

## Success Criteria ✅

Your setup is complete when:

1. ✅ Extension loads in Chrome without errors
2. ✅ Popup UI opens and displays correctly
3. ✅ Settings panel is accessible and functional
4. ✅ Translation button triggers translation (with valid API key)
5. ✅ No TypeScript or build errors
6. ✅ All tests pass
7. ✅ Code quality checks pass

---

**Status**: Ready for Phase 1 Development! 🎉

**Next Steps**: Follow `ESPERANTO_TRANSLATOR_MVP_ROADMAP.md` Phase 1 - Translation Service Implementation
