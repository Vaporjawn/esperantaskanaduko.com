# Translation Settings - User Guide

Welcome to the Esperanto Translator! This guide will help you configure the translation settings to customize your browsing experience.

## Getting Started

1. **Open Settings**
   - Click the Esperanto Translator icon in your browser toolbar
   - Click the gear icon (⚙️) in the top-right corner of the popup
   - The settings drawer will slide in from the right

2. **Navigate Settings**
   - Scroll through the different setting sections
   - Changes are saved automatically - no "Save" button needed!

## Setting Sections

### 1. General Settings

#### Auto-translate Pages
**What it does**: Automatically translates whitelisted websites when you visit them.

**How to use**:
- Toggle **ON** to enable automatic translation
- Add domains to your whitelist (see Domain Management section)
- Visit a whitelisted website - it will translate automatically after 1 second
- Toggle **OFF** to disable automatic translation

**Example use cases**:
- Read foreign news sites in your language automatically
- Browse Wikipedia in different languages effortlessly
- Access documentation that's not in your native language

**Tips**:
- Works great with regularly-visited foreign websites
- Use the blacklist to exclude specific sites from translation
- Disable if you prefer manual translation control

---

### 2. Translation Quality

**What it does**: Choose how your translations are processed.

#### Fast Mode ⚡
**Best for**: Quick browsing, casual reading, checking basic content

**Characteristics**:
- ✅ Fastest translation speed
- ✅ Good for informal content
- ⚠️ Lower accuracy on complex text
- ⚠️ May miss context or nuance

**Use when**:
- Quickly scanning social media posts
- Reading casual blog content
- Checking product descriptions
- Speed is more important than perfect accuracy

#### Balanced Mode ⚖️ (Default)
**Best for**: General purpose translation, everyday browsing

**Characteristics**:
- ✅ Good balance of speed and quality
- ✅ Handles most content types well
- ✅ Reasonable translation time
- ✅ Appropriate for most use cases

**Use when**:
- Reading articles and blog posts
- Browsing general web content
- Translating email or messages
- You want decent quality without waiting

#### Accurate Mode 🎯
**Best for**: Important content, professional use, formal documents

**Characteristics**:
- ✅ Highest translation accuracy
- ✅ Better handling of complex sentences
- ✅ Preserves HTML formatting
- ⚠️ Slower processing time

**Use when**:
- Reading technical documentation
- Translating business communications
- Working with academic papers
- Accuracy is critical
- Reading literary or creative content

**Switching quality modes**:
1. Click the radio button next to your preferred quality
2. The setting saves automatically
3. All future translations will use the selected quality

---

### 3. Whitelisted Domains

**What it does**: Specify which websites should be automatically translated.

#### Adding a Domain

1. Type the domain in the text field
2. Click the blue "Add" button
3. The domain appears in the list below

**Examples**:

**Exact domain match**:
```
wikipedia.org
```
Will auto-translate only `wikipedia.org`

**Wildcard pattern**:
```
*.wikipedia.org
```
Will auto-translate:
- `en.wikipedia.org`
- `es.wikipedia.org`
- `fr.wikipedia.org`
- Any subdomain of wikipedia.org

**Common patterns**:
- `example.com` - Just the main domain
- `*.example.com` - All subdomains
- `blog.example.com` - Specific subdomain only

#### Removing a Domain

1. Find the domain in the list
2. Click the trash can icon (🗑️) next to it
3. The domain is removed immediately

#### Tips

✅ **Do**: Use wildcards for sites with multiple language versions
✅ **Do**: Add frequently-visited foreign sites
✅ **Do**: Keep your list organized and relevant

❌ **Don't**: Add too many domains (can slow browsing)
❌ **Don't**: Whitelist sites in your native language
❌ **Don't**: Forget to use blacklist for exclusions

---

### 4. Blacklisted Domains

**What it does**: Prevent specific websites from being translated (even if auto-translate is on).

#### Why Use Blacklist?

- **Prevent unwanted translations** on bilingual sites
- **Exclude login pages** that break when translated
- **Skip sites** where translation causes layout issues
- **Blacklist takes precedence** over whitelist

#### Adding a Domain

1. Type the domain in the text field
2. Click the "Add" button (outlined style)
3. The domain appears in the blacklist

**Same pattern rules as whitelist**:
- Exact match: `github.com`
- Wildcard: `*.github.com`

#### Removing a Domain

1. Find the domain in the blacklist
2. Click the trash can icon (🗑️)
3. The domain is removed

#### Use Cases

**Common blacklist scenarios**:
- Bank and financial sites (security)
- Login/authentication pages
- Sites where translation breaks functionality
- E-commerce checkout pages
- Admin panels and dashboards

**Example**:
```
Whitelist: *.google.com
Blacklist: accounts.google.com
```
Result: Translates all Google services EXCEPT the login page.

---

### 5. Keyboard Shortcuts

**What it does**: Quick access to translation features via keyboard.

#### Available Shortcuts

**Translate Page**:
- **Windows/Linux**: `Ctrl+Shift+E`
- **Mac**: `Cmd+Shift+E`

**Action**: Translates the entire page from detected language to your target language.

**Restore Original**:
- **Windows/Linux**: `Ctrl+Shift+R`
- **Mac**: `Cmd+Shift+R`

**Action**: Restores the page to its original language.

#### Customizing Shortcuts

The shortcuts are pre-configured, but you can customize them:

1. Click the blue link in the settings drawer
2. Chrome opens the shortcuts configuration page
3. Click in the shortcut field
4. Press your desired key combination
5. Changes apply immediately

**Customization page**: `chrome://extensions/shortcuts`

#### Tips

- Shortcuts work on any tab, any website
- Great for quickly translating while browsing
- Muscle memory develops quickly!
- Some key combinations may conflict with browser shortcuts

---

## Common Workflows

### Workflow 1: Auto-translate News Sites

**Goal**: Read foreign news automatically

**Steps**:
1. Enable "Auto-translate pages"
2. Add news site to whitelist (e.g., `lemonde.fr`)
3. Visit the site
4. Wait 1 second - page translates automatically
5. Press `Ctrl+Shift+R` to restore original if needed

---

### Workflow 2: Translate Research Articles

**Goal**: Accurately translate academic content

**Steps**:
1. Set quality to "Accurate"
2. Visit research article
3. Click extension icon
4. Click "Translate Page"
5. Read high-quality translation
6. Use `Ctrl+Shift+E` for quick re-translation on other pages

---

### Workflow 3: Manage Multi-language Sites

**Goal**: Auto-translate some subdomains but not others

**Steps**:
1. Add `*.example.com` to whitelist
2. Add `en.example.com` to blacklist (your native language)
3. Add `login.example.com` to blacklist (security)
4. Enable auto-translate
5. Visit different subdomains:
   - `fr.example.com` → Auto-translates ✅
   - `de.example.com` → Auto-translates ✅
   - `en.example.com` → No translation ❌
   - `login.example.com` → No translation ❌

---

## Troubleshooting

### Auto-translate Not Working

**Check these settings**:
- [ ] "Auto-translate pages" is turned ON
- [ ] Domain is in the whitelist
- [ ] Domain is NOT in the blacklist (blacklist takes precedence)
- [ ] Wait at least 1 second after page loads
- [ ] Refresh the page after changing settings

**Common issues**:
- **Wrong domain format**: Must be `example.com` not `https://example.com`
- **Typo in domain**: Check spelling carefully
- **Subdomain mismatch**: `example.com` doesn't match `www.example.com` (use `*.example.com`)

### Translation Quality Issues

**If translations are inaccurate**:
1. Switch to "Accurate" mode
2. The next translation will use higher quality
3. May take slightly longer to process

**If translations are too slow**:
1. Switch to "Fast" or "Balanced" mode
2. Trade accuracy for speed
3. Good for casual browsing

### Domain Validation Errors

**"Invalid domain format"**:
- Remove `http://` or `https://`
- Remove `/` at the end
- Use only letters, numbers, dots, and optional `*.` prefix
- Examples: `example.com`, `*.example.com`, `sub.example.com`

**"Domain already exists"**:
- Check if domain is already in the list
- Remove duplicate before re-adding
- Check both whitelist AND blacklist

**"Domain cannot be empty"**:
- Type a domain before clicking Add
- Cannot add blank entries

### Keyboard Shortcuts Not Working

**Troubleshooting**:
- [ ] Check if another extension uses same shortcut
- [ ] Try customizing to different key combination
- [ ] Restart browser after changing shortcuts
- [ ] Some websites override keyboard shortcuts (try on different site)
- [ ] Check `chrome://extensions/shortcuts` to see if shortcut is registered

---

## Best Practices

### Performance Tips

✅ **Keep whitelist focused**: Only add sites you regularly visit  
✅ **Use balanced mode**: Good default for most use cases  
✅ **Test on one site first**: Before adding many domains  
✅ **Use wildcards wisely**: Only when needed for subdomains  

### Security Tips

🔒 **Blacklist sensitive sites**: Banks, payment processors, government sites  
🔒 **Avoid translating login pages**: Can cause authentication issues  
🔒 **Test before trusting**: Verify translations on important content  
🔒 **Keep extension updated**: For latest security fixes  

### Organization Tips

📋 **Review lists regularly**: Remove unused domains  
📋 **Use descriptive domains**: Make patterns clear  
📋 **Document your setup**: Note why you blacklisted certain sites  
📋 **Start small**: Add domains as you need them, not all at once  

---

## Privacy & Data

### What Gets Stored

**Locally (chrome.storage.sync)**:
- Your quality preference
- Whitelisted domains
- Blacklisted domains
- Auto-translate toggle state
- Other extension settings

**Synced Across Devices**:
If Chrome sync is enabled, your settings sync across all your devices.

### What Gets Sent to Google

**For Translation**:
- Text content to be translated
- Source and target languages
- Quality parameters (model, format)

**NOT sent**:
- Your personal information
- Your browsing history
- Your domain lists
- Other sensitive data

### Privacy Tips

- Review Google Translate API terms
- Be mindful of sensitive content
- Use extension only on trusted networks
- Disable auto-translate for sensitive browsing

---

## FAQ

**Q: Does auto-translate work on all websites?**  
A: Yes, if the domain is whitelisted and not blacklisted. Some sites with complex JavaScript may have issues.

**Q: Can I translate parts of a page instead of the whole page?**  
A: Not currently. Use the main translate button for full-page translation.

**Q: How do I know which quality mode to use?**  
A: Start with "Balanced" (default). Switch to "Fast" if it's too slow, or "Accurate" if quality matters.

**Q: Can I have both whitelist and blacklist?**  
A: Yes! Blacklist always wins. Use this to exclude specific subdomains from a wildcarded whitelist.

**Q: What happens if I add the same domain to both lists?**  
A: The domain won't translate (blacklist takes precedence).

**Q: Do settings sync across my computers?**  
A: Yes, if you have Chrome sync enabled. Otherwise, settings are device-specific.

**Q: How do I disable auto-translate temporarily?**  
A: Toggle "Auto-translate pages" OFF in settings. Your domain lists stay saved.

**Q: Can I export my domain lists?**  
A: Not currently, but this is a planned future enhancement.

---

## Need Help?

- Check the [GitHub Issues](https://github.com/Vaporjawn/esperanto-translator/issues)
- Review the [Implementation Documentation](TRANSLATION_SETTINGS_IMPLEMENTATION.md)
- Submit bug reports with detailed descriptions

---

**Last Updated**: November 24, 2025  
**Version**: 1.0.0  
**Author**: Victor Williams (@Vaporjawn)
