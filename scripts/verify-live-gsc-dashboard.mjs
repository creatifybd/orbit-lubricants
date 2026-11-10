import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Live Hostinger rejects headless browser probes with HTTP 403.
// Verify the deployed HTML/JS/source version using bounded read-only HTTP.
// A successful result is NOT a live UI interaction or real OAuth verification.
const base='https://orbit-lubricants.com';
async function get(path) {
  const r=await fetch(base+path,{
    headers:{'Cache-Control':'no-cache'},
    signal:AbortSignal.timeout(12000)
  });
  assert.equal(r.status,200,path+' must return HTTP 200');
  return r.text();
}
const expected=JSON.parse(readFileSync('deployment.json','utf8'));
const live=JSON.parse(await get('/deployment.json?verify=owner-gsc'));
assert.equal(live.commit,expected.commit,'Stale Hostinger Git build');
assert.equal(live.productCount,38);
assert.equal(live.catalogVersion,3);
const html=await get('/');
const bundled=html.match(/<script[^>]+src="(\/assets\/[^"]+\.js)"/)?.[1];
assert.ok(bundled,'No published React application script');
const client=await get(bundled);
for(const key of ['Search Performance','Google Search Performance','webmasters.readonly','webmasters/v3/sites/','Image Search']){
  assert.ok(client.includes(key),'Published JS missing Search Console module: '+key);
}
assert.ok(!client.includes('MOCK-GSC-OWNER-TOKEN'),'Test OAuth token leaked into production');
assert.ok(!client.includes('G-TEST123456'),'Fake GA4 measurement stream leaked');
const sku=await get('/products/nova-hd40-1l/');
assert.ok(sku.includes('data-orbit-kind="product"'),'Static product consent adapter missing');
const hub=await get('/applications/motorcycle/');
assert.ok(hub.includes('data-orbit-kind="category"'),'Static category consent adapter missing');
const sitemap=await get('/sitemap.xml');
assert.equal((sitemap.match(/<loc>/g)||[]).length,52);
assert.equal((sitemap.match(/<image:loc>/g)||[]).length,76);
console.log(JSON.stringify({
  status:'PASS',
  tested:'Live HTTP version marker, React bundle contents, GSC OAuth module and public SEO pages',
  bundle:bundled,
  searchConsoleModule:'published',
  GA4Measurement:'not configured',
  serverSideOAuth:'not connected; Google account access required',
  limitation:'Hostinger HTTP 403 blocks GitHub headless-browser access to /admin; live interactive UI test not established',
  separateStagingBrowserEvidence:'https://github.com/creatifybd/orbit-lubricants/actions/runs/42790107789'
},null,2));
