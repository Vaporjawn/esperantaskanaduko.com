---
name: Release Checklist
about: Template for creating a new release
title: 'Release v[VERSION]'
labels: 'release'
assignees: ''
---

## 🚀 Release Checklist

Version: **v[VERSION]**

### Pre-Release

- [ ] All tests pass locally (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] All PRs merged into `main`
- [ ] CHANGELOG.md updated with changes
- [ ] Version bumped in `package.json`
- [ ] README.md reviewed for accuracy

### Documentation

- [ ] New features documented
- [ ] Breaking changes highlighted
- [ ] Migration guide added (if needed)
- [ ] Screenshots updated (if UI changed)
- [ ] README badges up to date

### Testing

- [ ] Game functionality tested
- [ ] All 28 Esperanto letters work
- [ ] X-notation input works (cx → ĉ, etc.)
- [ ] Statistics persist correctly
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] Production build tested locally

### Deployment

- [ ] Tag created: `git tag v[VERSION]`
- [ ] Tag pushed: `git push origin v[VERSION]`
- [ ] GitHub release created
- [ ] Release notes published
- [ ] Both deployment URLs verified:
  - [ ] GitHub Pages: https://vaporjawn.github.io/esperanto-hangman/
  - [ ] Surge: https://esperanto-hangman.surge.sh

### Post-Release

- [ ] Release announcement posted (GitHub Discussions)
- [ ] Social media update (optional)
- [ ] Esperanto community notified (optional)
- [ ] Issues closed that were fixed in this release
- [ ] CHANGELOG.md updated with release date

### Release Notes Template

```markdown
# Release v[VERSION]

[Brief description of the release]

## ✨ New Features
- Feature 1
- Feature 2

## 🐛 Bug Fixes
- Fix 1
- Fix 2

## 📝 Documentation
- Doc update 1
- Doc update 2

## 🔧 Improvements
- Improvement 1
- Improvement 2

## 🔨 Breaking Changes
- Breaking change 1 (if any)

## 📦 Dependencies
- Dependency updates

## 🙏 Contributors
Thanks to all contributors who made this release possible!

**Full Changelog**: https://github.com/Vaporjawn/esperanto-hangman/compare/v[PREV]...v[VERSION]
```

### Version Bump Commands

```bash
# Update version in package.json
npm version [patch|minor|major]

# Create and push tag
git tag v[VERSION]
git push origin v[VERSION]

# Create release on GitHub
# Go to: https://github.com/Vaporjawn/esperanto-hangman/releases/new
```
