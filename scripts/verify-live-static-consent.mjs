import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { initialData } from '../src/data/initialData.js';

const origin = 'https://orbit-lubricants.com';
const waitMs = 12000;
async function get(path, { method = 'GET' } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), waitMs);
  try {
    const resp = await fetch(origin + path, {
      method, signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'OrbitReleaseAudit/1.0' }
    });
    assert.equal(resp.status, 200, path + ' must return HTTP 200');
    return method === 'HEAD' ? '' : await resp.text();
  } finally {
    clearTimeout(timeout);
  }
}

const expected = JSON.parse(readFileSync('deployment.json', 'utf8'));
const live = JSON.parse(await get('/deployment.json?verify=consent-static-v1'));
assert.equal(live.commit, expected.commit);
assert.equal(live.catalogVersion, 3);
assert.equal(live.productCount, 38);

const products = initialData.products.map((p) => ({
  kind: 'product', id: p.id, path: '/products/' + p.id + '/', category: p.category
}));
const categories = initialData.categories.map((c) => ({
  kind: 'category', id: c.id, path: '/applications/' + c.id + '/', category: c.id
}));
const pages = [...products, ...categories];
assert.equal(pages.length, 47);

const matching = new Set();
let checked = 0;
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < pages.length) {
    const item = pages[cursor++];
    const html = await get(item.path);
    const src = html.match(/<script defer src="(\/assets\/orbit-static-analytics-[a-f0-9]{14}\.js)"/)?.[1];
    assert.ok(src, item.path + ' missing static GA4 adapter');
    matching.add(src);
    assert.ok(html.includes('data-orbit-kind="' + item.kind + '"'), item.path + ' wrong page kind');
    assert.ok(html.includes('data-orbit-category="' + item.category + '"'), item.path + ' missing catalog group');
    if (item.kind === 'product') {
      assert.ok(html.includes('data-orbit-id="' + item.id + '"'), item.path + ' wrong SKU identity');
      assert.ok(html.includes('primaryImageOfPage'), item.path + ' missing image SEO metadata');
    } else {
      assert.ok(html.includes('data-orbit-items="'), item.path + ' missing listing SKU IDs');
      assert.ok(html.includes('CollectionPage'), item.path + ' missing collection schema');
    }
    checked += 1;
  }
}));
assert.equal(checked, 47);
assert.equal(matching.size, 1, 'All standalone pages must share the same versioned adapter');

const scriptPath = [...matching][0];
const client = await get(scriptPath);
const digest = createHash('sha256').update(client).digest('hex').slice(0, 14);
assert.ok(scriptPath.includes('-' + digest + '.js'), 'Published analytics script is not hash-matched');
assert.ok(client.includes('const measurementId = "";'), 'Live page analytics must remain disabled until owner config');
assert.ok(!client.includes('G-TEST123456'), 'Fake GA4 test stream leaked into production');

const sitemap = await get('/sitemap.xml');
assert.equal((sitemap.match(/<loc>/g) || []).length, 52);
assert.equal((sitemap.match(/<image:loc>/g) || []).length, 76);
const html = await get('/');
const appSrc = html.match(/<script[^>]+src="(\/assets\/[^"]+\.js)"/)?.[1];
assert.ok(appSrc, 'Missing live React bundle');
const spa = await get(appSrc);
assert.ok(!spa.includes('G-TEST123456'), 'Fake GA4 stream leaked into React bundle');

console.log(JSON.stringify({
  result: 'PASS',
  status: 'Actual live server HTML/JS audited, no visitor GA4 stream configured',
  products: products.length,
  applications: categories.length,
  staticRoutesChecked: checked,
  staticAdapter: scriptPath,
  imageReferences: 76,
  sitemapURLs: 52,
  originalProductImageBytes: 'Untouched by this release',
  activation: 'requires owner GA4 stream and privacy approval'
}, null, 2));
