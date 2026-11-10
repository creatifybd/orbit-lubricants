import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initialData } from '../src/data/initialData.js';

const origin = 'https://orbit-lubricants.com';
async function get(path) {
  const response = await fetch(origin + path, {
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(12000)
  });
  assert.equal(response.status, 200, path + ': expected HTTP 200, got ' + response.status);
  return response.text();
}
const expected = JSON.parse(readFileSync('deployment.json', 'utf8'));
const live = JSON.parse(await get('/deployment.json?schema-check=1'));
assert.equal(live.commit, expected.commit, 'Live Hostinger still on older source version');
assert.equal(live.productCount, 38, 'Incorrect Orbit SKU release');
for (const slug of ['nova-hd40-1l','gearx-80w90-4litres','brako-dot3-500ml']) {
  const url = '/products/' + slug + '/';
  const html = await get(url);
  assert.ok(html.includes('<link rel="canonical" href="' + origin + url + '">'), url + ': canonical missing');
  const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.deepEqual(nodes.map(x => x['@type']), ['WebPage','BreadcrumbList'], url + ': rich result node types incorrect');
  const page = nodes[0];
  assert.equal(page.mainEntity['@type'], 'Thing');
  assert.equal(page.mainEntity.identifier, slug);
  const original = initialData.products.find((item) => item.id === slug);
  assert.ok(original, 'SKU missing from verified Orbit catalog');
  const expectedOriginalImage = origin + original.image;
  assert.equal(page.mainEntity.image, expectedOriginalImage);
  assert.equal(page.primaryImageOfPage.contentUrl, expectedOriginalImage);
  assert.ok(html.includes('data-orbit-kind="product"'), url + ': consent script missing');
  assert.ok(html.includes('original Orbit lubricant product pack'), url + ': descriptive product image alt missing');
  assert.ok(!html.includes('"@type":"Product"'), url + ': ineligible Product markup still live');
  assert.ok(!html.includes('"aggregateRating"') && !html.includes('"offers"') &&
    !html.includes('"review"'), url + ': fake commerce data appeared');
  console.log('LIVE SKU SCHEMA OK:', slug, 'WebPage + Thing + ImageObject + BreadcrumbList');
}
const sitemap = await get('/sitemap.xml');
assert.equal((sitemap.match(/<loc>/g)||[]).length,52);
assert.equal((sitemap.match(/<image:loc>/g)||[]).length,76);
console.log('LIVE ORBIT PRODUCT SCHEMA PASS: current release, 3 sampled SKUs, truthful markup, original images, 52-page/76-image sitemap.');
console.log('LIMIT: Search Console Rich Results Test and actual Google indexing must be rechecked by owner. Google may cache old data.');
