# Translation Settings - Quick Start Guide

Get started with Translation Settings in under 5 minutes! 🚀

## Quick Setup (3 Steps)

### Step 1: Load the Extension
```bash
# Build the extension
npm run build

# In Chrome:
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode" (top right)
# 3. Click "Load unpacked"
# 4. Select the "dist" folder
```

### Step 2: Configure Basic Settings
1. Click the extension icon in your toolbar
2. Click the settings gear icon (⚙️)
3. Enable "Auto-translate pages"
4. Choose translation quality:
   - **Fast** ⚡ - Quick but less accurate
   - **Balanced** ⚖️ - Good default (recommended)
   - **Accurate** 🎯 - Best quality, slower

### Step 3: Add Your First Domain
1. In settings, scroll to "Whitelisted Domains"
2. Type a domain (e.g., `wikipedia.org`)
3. Click the blue "Add" button
4. Visit that website - it auto-translates! ✨

**Done!** Your extension is ready to use.

---

## Common Use Cases

### Use Case 1: Auto-Translate News Sites
**Goal**: Read foreign news automatically

**Setup** (30 seconds):
1. Enable "Auto-translate pages"
2. Add news domain to whitelist: `lemonde.fr`
3. Visit the site - it translates automatically!

**Example domains**:
- `lemonde.fr` (French news)
- `elpais.com` (Spanish news)
- `spiegel.de` (German news)

---

### Use Case 2: Multi-Language Wikipedia
**Goal**: Auto-translate all Wikipedia languages except English

**Setup** (1 minute):
1. Enable "Auto-translate pages"
2. Add to whitelist: `*.wikipedia.org` (all languages)
3. Add to blacklist: `en.wikipedia.org` (exclude English)
4. Set quality to "Balanced"

**Result**:
- ✅ French Wikipedia (`fr.wikipedia.org`) → Auto-translates
- ✅ Spanish Wikipedia (`es.wikipedia.org`) → Auto-translates
- ❌ English Wikipedia (`en.wikipedia.org`) → No translation (blacklisted)

---

### Use Case 3: Research & Documentation
**Goal**: Accurately translate technical content

**Setup** (30 seconds):
1. Set quality to "Accurate" 🎯
2. Use keyboard shortcut `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
3. Read high-quality translations

**Best for**:
- Technical documentation
- Academic papers
- Business communications
- Professional content

---

## Keyboard Shortcuts Cheat Sheet

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| **Translate Page** | `Ctrl+Shift+E` | `Cmd+Shift+E` |
| **Restore Original** | `Ctrl+Shift+R` | `Cmd+Shift+R` |

**Tip**: Customize shortcuts at `chrome://extensions/shortcuts`

---

## Domain Pattern Examples

### Exact Match
```
example.com
```
Matches: Only `example.com`  
Does NOT match: `www.example.com`, `subdomain.example.com`

### Wildcard Pattern
```
*.example.com
```
Matches: `www.example.com`, `blog.example.com`, ANY subdomain  
Does NOT match: `example.com` (root domain)

### Multiple Subdomains
```
*.stackoverflow.com
```
Matches:
- `stackoverflow.com` (root)
- `meta.stackoverflow.com`
- `serverfault.com`? **NO** - different domain!

**Tip**: Use wildcards for multi-language sites like Wikipedia, StackExchange, etc.

---

## Settings Overview

### General Settings
- **Auto-translate pages**: Enable/disable automatic translation
- **Default**: OFF (manual translation only)

### Translation Quality
- **Fast** ⚡: ~1-2 seconds, good for casual browsing
- **Balanced** ⚖️: ~2-3 seconds, good all-around (default)
- **Accurate** 🎯: ~3-5 seconds, best for important content

### Whitelisted Domains
- Domains that WILL auto-translate
- Supports exact matches and wildcards (*.example.com)
- Add/remove domains with one click

### Blacklisted Domains
- Domains that will NEVER translate
- Takes precedence over whitelist
- Good for login pages, banks, native language sites

### Keyboard Shortcuts
- **Translate**: Ctrl+Shift+E (Cmd+Shift+E on Mac)
- **Restore**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Customizable at `chrome://extensions/shortcuts`

---

## Troubleshooting

### ❌ Auto-translate not working?

**Check these settings**:
1. ✅ "Auto-translate pages" is ON
2. ✅ Domain is in whitelist
3. ✅ Domain is NOT in blacklist
4. ✅ Valid Google Translate API key configured
5. ✅ Page fully loaded (wait 1-2 seconds)

**Try**:
- Refresh the page
- Check domain spelling
- Look for console errors (F12 → Console)

---

### ❌ Translation quality poor?

**Solution**: Switch to "Accurate" mode
1. Open settings
2. Select "Accurate" 🎯 under Translation Quality
3. Next translation will use higher quality

---

### ❌ Can't add domain?

**Common errors**:
- ❌ `https://example.com` → ✅ Use `example.com` (no protocol)
- ❌ `example.com/` → ✅ Use `example.com` (no trailing slash)
- ❌ `.example.com` → ✅ Use `example.com` or `*.example.com`
- ❌ Duplicate domain → ✅ Check if already in list

---

### ❌ Keyboard shortcuts not working?

**Solutions**:
1. Check if another extension uses same shortcut
2. Visit `chrome://extensions/shortcuts` to customize
3. Restart Chrome after changing shortcuts
4. Try on different website (some sites override shortcuts)

---

## Tips & Best Practices

### 🎯 Performance Tips
- Keep whitelist focused (10-20 domains max)
- Use "Balanced" mode for everyday use
- Add domains as needed, not all at once
- Remove unused domains regularly

### 🔒 Security Tips
- Blacklist bank/payment sites
- Blacklist login pages
- Don't translate sensitive content
- Review translations on important documents

### 🎨 Organization Tips
- Group related domains (all news, all documentation, etc.)
- Use wildcards for site families (*.wikipedia.org)
- Document why you blacklisted certain domains
- Test settings on one domain before scaling up

---

## Advanced Tips

### Tip 1: Exclude Login Pages
```
Whitelist: *.google.com
Blacklist: accounts.google.com
```
Result: Translates all Google services EXCEPT login page

### Tip 2: Fast Mode for Social Media
```
Quality: Fast ⚡
Whitelist: twitter.com, reddit.com
```
Result: Quick translations of social content

### Tip 3: Accurate Mode for Work
```
Quality: Accurate 🎯
Whitelist: docs.internal-company.com
```
Result: High-quality translations for professional use

### Tip 4: Keyboard Shortcut Workflow
```
1. Visit any foreign page
2. Press Ctrl+Shift+E
3. Read translation
4. Press Ctrl+Shift+R to restore
```
Result: Super fast translation workflow, no clicking!

---

## What's Next?

### More Features Coming
- Import/export settings
- Per-domain quality preferences
- Translation history
- Advanced regex patterns

### Stay Updated
- Check the [roadmap](ESPERANTO_TRANSLATOR_MVP_ROADMAP.md)
- Read [full documentation](TRANSLATION_SETTINGS_USER_GUIDE.md)
- Review [testing guide](TRANSLATION_SETTINGS_TESTING.md)

---

## Need Help?

### Documentation
- **User Guide**: [TRANSLATION_SETTINGS_USER_GUIDE.md](TRANSLATION_SETTINGS_USER_GUIDE.md)
- **Implementation**: [TRANSLATION_SETTINGS_IMPLEMENTATION.md](TRANSLATION_SETTINGS_IMPLEMENTATION.md)
- **Testing**: [TRANSLATION_SETTINGS_TESTING.md](TRANSLATION_SETTINGS_TESTING.md)

### Support
- [GitHub Issues](https://github.com/Vaporjawn/esperanto-translator/issues)
- [README](README.md) for general setup
- Check console logs (F12 → Console) for errors

---

## Quick Reference Card

```
╔══════════════════════════════════════════════════════════╗
║           ESPERANTO TRANSLATOR - QUICK REFERENCE          ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  KEYBOARD SHORTCUTS                                        ║
║  ─────────────────────────────────────────────────────    ║
║  Translate Page:    Ctrl+Shift+E  (Cmd+Shift+E on Mac)   ║
║  Restore Original:  Ctrl+Shift+R  (Cmd+Shift+R on Mac)   ║
║                                                            ║
║  TRANSLATION QUALITY                                       ║
║  ─────────────────────────────────────────────────────    ║
║  Fast ⚡:      Quick, less accurate                       ║
║  Balanced ⚖️:  Default, good all-around                   ║
║  Accurate 🎯:  Best quality, slower                       ║
║                                                            ║
║  DOMAIN PATTERNS                                           ║
║  ─────────────────────────────────────────────────────    ║
║  example.com        → Exact match only                    ║
║  *.example.com      → All subdomains                      ║
║                                                            ║
║  PRIORITY RULE                                             ║
║  ─────────────────────────────────────────────────────    ║
║  Blacklist ALWAYS wins over whitelist                     ║
║                                                            ║
╚══════════════════════════════════════════════════════════╝
```

---

**Last Updated**: November 24, 2025  
**Version**: 1.0.0  
**Author**: Victor Williams (@Vaporjawn)

**Ready to start?** Follow the 3-step setup at the top of this guide! 🚀
