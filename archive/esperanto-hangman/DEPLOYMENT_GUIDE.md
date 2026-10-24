# Esperanto Hangman - Deployment Guide

## 🚀 Quick Deploy Options

Your app is production-ready and can be deployed in minutes to any of these platforms.

---

## Option 1: Netlify (Recommended - Easiest)

### Method A: Drag & Drop (No CLI needed)

1. Build your app:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://www.netlify.com/)
3. Sign in / Create account (free tier available)
4. Drag the `dist/` folder onto the Netlify dashboard
5. **Done!** Your app is live at `https://random-name.netlify.app`

### Method B: Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. Follow prompts:
   - Authorize Netlify CLI
   - Choose "Create & configure a new site"
   - Select your team
   - Enter site name (or leave blank for random name)
   - Publish directory: `dist`

4. **Done!** Site is live at provided URL

### Method C: Continuous Deployment (Git Integration)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Esperanto Hangman MVP"
   git remote add origin https://github.com/YOUR_USERNAME/esperanto-hangman.git
   git push -u origin main
   ```

2. Go to [netlify.com](https://www.netlify.com/) and create new site
3. Choose "Import from Git" → Select your repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20` (matches .nvmrc)
5. Click "Deploy site"
6. **Done!** Auto-deploys on every git push

### Custom Domain on Netlify

1. Go to Site settings → Domain management
2. Add custom domain (e.g., `esperanto-hangman.com`)
3. Update DNS records as instructed
4. Enable HTTPS (automatic via Let's Encrypt)

---

## Option 2: Vercel

### Method A: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel deploy --prod
   ```

3. Follow prompts:
   - Login to Vercel
   - Setup project (defaults should work)
   - Confirm deployment

4. **Done!** Site is live at `https://esperanto-hangman.vercel.app`

### Method B: Git Integration

1. Push code to GitHub (see Netlify Method C step 1)
2. Go to [vercel.com](https://vercel.com/)
3. Click "Import Project" → Select repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"
6. **Done!** Auto-deploys on git push

---

## Option 3: GitHub Pages

### Setup GitHub Pages Deployment

1. Install gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `package.json` - add homepage and deploy scripts:
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/esperanto-hangman",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.ts` - add base path:
   ```typescript
   export default defineConfig({
     base: '/esperanto-hangman/', // Add this line
     plugins: [react()],
   });
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Folder: `/ (root)`
   - Click Save

6. **Done!** Site live at `https://YOUR_USERNAME.github.io/esperanto-hangman`

### Custom Domain on GitHub Pages

1. Add `CNAME` file to `public/` folder:
   ```
   esperanto-hangman.com
   ```

2. In repository Settings → Pages:
   - Enter custom domain
   - Enable HTTPS (automatic)

3. Update DNS records at your domain registrar:
   - Add A records pointing to GitHub's IPs
   - Or add CNAME record to `YOUR_USERNAME.github.io`

---

## Option 4: Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com/)
2. Create account / Sign in
3. Create new project → Connect to Git
4. Select repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
6. Click "Save and Deploy"
7. **Done!** Site live at `https://esperanto-hangman.pages.dev`

### Custom Domain on Cloudflare Pages

1. Go to project → Custom domains
2. Add your domain
3. Update nameservers to Cloudflare (if not already)
4. HTTPS automatic via Cloudflare

---

## Option 5: Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```

   Configure:
   - Public directory: `dist`
   - Single-page app: `Yes`
   - GitHub integration: `No` (or Yes if you want auto-deploy)

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

5. **Done!** Site live at `https://PROJECT_ID.web.app`

---

## Option 6: AWS S3 + CloudFront (Advanced)

### Prerequisites
- AWS account
- AWS CLI installed and configured

### Steps

1. Build app:
   ```bash
   npm run build
   ```

2. Create S3 bucket:
   ```bash
   aws s3 mb s3://esperanto-hangman
   ```

3. Enable static website hosting:
   ```bash
   aws s3 website s3://esperanto-hangman --index-document index.html --error-document index.html
   ```

4. Upload files:
   ```bash
   aws s3 sync dist/ s3://esperanto-hangman --acl public-read
   ```

5. (Optional) Create CloudFront distribution for HTTPS and CDN
6. **Done!** Site accessible via S3 URL or CloudFront domain

---

## 🔧 Pre-Deployment Checklist

Before deploying, verify:

- [ ] Production build succeeds: `npm run build`
- [ ] No console errors in browser
- [ ] All features work in production preview: `npm run preview`
- [ ] Stats persist after refresh
- [ ] X-notation works correctly
- [ ] Mobile responsive layout tested
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Performance acceptable (Lighthouse score)

---

## 🌐 Environment Variables

This app has **no environment variables** or API keys to configure!

Everything runs client-side:
- ✅ No backend server required
- ✅ No database configuration
- ✅ No API keys to manage
- ✅ 100% static files

---

## 📊 Post-Deployment Verification

After deploying, test these on the live URL:

1. **Load Test**: Open URL → app loads
2. **Functionality Test**: Play one full game
3. **Stats Test**: Refresh page → stats persist
4. **Mobile Test**: Open on phone → layout works
5. **Share Test**: Share link with someone → they can play

---

## 🎯 Recommended Deployment Platform

**For this project, we recommend Netlify because:**
- ✅ Free tier is generous
- ✅ Drag-and-drop deployment (easiest)
- ✅ Automatic HTTPS
- ✅ Custom domains supported
- ✅ Excellent performance (global CDN)
- ✅ Auto-deploy on git push (optional)
- ✅ No configuration needed
- ✅ Perfect for static sites like this

**Deploy command**: Just run `npm run build` and drag `dist/` folder to Netlify!

---

## 🚨 Common Deployment Issues

### Issue: 404 on Refresh

**Symptom**: App loads at root URL but 404 on page refresh

**Solution**: Configure your host for SPA routing:

- **Netlify**: Create `public/_redirects`:
  ```
  /*    /index.html   200
  ```

- **Vercel**: Create `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

- **Firebase**: Already configured if you answered "Yes" to SPA question

- **GitHub Pages**: Should work with Vite's default setup

### Issue: Blank Page After Deploy

**Symptoms**: White screen, nothing loads

**Diagnosis**:
1. Check browser console for errors
2. Verify build succeeded locally: `npm run build && npm run preview`
3. Check if paths are correct (may need `base` in vite.config.ts for subpath hosting)

**Solution for GitHub Pages**: Ensure `base: '/repo-name/'` in `vite.config.ts`

### Issue: Assets Not Loading

**Symptom**: HTML loads but CSS/JS 404

**Solution**:
1. Verify publish directory is `dist` (not `dist/assets`)
2. Check `base` setting in `vite.config.ts`
3. Ensure all imports use relative paths

### Issue: Build Fails on Platform

**Symptom**: Deployment fails during build step

**Solution**:
1. Ensure Node version 20 specified (most hosts detect `.nvmrc`)
2. Verify build command is `npm run build`
3. Check build logs for specific error
4. Test build locally first: `npm run build`

---

## 📈 Performance Optimization (Post-Deploy)

After deploying, you can optimize further:

### 1. Enable Compression
Most hosts (Netlify, Vercel, Cloudflare) enable gzip/brotli automatically.
Verify in Network tab: `Content-Encoding: br` or `gzip`

### 2. Add Service Worker (PWA)
For offline support, add Vite PWA plugin:
```bash
npm install -D vite-plugin-pwa
```

### 3. Analyze Bundle
```bash
npm run build -- --mode production --sourcemap
```
Upload sourcemap to [bundlephobia.com](https://bundlephobia.com/) or use `rollup-plugin-visualizer`

### 4. Implement CDN
Most platforms include CDN automatically. If using custom hosting:
- Cloudflare (free tier available)
- AWS CloudFront
- Google Cloud CDN

---

## 🎉 You're Ready to Deploy!

**Fastest path to production**:
```bash
# Build your app
npm run build

# Go to netlify.com and drag the dist/ folder
```

That's it! Your Esperanto Hangman game will be live in ~30 seconds! 🚀

---

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Vercel Docs**: https://vercel.com/docs
- **Vite Deploy Guide**: https://vite.dev/guide/static-deploy.html
- **GitHub Pages**: https://pages.github.com/

---

## 🔗 Example Live URLs

After deploying, your URLs will look like:

- **Netlify**: `https://esperanto-hangman.netlify.app`
- **Vercel**: `https://esperanto-hangman.vercel.app`
- **GitHub Pages**: `https://yourusername.github.io/esperanto-hangman`
- **Cloudflare**: `https://esperanto-hangman.pages.dev`
- **Firebase**: `https://esperanto-hangman.web.app`

Replace with your actual project name and username!
