import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser=await chromium.launch({channel:'chrome',headless:true});
const base='https://orbit-lubricants.com';
try{
  const context=await browser.newContext({viewport:{width:1280,height:820}});
  let apiCalls=0,tagRequests=0;
  await context.route('**/www.googleapis.com/webmasters/v3/**', route=>{
    apiCalls+=1;
    return route.abort();
  });
  await context.route('**/googletagmanager.com/**', route=>{
    tagRequests+=1;
    return route.abort();
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'/admin/',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'Orbit admin public shell not reachable');
  const fields=page.locator('input[type="password"]');
  assert.equal(await fields.count(),2,'Local preview passcode should need 2 fields');
  await fields.nth(0).fill('OrbitBrowserQATemporary!2026');
  await fields.nth(1).fill('OrbitBrowserQATemporary!2026');
  await page.getByRole('button',{name:/Create Local Preview Passcode/}).click();
  await page.getByRole('button',{name:'Search Performance'}).click();
  await page.getByRole('heading',{name:'Google Search Performance'}).waitFor();
  assert.ok(await page.getByText('No Search Console reports loaded').count());
  const options=await page.locator('#orbit-search-property option').allTextContents();
  assert.equal(options.length,2,'Only the two Orbit GSC property variants must be selectable');
  assert.equal(await page.getByRole('button',{name:'Connect Search Console'}).isDisabled(),true,
    'Google OAuth button must be disabled until a valid public OAuth Client ID is configured');
  assert.equal(apiCalls,0,'No Search Console API call before Google authorization');
  assert.equal(tagRequests,0,'No visitor GA4 tracking should be loaded in unconfigured release');
  assert.deepEqual(errors,[],'Client JavaScript error on live admin reporting page');
  console.log('LIVE GSC OWNER UI VERIFIED: actual admin shell, two Orbit properties, no fake reports, OAuth-gated API, no Google tag or client error.');
  await context.close();
}finally{await browser.close();}
