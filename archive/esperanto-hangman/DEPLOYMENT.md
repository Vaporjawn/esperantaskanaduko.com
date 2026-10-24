# Deployment Guide

This document provides comprehensive instructions for deploying the Esperanto Hangman game to GitHub Pages and Surge.

## Automated Deployment (Recommended)

The project is configured with GitHub Actions to automatically deploy on every push to the `main` branch.

### Prerequisites

1. **GitHub Repository Settings**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

2. **Surge Credentials**
   - Sign up at [surge.sh](https://surge.sh)
   - Get your Surge token: `surge token`
   - Add to GitHub Secrets:
     - Go to Settings → Secrets and variables → Actions
     - Add `SURGE_TOKEN` with your token
     - Add `SURGE_LOGIN` with your email

### Automatic Deployment

Once configured, simply push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The GitHub Action will:
1. ✅ Build the project
2. ✅ Run linting
3. ✅ Deploy to GitHub Pages
4. ✅ Deploy to Surge
5. ✅ Comment deployment URLs on PRs

## Manual Deployment

### GitHub Pages (Manual)

```bash
# Build and deploy
npm run build
npm run deploy

# Or separately
npm run build
npx gh-pages -d dist
```

### Surge (Manual)

```bash
# Build and deploy
npm run build
npm run deploy:surge

# Or with custom domain
npm run build
npx surge ./dist your-custom-domain.surge.sh
```

## Deployment URLs

After deployment, your game will be available at:

- **GitHub Pages**: https://vaporjawn.github.io/esperanto-hangman/
- **Surge**: https://esperanto-hangman.surge.sh

## Custom Domain Setup

### For GitHub Pages

1. Create a `CNAME` file in the `public/` directory:
   ```
   yourdomain.com
   ```

2. Configure DNS with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: vaporjawn.github.io
   ```

3. Enable custom domain in GitHub Settings → Pages

### For Surge

1. Deploy with custom domain:
   ```bash
   surge ./dist yourdomain.com
   ```

2. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: na-west1.surge.sh
   ```

## Troubleshooting

### GitHub Pages 404 Errors

If you get 404 errors:
1. Check that `base: '/esperanto-hangman/'` is set in `vite.config.ts`
2. Ensure the `gh-pages` branch exists
3. Verify Settings → Pages is configured correctly

### Surge Deployment Fails

If Surge deployment fails:
1. Verify your Surge token: `surge token`
2. Check GitHub Secrets are set correctly
3. Ensure you're logged in locally: `surge login`

### Build Errors

If build fails:
1. Clear cache: `rm -rf node_modules package-lock.json`
2. Reinstall: `npm install`
3. Try building locally: `npm run build`

## Environment Variables

For production deployments, you can set environment variables:

```env
# .env.production
VITE_APP_NAME=Esperanto Hangman
VITE_BASE_URL=https://vaporjawn.github.io/esperanto-hangman/
```

## Monitoring Deployments

### GitHub Actions

Monitor deployment status:
- Go to Actions tab in your repository
- View workflow runs and logs
- Check for any errors

### Surge

Check deployment status:
```bash
surge list
```

## Rolling Back

### GitHub Pages

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or deploy specific commit
git checkout <commit-hash>
npm run deploy
git checkout main
```

### Surge

```bash
# Deploy previous version
git checkout <previous-commit>
npm run build
npm run deploy:surge
git checkout main
```

## Performance Tips

1. **Enable Gzip**: Both platforms automatically enable gzip compression
2. **CDN Caching**: Leverage browser caching with proper headers
3. **Optimize Assets**: Images and fonts are automatically optimized during build
4. **Code Splitting**: Vite automatically handles code splitting

## Security

- Both GitHub Pages and Surge provide HTTPS by default
- No environment secrets are exposed in the client bundle
- All API keys should be server-side only (this app has no backend)

## Support

For deployment issues:
- GitHub Pages: [GitHub Docs](https://docs.github.com/en/pages)
- Surge: [Surge Help](https://surge.sh/help)
- This Project: [Open an Issue](https://github.com/Vaporjawn/esperanto-hangman/issues)
