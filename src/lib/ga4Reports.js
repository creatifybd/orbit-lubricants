/**
 * Read-only GA4 owner reporting. OAuth access token must live in memory only.
 * All IDs here are public configuration; a bearer access token is SECRET and
 * must never enter localStorage, repo commits, URL query or telemetry events.
 */
const DATE_WINDOWS = new Set(['7daysAgo', '28daysAgo', '90daysAgo']);
const GA4_PROPERTIES = /^\d{6,20}$/;
const OAUTH_CLIENT = /^\d+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/;

export const isValidGA4PropertyId = (value) => GA4_PROPERTIES.test(String(value || '').trim());
export const isValidGoogleOAuthClientId = (value) => OAUTH_CLIENT.test(String(value || '').trim());

const DIMENSIONS = {
  pages: ['pagePath'],
  products: ['itemId'],
  events: ['eventName'],
  channels: ['sessionSourceMedium'],
  sections: ['customEvent:section_id']
};
const METRICS = {
  overview: ['activeUsers', 'sessions', 'screenPageViews', 'engagedSessions', 'engagementRate'],
  pages: ['screenPageViews'],
  products: ['itemsViewed'],
  events: ['eventCount'],
  channels: ['sessions'],
  sections: ['eventCount'],
};

export function makeOrbitReport(kind, period = '28daysAgo') {
  if (!(kind in METRICS)) throw new Error('Unsupported report kind');
  if (!DATE_WINDOWS.has(period)) throw new Error('Unsupported date window');
  const dimensions = (DIMENSIONS[kind] || []).map((name) => ({ name }));
  const metrics = METRICS[kind].map((name) => ({ name }));
  const metric = metrics[0]?.name;
  const query = {
    dateRanges: [{ startDate: period, endDate: 'today' }],
    metrics,
    ...(dimensions.length ? { dimensions, limit: '20' } : {}),
    returnPropertyQuota: true
  };
  if (kind === 'sections') {
    query.dimensionFilter = { filter: { fieldName: 'eventName', stringFilter: { value: 'section_view', matchType: 'EXACT' } } };
  }
  if (kind === 'pages') query.orderBys = [{ metric: { metricName: 'screenPageViews' }, desc: true }];
  if (kind === 'products') query.orderBys = [{ metric: { metricName: 'itemsViewed' }, desc: true }];
  if (kind === 'events') query.orderBys = [{ metric: { metricName: 'eventCount' }, desc: true }];
  if (kind === 'channels') query.orderBys = [{ metric: { metricName: 'sessions' }, desc: true }];
  if (kind === 'sections') query.orderBys = [{ metric: { metricName: 'eventCount' }, desc: true }];
  return query;
}

export function parseOrbitReport(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid GA4 report');
  const columns = [...(data.dimensionHeaders || []).map(x => x.name), ...(data.metricHeaders || []).map(x => x.name)];
  const rows = (data.rows || []).map(row => {
    const values = [...(row.dimensionValues || []), ...(row.metricValues || [])].map(x => x.value);
    return Object.fromEntries(columns.map((column, index) => [column, values[index] ?? '']));
  });
  return { columns, rows, rowCount: Number(data.rowCount || rows.length) };
}

export async function fetchOrbitGA4(accessToken, propertyId, request, { realtime = false, fetcher = fetch } = {}) {
  if (!isValidGA4PropertyId(propertyId)) throw new Error('Provide a valid numeric GA4 Property ID.');
  if (!accessToken || typeof accessToken !== 'string') throw new Error('Authorize a Google Analytics account first.');
  if (!request || typeof request !== 'object') throw new Error('Missing report request.');
  const endpoint = 'https://analyticsdata.googleapis.com/v1beta/properties/' + String(propertyId).trim()
    + (realtime ? ':runRealtimeReport' : ':runReport');
  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request),
    redirect: 'error',
    credentials: 'omit',
    cache: 'no-store'
  });
  if (!response.ok) {
    const code = response.status;
    const hint = code === 401 ? 'Google access expired. Reconnect to Analytics.'
      : code === 403 ? 'Your Google account may lack GA4 read access, or Analytics Data API is not enabled.'
      : code === 429 ? 'Google Analytics API quota reached; refresh later.'
      : 'Analytics report request failed (HTTP ' + code + ').';
    throw new Error(hint);
  }
  return response.json();
}

export async function loadOrbitReportSet(accessToken, propertyId, period = '28daysAgo', fetcher = fetch) {
  if (!DATE_WINDOWS.has(period)) throw new Error('Invalid date range');
  const names = ['overview', 'pages', 'products', 'events', 'channels'];
  const results = await Promise.allSettled(names.map(async (name) => {
    const json = await fetchOrbitGA4(accessToken, propertyId, makeOrbitReport(name, period), { fetcher });
    return parseOrbitReport(json);
  }));
  const reports = {};
  const errors = {};
  results.forEach((item, idx) => {
    if (item.status === 'fulfilled') reports[names[idx]] = item.value;
    else errors[names[idx]] = item.reason?.message || 'Report unavailable';
  });
  if (!Object.keys(reports).length) throw new Error(Object.values(errors)[0] || 'Google Analytics reports unavailable');
  let realtimeActiveUsers = null;
  try {
    const json = await fetchOrbitGA4(accessToken, propertyId, { metrics: [{ name: 'activeUsers' }] },
      { realtime: true, fetcher });
    realtimeActiveUsers = Number(json.rows?.[0]?.metricValues?.[0]?.value ?? 0);
  } catch (error) {
    errors.realtime = error.message;
  }
  return { reports, errors, realtimeActiveUsers, period };
}
