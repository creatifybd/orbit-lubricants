import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GSC_SCOPE, isOrbitSearchProperty, isGoogleBrowserClientId, gscDateRange,
  makeOrbitSearchRequest, parseOrbitSearchRows, fetchOrbitSearchConsole, loadOrbitSearchPerformance
} from '../../src/lib/searchConsoleReports.js';

test('Search Console only permits verified Orbit domain or URL-prefix property', () => {
  assert.equal(GSC_SCOPE, 'https://www.googleapis.com/auth/webmasters.readonly');
  assert.equal(isOrbitSearchProperty('sc-domain:orbit-lubricants.com'), true);
  assert.equal(isOrbitSearchProperty('https://orbit-lubricants.com/'), true);
  assert.equal(isOrbitSearchProperty('sc-domain:joytunchemicals.com'), false);
  assert.equal(isOrbitSearchProperty('https://example.com/'), false);
  assert.equal(isGoogleBrowserClientId('123456-example.apps.googleusercontent.com'), true);
  assert.equal(isGoogleBrowserClientId('secret-value'), false);
});

test('Date period is finalized Pacific-time data, three days behind current', () => {
  const v=gscDateRange(28,new Date('2026-11-10T15:00:00+06:00'));
  assert.deepEqual(v,{startDate:'2026-10-11',endDate:'2026-11-07'});
  assert.throws(()=>gscDateRange(999),/Unsupported/);
});

test('Image Search and Web Search queries use official API type, dimensions, finalized data', () => {
  const q=makeOrbitSearchRequest({type:'image',dimensions:['query'],days:28,
    now:new Date('2026-11-10T09:00:00Z')});
  assert.equal(q.type,'image');
  assert.deepEqual(q.dimensions,['query']);
  assert.equal(q.rowLimit,25);
  assert.equal(q.dataState,'final');
  assert.throws(()=>makeOrbitSearchRequest({type:'discover',dimensions:['query']}),/Unsupported/);
  assert.throws(()=>makeOrbitSearchRequest({type:'web',dimensions:['privateQuery']}),/Unsupported/);
});

test('Search Console rows are real API-sourced clicks, impressions, CTR and position', () => {
  assert.deepEqual(parseOrbitSearchRows({rows:[{
    keys:['gear oil'],
    clicks:5,impressions:92,ctr:5/92,position:8.1
  }]},['query']),[{query:'gear oil',clicks:5,impressions:92,ctr:5/92,position:8.1}]);
  assert.deepEqual(parseOrbitSearchRows({rows:[]}),[]);
});

test('Bearer token sent only in headers, never property URL or request body', async () => {
  const seen=[];
  const fetcher=async(url,options)=>{
    seen.push({url,options});
    return {ok:true,json:async()=>({rows:[{keys:['oil'],clicks:1,impressions:5,ctr:.2,position:3}]})};
  };
  const body=makeOrbitSearchRequest({type:'image',dimensions:['query']});
  const a=await fetchOrbitSearchConsole('PRIVATE-SEARCH-TOKEN','sc-domain:orbit-lubricants.com',body,{fetcher});
  assert.equal(a.rows[0].clicks,1);
  assert.equal(seen[0].url,'https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aorbit-lubricants.com/searchAnalytics/query');
  assert.equal(seen[0].options.headers.Authorization,'Bearer PRIVATE-SEARCH-TOKEN');
  assert.equal(seen[0].options.credentials,'omit');
  assert.equal(seen[0].options.cache,'no-store');
  assert.ok(!seen[0].url.includes('PRIVATE-SEARCH-TOKEN'));
  assert.ok(!seen[0].options.body.includes('PRIVATE-SEARCH-TOKEN'));
  await assert.rejects(()=>fetchOrbitSearchConsole('SECRET','sc-domain:unrelated.com',body,{fetcher}),/verified Orbit/);
});

test('403 errors describe missing Search Console authority without leaking account secrets', async () => {
  await assert.rejects(()=>fetchOrbitSearchConsole('SECRET',
    'sc-domain:orbit-lubricants.com',{},
    {fetcher:async()=>({ok:false,status:403})}),/not available to this Search Console account/);
});

test('Full Web/Image reporting set loads only real API rows and handles partial reports',async()=>{
  let calls=0;
  const fetcher=async(url,options)=>{
    calls+=1;
    const body=JSON.parse(options.body);
    if(body.type==='image'&&body.dimensions[0]==='page')return {ok:false,status:429};
    return {ok:true,json:async()=>({rows:[{
      keys:body.dimensions.map((x)=>x==='query'?'lubricant brand in bangladesh':'https://orbit-lubricants.com/products/'),
      clicks:body.type==='image'?3:18,
      impressions:body.type==='image'?120:370,ctr:.025,position:7.2
    }]})};
  };
  const data=await loadOrbitSearchPerformance('MOCK','sc-domain:orbit-lubricants.com',28,fetcher);
  assert.equal(calls,6);
  assert.equal(data.data.web_overview[0].clicks,18);
  assert.equal(data.data.image_queries[0].clicks,3);
  assert.ok(data.errors.image_pages.includes('quota'));
  assert.ok(!data.data.image_pages);
});
