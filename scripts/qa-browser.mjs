import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const shots = 'qa-screenshots';
mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const jsErrors = [];

async function checkNoRuntimeError(stage) {
  assert.equal(jsErrors.length, 0, 'Runtime error during ' + stage + ': ' + jsErrors.join(' | '));
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  desktop.setDefaultTimeout(15000);
  desktop.on('pageerror', (error) => jsErrors.push('desktop: ' + error.message));

  await desktop.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await desktop.locator('.premium-hero').waitFor();
  assert.ok(await desktop.locator('.orbit-marquee-product').count() >= 38, 'The two-row product marquee is missing');
  assert.ok(await desktop.getByRole('link', { name: 'Products & Technology' }).count(), 'No crawlable desktop Products link');
  await desktop.screenshot({ path: shots + '/desktop-home.png', fullPage: true });
  await checkNoRuntimeError('desktop homepage');

  await desktop.goto(base + '/products/', { waitUntil: 'domcontentloaded' });
  await desktop.locator('.catalog-product-card').first().waitFor();
  assert.equal(await desktop.locator('.catalog-product-card').count(), 38, 'Catalog is not showing all 38 products');
  await desktop.locator('.catalog-compare').nth(0).click();
  await desktop.locator('.catalog-compare').nth(1).click();
  await desktop.locator('.orbit-compare-table').waitFor();
  assert.equal(await desktop.locator('.orbit-compare-table thead th').count(), 3, 'Comparison needs two product columns');
  await desktop.screenshot({ path: shots + '/desktop-catalog-comparison.png', fullPage: true });
  await desktop.getByRole('searchbox', { name: 'Search Orbit products by name, grade or pack size' }).fill('brako');
  assert.equal(await desktop.locator('.catalog-product-card').count(), 2, 'Catalog search did not filter Brako variants');
  await checkNoRuntimeError('catalog and comparison');

  await desktop.goto(base + '/products/nova-hd40-1l/', { waitUntil: 'domcontentloaded' });
  await desktop.getByRole('heading', { level: 1, name: 'Orbit Nova HD40' }).waitFor();
  const detailImage = desktop.locator('main article img').first();
  assert.ok((await detailImage.getAttribute('src'))?.includes('nova-hd40-1l.webp'), 'Product page uses wrong artwork');
  await desktop.screenshot({ path: shots + '/desktop-product-details.png', fullPage: true });
  await checkNoRuntimeError('static product detail');

  await desktop.goto(base + '/contact/', { waitUntil: 'domcontentloaded' });
  await desktop.locator('form input[type="text"]').first().fill('Test Customer');
  await desktop.locator('form input[type="email"]').fill('test@example.com');
  await desktop.locator('form textarea').fill('Testing the transparent enquiry fallback; do not send.');
  await desktop.getByRole('button', { name: /Prepare Email Enquiry/ }).click();
  await desktop.getByText('Your Email Enquiry Is Ready').waitFor();
  await desktop.getByText('not been sent yet').waitFor();
  await checkNoRuntimeError('contact enquiry draft');

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
  mobile.setDefaultTimeout(15000);
  mobile.on('pageerror', (error) => jsErrors.push('mobile: ' + error.message));
  await mobile.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await mobile.locator('.premium-hero').waitFor();
  await mobile.screenshot({ path: shots + '/mobile-home.png', fullPage: true });
  await mobile.getByRole('button', { name: 'Toggle menu' }).click();
  await mobile.getByRole('link', { name: 'Products & Technology' }).click();
  await mobile.locator('.catalog-product-card').first().waitFor();
  assert.equal(await mobile.locator('.catalog-product-card').count(), 38, 'Mobile catalog is incomplete');
  await mobile.screenshot({ path: shots + '/mobile-catalog.png', fullPage: true });
  const overflow = await mobile.evaluate(() => ({
    pageWidth: document.documentElement.scrollWidth,
    windowWidth: window.innerWidth
  }));
  assert.ok(overflow.pageWidth <= overflow.windowWidth + 3,
    'Mobile page has unwanted horizontal overflow: ' + JSON.stringify(overflow));
  await checkNoRuntimeError('mobile menu/catalog');

  console.log('BROWSER QA PASSED: desktop/mobile hero, original product detail, 38 cards, 2-product comparison, Brako search, contact safety, mobile navigation and no JavaScript exceptions.');
} finally {
  await browser.close();
}
