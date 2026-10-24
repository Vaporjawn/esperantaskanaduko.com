import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { fileURLToPath, URL } from 'url';

// Resolve paths relative to this config file (ESM-safe __dirname replacement)
const srcDir = fileURLToPath(new URL('./src', import.meta.url));
const analyzerSrc = fileURLToPath(new URL('./packages/esperanto-analyzer/src', import.meta.url));

// ─── Sentry source-map upload plugin ─────────────────────────────────────────
// Only active when SENTRY_AUTH_TOKEN is present (CI/CD production builds).
// Uploads source maps to Sentry and strips them from the public bundle so
// original source code is not exposed to end users.
// Required env vars (set as GitHub Actions secrets):
//   SENTRY_AUTH_TOKEN  — Sentry auth token with release:create + upload perms
//   VITE_SENTRY_DSN    — Sentry project DSN (also needed by main.tsx at runtime)
const sentryPlugin =
  process.env.SENTRY_AUTH_TOKEN
    ? sentryVitePlugin({
        org: 'esperanta-skanaduko',
        project: 'esperantaskanaduko-com',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        // Source maps are uploaded then deleted from the output directory.
        sourcemaps: {
          filesToDeleteAfterUpload: ['dist/**/*.map'],
        },
        // Inject the release name so Sentry can correlate events to deploys.
        release: {
          name: process.env.GITHUB_SHA ?? 'local',
          inject: true,
        },
        telemetry: false,  // opt out of Sentry telemetry on the plugin itself
      })
    : null;

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Expose the git SHA as VITE_SENTRY_RELEASE so main.tsx can pass it to
    // Sentry.init().  Falls back to 'local' when building outside CI.
    'import.meta.env.VITE_SENTRY_RELEASE': JSON.stringify(
      process.env.GITHUB_SHA ?? 'local',
    ),
  },
  plugins: [
    react(),

    // ── PWA ──────────────────────────────────────────────────────────────────
    // Generates a service worker and web app manifest.
    // Strategy: 'generateSW' (simpler, no custom SW code needed).
    // Workbox pre-caches all build assets at install time and falls back to
    // the network for anything not in the cache.
    VitePWA({
      registerType: 'autoUpdate',
      // Include all icons from /public so the service worker caches them.
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'robots.txt',
      ],
      manifest: {
        name: 'Esperanta Skanaduko',
        short_name: 'EsperSkan',
        description:
          'A curated library of Esperanto manga, literature, and learning resources.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'eo',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Pre-cache JS, CSS, HTML, images, SVGs, and fonts.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Skip waiting so the new SW activates immediately on update.
        skipWaiting: true,
        // Claim all open clients immediately after activation.
        clientsClaim: true,
        // Bump the maximum cache entry size to 4 MB (Firebase SDK chunks are ~2 MB).
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Network-first for navigation requests (SPA routing).
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^\/api\//,     // never cache API routes (none currently, defensive)
          /\.map$/,       // never cache source maps
        ],
        runtimeCaching: [
          {
            // Google Fonts (not used currently but common addition)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),

    // Bundle visualizer — generates stats.html after `npm run build`
    // Open stats.html in a browser to inspect bundle composition
    visualizer({
      filename: 'stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // 'sunburst' | 'treemap' | 'network'
    }),
    // Sentry plugin must come after other plugins so it sees the final chunks.
    sentryPlugin,
  ].filter(Boolean),
  resolve: {
    alias: [
      // More-specific aliases must come BEFORE the general @/* catch-all
      // so that e.g. "@contexts/..." doesn't get incorrectly resolved via "@"
      { find: '@contexts',   replacement: `${srcDir}/contexts` },
      { find: '@components', replacement: `${srcDir}/components` },
      { find: '@frontend',   replacement: `${srcDir}/frontend` },
      { find: '@pages',      replacement: `${srcDir}/frontend/pages` },
      { find: '@theme',      replacement: `${srcDir}/theme` },
      { find: '@hooks',      replacement: `${srcDir}/hooks` },
      { find: '@utils',      replacement: `${srcDir}/utils` },
      { find: '@i18n',       replacement: `${srcDir}/i18n` },
      { find: '@backend',    replacement: `${srcDir}/backend` },
      // In-repo Esperanto analyzer package (packages/esperanto-analyzer)
      { find: /^@esperanto-analyzer$/, replacement: `${analyzerSrc}/index.ts` },
      // General catch-all: @/foo → src/foo  (regex avoids matching @mui/...)
      { find: /^@\/(.*)/, replacement: `${srcDir}/$1` },
    ],
  },

  build: {
    // Target modern browsers (slightly better tree-shaking)
    target: 'es2020',
    // Warn when a chunk exceeds 500 kB
    chunkSizeWarningLimit: 500,
    // Source maps are required for Sentry to display original source code in
    // error reports.  The sentryVitePlugin deletes map files after upload so
    // they are not served to end users.  When building without the plugin
    // (local dev, non-production CI), hidden-source-map avoids exposing them.
    sourcemap: process.env.SENTRY_AUTH_TOKEN ? true : 'hidden',
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy:
         *
         * vendor-react    — React core runtime (~130 kB gz)
         * vendor-mui      — MUI components + icons (~280 kB gz)
         * vendor-firebase — Firebase SDK (~120 kB gz)
         * vendor-i18n     — i18next + react-i18next (~30 kB gz)
         * vendor-router   — react-router-dom (~25 kB gz)
         *
         * All other third-party deps fall into a generic vendor chunk.
         * App code is split by Vite's default route-based lazy-loading.
         */
        manualChunks(id) {
          // React core
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }

          // MUI (material-ui, emotion)
          if (
            id.includes('node_modules/@mui/') ||
            id.includes('node_modules/@emotion/')
          ) {
            return 'vendor-mui';
          }

          // Firebase
          if (id.includes('node_modules/firebase/')) {
            return 'vendor-firebase';
          }

          // i18n
          if (
            id.includes('node_modules/i18next') ||
            id.includes('node_modules/react-i18next') ||
            id.includes('node_modules/i18next-browser-languagedetector')
          ) {
            return 'vendor-i18n';
          }

          // React Router
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run/')
          ) {
            return 'vendor-router';
          }

          // TanStack Query
          if (id.includes('node_modules/@tanstack/')) {
            return 'vendor-query';
          }

          // Sentry
          if (id.includes('node_modules/@sentry/')) {
            return 'vendor-sentry';
          }

          // Anything else in node_modules → generic vendor
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
});
