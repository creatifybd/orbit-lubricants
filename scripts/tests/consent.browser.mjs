import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = 'http://127.0.0.1:4173/';
let googleRequests = 0;

const withPage = async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*googletagmanager.com/**', (route) => {
    googleRequests += 1;
    return route.abort();
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('.orbit-consent-panel').waitFor({ state: 'visible' });
  return { page, context };
};

try {
  {
    const { page, context } = await withPage();
    assert.equal(await page.locator('script[data-orbit-analytics]').count(), 0,
      'Google script appeared before consent');
    assert.equal(googleRequests, 0, 'Pre-consent network request to Google was made');
    await page.getByRole('button', { name: 'Continue without analytics' }).click();
    assert.equal(await page.locator('script[data-orbit-analytics]').count(), 0,
      'Google script loaded despite refusal');
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('.orbit-consent-panel').count(), 0,
      'Consent banner did not remember explicit refusal');
    assert.equal(googleRequests, 0, 'Network request was made despite consent refusal');
    await context.close();
  }

  {
    const { page, context } = await withPage();
    await page.getByRole('button', { name: 'Allow analytics' }).click();
    await page.locator('script[data-orbit-analytics]').waitFor({ state: 'attached' });
    const state = await page.evaluate(() => ({
      choice: localStorage.getItem('orbit_analytics_consent_v1'),
      commands: (window.dataLayer || []).map((args) => Array.from(args)),
    }));
    assert.equal(state.choice, 'granted', 'Explicit consent was not stored');
    assert.ok(state.commands.some((args) => args[0] === 'consent' && args[1] === 'default' && args[2].analytics_storage === 'denied'),
      'Consent default must deny analytics');
    assert.ok(state.commands.some((args) => args[0] === 'consent' && args[1] === 'update' && args[2].analytics_storage === 'granted'),
      'Explicit consent update was missing');
    await page.getByRole('button', { name: 'Analytics preferences' }).click();
    await page.getByRole('button', { name: 'Continue without analytics' }).click();
    const lastConsent = await page.evaluate(() => (window.dataLayer || []).filter((x) => x[0] === 'consent').at(-1)?.[2]);
    assert.equal(lastConsent?.analytics_storage, 'denied', 'Analytics revocation was not propagated');
    await context.close();
  }
  console.log('CONSENT BROWSER QA PASSED — refused: zero Google calls; accepted: consent v2; revoked: denied update.');
} finally {
  await browser.close();
}
