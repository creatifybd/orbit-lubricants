// Orbit production SEO/security audit (read-only, bounded, no credentials).
// 43 site URLs plus a handful of public resource/security probes.
// Never modify, submit forms, scrape private content, or run continuously.
import { writeFileSync } from 'node:fs';

const base = 'https://orbit-lubricants.com';
const failures = [];
const warnings = [];
const observations = [];
const requestTimeoutMs = 12000;
const MAX_SITE_URLS = 60;
const MAX_CONCURRENT = 4;

async function inspect(path, method = 'GET') {
  const url = new URL(path, base);
  if (url.origin !== base) throw new Error('Refusing external URL: ' + url.href);
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(requestTimeoutMs),
      headers: { 'User-Agent': 'OrbitSiteHealthAudit/1.0 (read-only)',
        'Cache-Control': 'no-cache' }
    });
    return {
      status: response.status,
      url: response.url,
      headers: response.headers,
      body: method === 'HEAD' ? '' : await response.text(),
      durationMs: Date.now() - started
    };
  } catch (error) {
    return { status: 0, url: url.href, body: '', durationMs: Date.now() - started,
      error: error.message };
  }
}

function getMeta(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || '';
}

async function inBatches(paths, work) {
  let next = 0;
  await Promise.all(Array.from({ length: MAX_CONCURRENT }, async () => {
    while (next < paths.length) {
      const index = next++;
      await work(paths[index], index);
    }
  }));
}

const sitemapResponse = await inspect('/sitemap.xml');
if (sitemapResponse.status !== 200) failures.push('Sitemap returned HTTP ' + sitemapResponse.status);
const locations = [...sitemapResponse.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locations.length < 43 || locations.length > MAX_SITE_URLS) {
  failures.push('Unexpected sitemap page count: ' + locations.length);
}
if (new Set(locations).size !== locations.length) failures.push('Duplicate sitemap URLs');
if (locations.some((url) => !url.startsWith(base + '/'))) {
  failures.push('Unexpected off-domain sitemap URL');
}

const titles = new Map();
const indexability = [];
await inBatches(locations.slice(0, MAX_SITE_URLS), async (fullUrl) => {
  const path = new URL(fullUrl).pathname;
  const result = await inspect(path);
  const record = { path, status: result.status, ms: result.durationMs };
  if (result.error) failures.push(path + ' failed: ' + result.error);
  if (result.status !== 200) failures.push(path + ' returned HTTP ' + result.status);
  if (result.status === 200) {
    const canonical = getMeta(result.body, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const title = getMeta(result.body, /<title>([^<]+)<\/title>/i);
    const description = getMeta(result.body, /<meta\s+name="description"\s+content="([^"]+)"/i);
    const robots = getMeta(result.body, /<meta\s+name="robots"\s+content="([^"]+)"/i);
    record.canonical = canonical;
    record.title = title;
    if (canonical !== fullUrl) failures.push(path + ' has wrong/missing canonical URL: ' + canonical);
    if (!title || !description) failures.push(path + ' missing title or description');
    if (robots.includes('noindex')) failures.push(path + ' unexpectedly noindex');
    if (titles.has(title)) warnings.push('Duplicate title: ' + title + ' (' + path + ')');
    titles.set(title, path);
    if (path.startsWith('/products/') && path !== '/products/') {
      const schemas = [...result.body.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      const types = [];
      for (const [, json] of schemas) {
        try { types.push(JSON.parse(json)['@type']); }
        catch { failures.push(path + ' has malformed JSON-LD'); }
      }
      if (!types.includes('Product') || !types.includes('BreadcrumbList')) {
        failures.push(path + ' missing Product/Breadcrumb JSON-LD');
      }
    }
    if (result.durationMs > 3000) warnings.push(path + ' slow response: ' + result.durationMs + 'ms');
    indexability.push(path);
  }
  observations.push(record);
});

const robotsResult = await inspect('/robots.txt');
if (robotsResult.status !== 200 || !robotsResult.body.includes('Sitemap: ' + base + '/sitemap.xml')) {
  failures.push('robots.txt missing/misconfigured sitemap declaration');
}
if (!robotsResult.body.includes('Disallow: /admin')) {
  warnings.push('robots.txt does not explicitly exclude the admin preview');
}

const home = await inspect('/');
for (const key of ['x-content-type-options', 'referrer-policy', 'x-frame-options', 'permissions-policy']) {
  if (!home.headers?.get(key)) warnings.push('Missing production security header: ' + key);
}
const asset = getMeta(home.body, /<script[^>]+src="([^"]+\.js)"/);
if (!asset) failures.push('Main HTML does not reference compiled JavaScript');
else {
  const script = await inspect(asset, 'HEAD');
  if (script.status !== 200) failures.push('JS asset unavailable: ' + asset);
}

for (const path of [
  '/.git/HEAD', '/.github/workflows/deploy.yml', '/package.json',
  '/src/App.jsx', '/Selected%20Designs.zip'
]) {
  const result = await inspect(path, 'HEAD');
  observations.push({ path, status: result.status, securityProbe: true });
  if (![403, 404].includes(result.status)) {
    failures.push('Sensitive file not blocked: ' + path + ' returned ' + result.status);
  }
}

const unknown = await inspect('/orbit-nonexistent-route-sitemap-check-2026-11/');
if (unknown.status === 200) warnings.push('Unknown path served HTTP 200 instead of 404');
else if (unknown.status !== 404) warnings.push('Unknown path returned unusual HTTP ' + unknown.status);

let www;
try {
  const response = await fetch('https://www.orbit-lubricants.com/', {
    method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(requestTimeoutMs)
  });
  www = { status: response.status, finalUrl: response.url };
  if (new URL(response.url).hostname !== 'orbit-lubricants.com') {
    warnings.push('www hostname does not redirect to canonical apex host');
  }
} catch (error) {
  warnings.push('www origin not available for redirect verification: ' + error.message);
}

const report = {
  checkedAt: new Date().toISOString(),
  domain: base,
  sitemapURLs: locations.length,
  pagesPassedHTTP200: indexability.length,
  httpOnly: true,
  disclaimer: 'HTTP audit only, not Search Console indexing or Core Web Vitals field data.',
  failures,
  warnings,
  www,
  observations: observations.sort((a, b) => a.path.localeCompare(b.path))
};
writeFileSync('orbit-live-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  site: base, sitemapURLs: locations.length,
  pagesPassedHTTP200: indexability.length,
  failures: failures.length, warnings: warnings.length,
  www, sampleFailures: failures.slice(0, 20),
  sampleWarnings: warnings.slice(0, 20)
}, null, 2));
if (failures.length) {
  console.error('Orbit public URL/SEO security audit FAILED');
  process.exitCode = 1;
} else {
  console.log('Orbit public URL/SEO security audit passed');
}
