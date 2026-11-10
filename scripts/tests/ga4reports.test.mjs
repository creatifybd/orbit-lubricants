import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidGA4PropertyId, isValidGoogleOAuthClientId, makeOrbitReport,
  parseOrbitReport, fetchOrbitGA4, loadOrbitReportSet
} from '../../src/lib/ga4Reports.js';

test('config identifiers are constrained and never credentials', () => {
  assert.equal(isValidGA4PropertyId('123456789'), true);
  assert.equal(isValidGA4PropertyId('abc123'), false);
  assert.equal(isValidGA4PropertyId('1234/other'), false);
  assert.equal(isValidGoogleOAuthClientId('123456789-sample123.apps.googleusercontent.com'), true);
  assert.equal(isValidGoogleOAuthClientId('https://evil.example'), false);
});

test('GA4 read-only report queries support approved kinds and date windows only', () => {
  assert.deepEqual(makeOrbitReport('overview').metrics.map(x=>x.name),
    ['activeUsers','sessions','screenPageViews','engagedSessions','engagementRate']);
  assert.equal(makeOrbitReport('products','7daysAgo').dimensions[0].name,'itemId');
  assert.equal(makeOrbitReport('sections','28daysAgo').dimensionFilter.filter.fieldName,'eventName');
  assert.throws(() => makeOrbitReport('customerPII'), /Unsupported/);
  assert.throws(() => makeOrbitReport('overview','last10000days'), /Unsupported/);
});

test('GA4 response mapping uses returned rows and headers, never placeholder data', () => {
  assert.deepEqual(parseOrbitReport({
    dimensionHeaders:[{name:'pagePath'}], metricHeaders:[{name:'screenPageViews'}],
    rows:[{dimensionValues:[{value:'/products/'}],metricValues:[{value:'42'}]}],rowCount:1
  }).rows,[{pagePath:'/products/',screenPageViews:'42'}]);
  assert.deepEqual(parseOrbitReport({dimensionHeaders:[],metricHeaders:[]}).rows,[]);
});

test('GA4 API call is read-only OAuth bearer, no token in URL or body', async () => {
  const records=[];
  const fetcher=async (url, options) => {
    records.push({url,options});
    return {ok:true,json:async()=>({metricHeaders:[{name:'activeUsers'}],rows:[{metricValues:[{value:'7'}]}]})};
  };
  const result=await fetchOrbitGA4('SECRET-TOKEN','123456789',{metrics:[{name:'activeUsers'}]},{fetcher});
  assert.equal(result.rows[0].metricValues[0].value,'7');
  assert.equal(records[0].url,'https://analyticsdata.googleapis.com/v1beta/properties/123456789:runReport');
  assert.equal(records[0].options.headers.Authorization,'Bearer SECRET-TOKEN');
  assert.equal(records[0].options.credentials,'omit');
  assert.equal(records[0].options.cache,'no-store');
  assert.ok(!records[0].url.includes('SECRET'));
  assert.ok(!records[0].options.body.includes('SECRET'));
});

test('unauthorized Google request produces clear access error without exposing token', async () => {
  const fetcher=async()=>({ok:false,status:403});
  await assert.rejects(
    ()=>fetchOrbitGA4('SECRET-TOKEN','123456789',{}, {fetcher}), /may lack GA4 read access/);
});

test('owner report set parses official values, protects against partial report failures', async () => {
  const fetcher=async (url,options) => {
    const b=JSON.parse(options.body);
    if(url.endsWith(':runRealtimeReport')) return {ok:true,json:async()=>({
      metricHeaders:[{name:'activeUsers'}],rows:[{metricValues:[{value:'3'}]}]
    })};
    if(b.metrics.some(x=>x.name==='itemViewed'))return {ok:false,status:404};
    return {ok:true,json:async()=>({
      dimensionHeaders:b.dimensions||[],
      metricHeaders:b.metrics,
      rows:[{
        dimensionValues:(b.dimensions||[]).map(()=>({value:'/'})),
        metricValues:b.metrics.map(()=>({value:'5'}))
      }]
    })};
  };
  const data=await loadOrbitReportSet('MOCK-TOKEN','123456789','7daysAgo',fetcher);
  assert.equal(data.realtimeActiveUsers,3);
  assert.equal(data.reports.overview.rows[0].activeUsers,'5');
  assert.equal(data.reports.pages.rows[0].pagePath,'/');
});
