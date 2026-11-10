import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base='http://127.0.0.1:4173';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const context=await browser.newContext({viewport:{width:1360,height:850}});
  await context.addInitScript(()=>{
    localStorage.setItem('orbit_gsc_owner_public_config_v1',JSON.stringify({
      property:'sc-domain:orbit-lubricants.com',
      clientId:'123456789-gscsmoketest.apps.googleusercontent.com'
    }));
    window.google={accounts:{oauth2:{
      initTokenClient:({callback})=>({
        requestAccessToken:()=>callback({access_token:'MOCK-GSC-OWNER-TOKEN',expires_in:3500})
      }),
      revoke:(_token,cb)=>cb()
    }}};
  });
  const requests=[];
  await context.route('**/www.googleapis.com/webmasters/v3/**',async route=>{
    const request=route.request();
    assert.equal(request.headers().authorization,'Bearer MOCK-GSC-OWNER-TOKEN');
    assert.ok(request.url().includes('/sites/sc-domain%3Aorbit-lubricants.com/searchAnalytics/query'));
    const body=JSON.parse(request.postData()||'{}');
    requests.push(body);
    assert.ok(['web','image'].includes(body.type));
    assert.equal(body.dataState,'final');
    const key=body.dimensions?.[0];
    const term=body.type==='image'?'Orbit Brako DOT 3':'gear oil 80w90';
    const pageUrl=body.type==='image'
      ?'https://orbit-lubricants.com/products/brako-dot3-500ml/'
      :'https://orbit-lubricants.com/products/gearx-80w90-4litres/';
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      rows:[{
        keys:key?[key==='query'?term:pageUrl]:[],
        clicks:body.type==='image'?4:19,
        impressions:body.type==='image'?128:361,
        ctr:body.type==='image'?4/128:19/361,
        position:body.type==='image'?12.5:5.8
      }]
    })});
  });
  const page=await context.newPage();
  const exceptions=[];
  page.on('pageerror',e=>exceptions.push(e.message));
  await page.goto(base+'/admin/',{waitUntil:'domcontentloaded'});
  const passwords=page.locator('input[type="password"]');
  assert.equal(await passwords.count(),2);
  await passwords.nth(0).fill('OrbitSafeTestOnly!2026');
  await passwords.nth(1).fill('OrbitSafeTestOnly!2026');
  await page.getByRole('button',{name:/Create Local Preview Passcode/}).click();
  await page.getByRole('button',{name:'Search Performance'}).click();
  await page.getByRole('heading',{name:'Google Search Performance'}).waitFor();
  assert.ok(await page.getByText('No Search Console reports loaded').count());
  await page.getByRole('button',{name:'Connect Search Console'}).click();
  await page.getByText('gear oil 80w90').waitFor();
  assert.ok(await page.getByText('19',{exact:true}).count());
  assert.equal(requests.length,6);
  await page.getByRole('button',{name:'Image Search'}).click();
  await page.getByText('Orbit Brako DOT 3').waitFor();
  assert.ok(await page.getByText('4',{exact:true}).count());
  assert.ok(await page.getByText('128',{exact:true}).count());
  const storage=await page.evaluate(()=>JSON.stringify(localStorage));
  assert.ok(!storage.includes('MOCK-GSC-OWNER-TOKEN'),'Google bearer token persisted in browser storage');
  assert.deepEqual(exceptions,[]);
  await page.getByRole('button',{name:'Disconnect'}).click();
  await page.getByText('No Search Console reports loaded').waitFor();
  console.log('SEARCH CONSOLE OWNER CHROME QA PASSED: OAuth permission, Web/Image rows, no invented stats, no persisted access token, disconnect.');
  await context.close();
}finally{await browser.close();}
