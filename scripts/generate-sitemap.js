/**
 * generate-sitemap.js
 * Generates /public/sitemap.xml at build time.
 *
 * Run: node scripts/generate-sitemap.js
 * Or:  npm run generate:sitemap
 *
 * The build script calls this automatically:
 *   "build": "node scripts/generate-sitemap.js && tsc && vite build"
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

const SITE_URL = 'https://esperantaskanaduko.com';
const TODAY = new Date().toISOString().split('T')[0];

/** All application routes */
const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/resources', changefreq: 'weekly', priority: '0.9' },
  { path: '/resources/learning', changefreq: 'monthly', priority: '0.8' },
  { path: '/resources/grammar', changefreq: 'monthly', priority: '0.8' },
  { path: '/resources/tools', changefreq: 'monthly', priority: '0.8' },
  { path: '/resources/books', changefreq: 'monthly', priority: '0.8' },
  { path: '/resources/music', changefreq: 'monthly', priority: '0.7' },
  { path: '/resources/audio', changefreq: 'monthly', priority: '0.7' },
  { path: '/resources/video', changefreq: 'monthly', priority: '0.7' },
  { path: '/resources/community', changefreq: 'monthly', priority: '0.7' },
  { path: '/resources/events', changefreq: 'weekly', priority: '0.7' },
  { path: '/resources/organizations', changefreq: 'monthly', priority: '0.7' },
  { path: '/resources/culture', changefreq: 'monthly', priority: '0.7' },
  { path: '/resources/news', changefreq: 'weekly', priority: '0.7' },
  { path: '/library', changefreq: 'monthly', priority: '0.8' },
  { path: '/library/esperanto-live-concert-videos', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/pendumulo', changefreq: 'monthly', priority: '0.6' },
  { path: '/tools/analyzer', changefreq: 'monthly', priority: '0.6' },
  { path: '/about', changefreq: 'yearly', priority: '0.5' },
  { path: '/donate', changefreq: 'yearly', priority: '0.5' },
];

/** Primary locales for hreflang */
const HREFLANG_LOCALES = ['en', 'eo'];

function buildUrl(route) {
  const { path, changefreq, priority } = route;
  const loc = `${SITE_URL}${path}`;

  // hreflang alternate links for en and eo
  const alternates = HREFLANG_LOCALES.map(
    (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${loc}"/>`,
  ).join('\n');
  // x-default points to the English URL
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`;

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
${xDefault}
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${routes.map(buildUrl).join('\n')}
</urlset>
`;

const outPath = join(PUBLIC_DIR, 'sitemap.xml');
writeFileSync(outPath, xml, 'utf-8');
console.log(`✅ sitemap.xml generated → ${outPath}`);
console.log(`   Routes: ${routes.length}`);
