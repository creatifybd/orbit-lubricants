import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const origin = 'https://orbit-lubricants.com';
const folder = 'live-qa-screenshots';
mkdirSync(folder, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  desktop.on('pageerror', (e) => errors.push('desktop:' + e.message));
  desktop.setDefaultTimeout(16000);
  await desktop.goto(origin + '/', {waitUntil:'domcontentloaded', timeout:30000});
  await desktop.locator('.premium-hero').waitFor();
  await desktop.waitForTimeout(1000);
  assert.equal(await desktop.locator('.orbit-product-marquee .orbit-marquee-viewport').count(), 2);
  assert.equal(await desktop.locator('.orbit-marquee-product').count(), 76);
  await desktop.screenshot({ path: folder + '/live-desktop-home.png', fullPage:false });

  await desktop.goto(origin + '/products/', {waitUntil:'domcontentloaded', timeout:30000});
  await desktop.locator('.catalog-product-card').first().waitFor();
  assert.equal(await desktop.locator('.catalog-product-card').count(), 38);
  const chips = await desktop.evaluate(() => {
    const parent=document.querySelector('.catalog-filter-scroll'), first=parent?.querySelector('button');
    return {containerLeft:parent?.getBoundingClientRect().left,firstLeft:first?.getBoundingClientRect().left};
  });
  assert.ok(chips.firstLeft>=chips.containerLeft-2,'First category filter is clipped');
  await desktop.locator('.catalog-compare').first().click();
  await desktop.locator('.catalog-compare').nth(1).click();
  await desktop.locator('.orbit-compare-table').waitFor();
  await desktop.screenshot({ path: folder + '/live-desktop-catalog.png', fullPage:false });
  await desktop.getByRole('searchbox',{name:'Search Orbit products by name, grade or pack size'}).fill('brako');
  assert.equal(await desktop.locator('.catalog-product-card').count(),2);
  await desktop.goto(origin + '/products/nova-hd40-1l/', {waitUntil:'domcontentloaded'});
  await desktop.getByRole('heading',{level:1,name:'Orbit Nova HD40'}).waitFor();

  const mobile = await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
  mobile.on('pageerror',(e)=>errors.push('mobile:'+e.message));
  mobile.setDefaultTimeout(16000);
  await mobile.goto(origin+'/', {waitUntil:'domcontentloaded',timeout:30000});
  await mobile.locator('.premium-hero').waitFor();
  await mobile.waitForTimeout(900);
  await mobile.screenshot({path:folder+'/live-mobile-home.png',fullPage:false});
  await mobile.getByRole('button',{name:'Toggle menu'}).click();
  await mobile.getByRole('link',{name:'Products & Technology'}).click();
  await mobile.locator('.catalog-product-card').first().waitFor();
  assert.equal(await mobile.locator('.catalog-product-card').count(),38);
  await mobile.screenshot({path:folder+'/live-mobile-catalog.png',fullPage:false});
  const layout=await mobile.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(layout.scroll<=layout.width+3,'Mobile horizontal overflow: '+JSON.stringify(layout));
  assert.deepEqual(errors,[],'Live browser runtime errors');
  console.log('LIVE ORBIT CHROMIUM QA PASS: 38 product cards, 2-row marquee, visible category chips, compare, Brako search, product details, mobile navigation, no overflow or JS crashes.');
} finally {
  await browser.close();
}
