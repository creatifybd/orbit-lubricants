import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const footer = page.locator('footer');
  const appLink = footer.getByRole('link', { name: 'Motorcycle Oils' });
  assert.ok(await appLink.count(), 'Homepage footer lacks crawlable application link');

  await appLink.click();
  await page.waitForURL('**/applications/motorcycle/');
  assert.ok(await page.getByRole('heading', { level: 1, name: /Motorcycle Oils/ }).count(), 'Crawlable motorcycle category H1 missing');
  assert.ok(await page.locator('a[href^="/products/"]').count() > 0, 'Category has no product deep links');
  const originalImages = await page.locator('.product img').evaluateAll((imgs) =>
    imgs.map((img) => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') })));
  assert.ok(originalImages.length >= 3, 'Category has too few original product images');
  assert.ok(originalImages.every((item) => item.src.startsWith('/products/') && item.alt.includes('original product pack')),
    'Image references or descriptive alt text missing');

  const firstLink = page.locator('.product h2 a').first();
  const href = await firstLink.getAttribute('href');
  await firstLink.click();
  await page.waitForURL('**/products/**/');
  const metaImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  assert.ok(metaImage && metaImage.includes('/products/'), 'Static product page missing OG pack photo');
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const json = schemas.map(JSON.parse);
  const preferred = json.find((node) => node['@type'] === 'WebPage')?.primaryImageOfPage?.contentUrl;
  assert.equal(preferred, metaImage, 'Schema preferred image and product OG image mismatch');
  assert.equal((await page.locator('link[rel="canonical"]').getAttribute('href')),
    'https://orbit-lubricants.com' + new URL(page.url()).pathname);


  // The all-in-one gallery should be a genuinely useful image page with
  // human-readable captions and links, not a crawler-only doorway collection.
  await page.goto(base + '/product-gallery/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { level: 1, name: /Orbit Lubricants Product Gallery/ }).waitFor();
  const galleryImgs = page.locator('figure.card img');
  assert.equal(await galleryImgs.count(), 38, 'Must show all 38 original product photos in one crawlable page');
  assert.equal(await page.locator('section.group').count(), 9, 'Gallery must have all nine application groups');
  assert.equal(await page.locator('figure.card a[href^="/products/"]').count(), 76,
    'All gallery photos and descriptions should link to the matching product detail');
  const gallerySrcs = await galleryImgs.evaluateAll(nodes => nodes.map(node => ({
    src: node.getAttribute('src'), alt: node.getAttribute('alt')
  })));
  assert.equal(new Set(gallerySrcs.map(x => x.src)).size, 38, 'No repeated gallery image allowed');
  assert.ok(gallerySrcs.every(x => x.src.startsWith('/products/') && x.alt.includes('original Orbit Lubricants product pack')),
    'All original images require meaningful alt text');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),
    'https://orbit-lubricants.com/product-gallery/');

  const sitemapResponse = await context.request.get(base + '/sitemap.xml');
  assert.equal(sitemapResponse.status(), 200);
  const xml = await sitemapResponse.text();
  assert.equal((xml.match(/<loc>/g) || []).length, 53, 'Expected 53 website and gallery URL entries');
  assert.equal((xml.match(/<image:loc>/g) || []).length, 114, 'Expected 114 references to 38 original pack images');
  for (const slug of ['nova-hd40-1l','xpower-10w30-1l']) {
    if (!xml.includes('/products/' + slug + '.webp')) continue;
    const img = await context.request.head(base + '/products/' + slug + '.webp');
    assert.equal(img.status(), 200, 'Original image unavailable for ' + slug);
  }

  assert.deepEqual(errors, [], 'Browser exceptions while navigating SEO category/product pages');
  console.log('ORBIT IMAGE SEO BROWSER QA PASSED: live-style app links, static category/product, schema images, 53 sitemap pages, 114 image references.');
  await context.close();
} finally {
  await browser.close();
}
