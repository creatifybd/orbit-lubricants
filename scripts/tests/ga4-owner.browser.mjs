import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport:{width:1280,height:850} });
  await context.addInitScript(() => {
    localStorage.setItem('orbit_ga4_owner_report_config_v1', JSON.stringify({
      propertyId:'123456789',clientId:'123456789-ownerunit.apps.googleusercontent.com'
    }));
    window.google = { accounts:{ oauth2:{
      initTokenClient:({callback}) => ({
        requestAccessToken:() => callback({ access_token:'MOCK-OWNER-ONLY-TOKEN', expires_in:3500 })
      }),
      revoke:(_token,cb) => cb()
    }}};
  });
  const attempted = [];
  await context.route('**/analyticsdata.googleapis.com/**', async (route) => {
    attempted.push(route.request().url());
    assert.equal(route.request().headers().authorization, 'Bearer MOCK-OWNER-ONLY-TOKEN');
    const body = JSON.parse(route.request().postData() || '{}');
    const realtime = route.request().url().endsWith(':runRealtimeReport');
    const dimensions=body.dimensions || [];
    const metrics=body.metrics || [];
    const dimensionValue = (n) => ({
      pagePath:'/products/', itemId:'nova-hd40-1l',eventName:'view_item',
      sessionSourceMedium:'google / organic','customEvent:section_id':'product_marquee'
    })[n] || '(not set)';
    const metricValue = (n) => ({
      activeUsers:'3', sessions:'12', screenPageViews:'42', engagedSessions:'7',
      engagementRate:'0.583', itemsViewed:'9', eventCount:'18'
    })[n] || '0';
    await route.fulfill({ status:200,contentType:'application/json',body:JSON.stringify({
      dimensionHeaders:dimensions,
      metricHeaders:metrics,
      rows:[{
        dimensionValues:dimensions.map(d=>({value:dimensionValue(d.name)})),
        metricValues:metrics.map(m=>({value:metricValue(m.name)}))
      }],
      rowCount:1
    })});
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/admin/',{waitUntil:'domcontentloaded'});
  const passcodes=page.locator('input[type="password"]');
  assert.equal(await passcodes.count(),2);
  await passcodes.nth(0).fill('OrbitSafeTestOnly!2026');
  await passcodes.nth(1).fill('OrbitSafeTestOnly!2026');
  await page.getByRole('button',{name:/Create Local Preview Passcode/}).click();
  await page.getByRole('button',{name:'Website Analytics'}).click();
  await page.getByRole('heading',{name:'Website Analytics'}).waitFor();
  assert.ok(await page.getByText('No authenticated analytics data loaded').count());
  assert.equal(await page.locator('script[data-orbit-analytics]').count(),0,
    'A visitor GA4 tag must not load on admin without an actual configured stream');
  await page.getByRole('button',{name:/Connect Analytics/}).click();
  await page.getByText('Most viewed product packs').waitFor();
  assert.ok(await page.getByText('nova-hd40-1l').count(), 'Product table must show API-provided ID');
  assert.ok(await page.getByText('google / organic').count(), 'Acquisition must come from API');
  assert.ok(await page.getByText('product_marquee').count(), 'Section views must come from API');
  assert.ok(await page.getByText('42').count(), 'Report total must come from API');
  const storage=await page.evaluate(()=>JSON.stringify(localStorage));
  assert.ok(!storage.includes('MOCK-OWNER-ONLY-TOKEN'), 'Sensitive Google OAuth token persisted');
  assert.ok(attempted.length>=6, 'Expected full analytics report set from mock GA4');
  assert.deepEqual(errors, [], 'Browser exceptions occurred');
  await page.getByRole('button',{name:'Disconnect'}).click();
  await page.getByText('No authenticated analytics data loaded').waitFor();
  console.log('OWNER GA4 CHROME QA PASSED: no fake data before OAuth; real API parsed; section, products and sources; token never persisted; disconnect works.');
  await context.close();
} finally { await browser.close(); }
