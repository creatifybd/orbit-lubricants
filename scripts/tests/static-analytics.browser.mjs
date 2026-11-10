import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const mode = process.argv.includes('--configured') ? 'configured' : 'disabled';
const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let googleRequests = 0;
let errors = [];

async function visit(page, pathname) {
  const res = await page.goto(base + pathname, { waitUntil: 'domcontentloaded' });
  assert.equal(res.status(), 200, 'Static SEO route not served: ' + pathname);
  await page.locator('script[data-orbit-kind]').waitFor({ state: 'attached' });
  const scriptSrc = await page.locator('script[data-orbit-kind]').getAttribute('src');
  assert.match(scriptSrc, /^\/assets\/orbit-static-analytics-[a-f0-9]{14}\.js$/);
  await page.waitForTimeout(150);
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/googletagmanager.com/**', async (route) => {
    googleRequests += 1;
    await route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));

  await visit(page, '/products/nova-hd40-1l/');
  assert.equal(await page.locator('script[data-orbit-analytics]').count(), 0,
    'Google script loaded before permission');

  if (mode === 'disabled') {
    assert.equal(await page.locator('.orbit-static-consent').count(), 0, 'Without GA4 ID there must be no tracking banner');
    assert.equal(googleRequests, 0);
    await visit(page, '/applications/motorcycle/');
    assert.equal(await page.locator('.orbit-static-consent').count(), 0);
    assert.equal(googleRequests, 0, 'Unconfigured static pages contacted Google');
    assert.deepEqual(errors, []);
    console.log('STATIC SEO ANALYTICS DISABLED QA PASSED: no Google ID, no prompt, no events or tag requests.');
  } else {
    await page.locator('.orbit-static-consent').waitFor({ state: 'visible' });
    assert.equal(googleRequests, 0, 'Before consent there must be zero Google calls');
    await page.getByRole('button', { name: 'Continue without analytics' }).click();
    assert.equal(await page.locator('script[data-orbit-analytics]').count(), 0);
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('.orbit-static-consent').isVisible(), false,
      'Explicit refusal should persist between loads');
    assert.equal(googleRequests, 0, 'Google request occurred after denial');

    await page.getByRole('button', { name: 'Analytics preferences' }).click();
    await page.locator('.orbit-static-consent').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Allow analytics' }).click();
    await page.locator('script[data-orbit-analytics]').waitFor({ state: 'attached' });
    const accepted = await page.evaluate(() => ({
      choice: localStorage.getItem('orbit_analytics_consent_v1'),
      commands: (window.dataLayer || []).map((x) => Array.from(x))
    }));
    assert.equal(accepted.choice, 'granted');
    assert.ok(accepted.commands.some((x) => x[0] === 'consent' && x[1] === 'default' && x[2].analytics_storage === 'denied'));
    assert.ok(accepted.commands.some((x) => x[0] === 'consent' && x[1] === 'update' && x[2].analytics_storage === 'granted'));
    assert.equal(accepted.commands.filter((x) => x[0] === 'event' && x[1] === 'page_view').length, 1);
    const viewed = accepted.commands.find((x) => x[0] === 'event' && x[1] === 'view_item');
    assert.equal(viewed[2].items[0].item_id, 'nova-hd40-1l');
    assert.equal(viewed[2].items[0].item_category, 'monograde');

    await visit(page, '/applications/motorcycle/');
    assert.equal(await page.locator('.orbit-static-consent').isVisible(), false,
      'Shared consent should work across independent SEO pages');
    const category = await page.evaluate(() => (window.dataLayer || []).map((x) => Array.from(x)));
    const listing = category.find((x) => x[0] === 'event' && x[1] === 'view_item_list');
    assert.ok(listing && listing[2].items.length >= 1, 'Missing valid catalog items event');
    assert.equal(listing[2].item_list_id, 'motorcycle');
    assert.ok(listing[2].items.every((p) => p.item_category === 'motorcycle'));
    assert.equal(category.filter((x) => x[0] === 'event' && x[1] === 'page_view').length, 1);

    await page.getByRole('button', { name: 'Analytics preferences' }).click();
    await page.getByRole('button', { name: 'Continue without analytics' }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem('orbit_analytics_consent_v1')), 'denied');
    const last = await page.evaluate(() => (window.dataLayer || [])
      .filter((x) => x[0] === 'consent').at(-1)?.[2]?.analytics_storage);
    assert.equal(last, 'denied', 'Revocation must send denied consent update');
    const previousRequests = googleRequests;
    await visit(page, '/products/nova-hd40-1l/');
    assert.equal(googleRequests, previousRequests, 'Revoked consent must not cause new Google calls');
    assert.equal(await page.locator('script[data-orbit-analytics]').count(), 0);

    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('script[data-orbit-analytics]').count(), 0,
      'Denial should carry into React homepage');
    assert.deepEqual(errors, [], 'Unexpected browser JavaScript errors');
    console.log('STATIC SEO ANALYTICS CONSENT QA PASSED: denied/granted/revoked across SEO/SPA; 1 pageview and valid GA4 item/list events.');
  }
  await context.close();
} finally {
  await browser.close();
}
