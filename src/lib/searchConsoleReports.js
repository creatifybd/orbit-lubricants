/**
 * Orbit Search Console reporting — read-only, Google-authorized, no backend
 * subscription. No token, query history or search data is persisted.
 */
export const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
export const ORBIT_GSC_PROPERTIES = [
  'sc-domain:orbit-lubricants.com',
  'https://orbit-lubricants.com/'
];
const ALLOWED_TYPES = new Set(['web', 'image']);
const ALLOWED_DAYS = new Set([28, 90]);

export function isOrbitSearchProperty(value) {
  return ORBIT_GSC_PROPERTIES.includes(value);
}
export function isGoogleBrowserClientId(value) {
  return /^\d+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(String(value || '').trim());
}

function dateInPacific(value) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(value);
  const pick = (name) => Number(parts.find((x) => x.type === name)?.value);
  return Date.UTC(pick('year'), pick('month') - 1, pick('day'));
}
function isoCalendar(millis) {
  return new Date(millis).toISOString().slice(0, 10);
}
export function gscDateRange(days = 28, now = new Date()) {
  if (!ALLOWED_DAYS.has(days)) throw new Error('Unsupported report period');
  const todayPacific = dateInPacific(now);
  const latestFinalized = todayPacific - 3 * 86400000;
  return {
    startDate: isoCalendar(latestFinalized - (days - 1) * 86400000),
    endDate: isoCalendar(latestFinalized)
  };
}

export function makeOrbitSearchRequest({ type = 'web', dimensions = [], days = 28, now = new Date() } = {}) {
  if (!ALLOWED_TYPES.has(type)) throw new Error('Unsupported Search Console search type');
  if (!Array.isArray(dimensions) ||
    ![[], ['query'], ['page']].some((allowed) =>
      allowed.length === dimensions.length && allowed.every((field, index) => dimensions[index] === field))) {
    throw new Error('Unsupported Search Console dimensions');
  }
  return {
    ...gscDateRange(days, now),
    type,
    dimensions,
    rowLimit: dimensions.length ? 25 : 1,
    dataState: 'final',
    aggregationType: 'auto'
  };
}

export function parseOrbitSearchRows(data, dimensions = []) {
  if (!data || typeof data !== 'object') throw new Error('Unexpected Search Console response');
  return (data.rows || []).map((row) => {
    const result = {
      clicks: Number(row.clicks) || 0,
      impressions: Number(row.impressions) || 0,
      ctr: Number(row.ctr) || 0,
      position: Number(row.position) || 0
    };
    dimensions.forEach((key, index) => {
      result[key] = String(row.keys?.[index] || '');
    });
    return result;
  });
}

export async function fetchOrbitSearchConsole(token, property, body, { fetcher = fetch } = {}) {
  if (!isOrbitSearchProperty(property)) throw new Error('Select a verified Orbit Search Console property.');
  if (!token || typeof token !== 'string') throw new Error('Authorize an approved Google Search Console user.');
  const path = encodeURIComponent(property);
  const url = 'https://www.googleapis.com/webmasters/v3/sites/' + path + '/searchAnalytics/query';
  const response = await fetcher(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'error'
  });
  if (!response.ok) {
    const hint = response.status === 401 ? 'Google permission expired; reconnect your account.'
      : response.status === 403 || response.status === 404
        ? 'Orbit is not available to this Search Console account, or the Search Console API is disabled.'
        : response.status === 429 ? 'Google Search Console API quota reached; refresh later.'
          : 'Search Console report failed (HTTP ' + response.status + ').';
    throw new Error(hint);
  }
  return response.json();
}

export async function loadOrbitSearchPerformance(token, property, days = 28, fetcher = fetch) {
  const requests = [];
  for (const type of ['web', 'image']) {
    for (const section of ['overview', 'queries', 'pages']) {
      const dimensions = section === 'queries' ? ['query'] : section === 'pages' ? ['page'] : [];
      requests.push({
        id: type + '_' + section,
        type,
        dimensions,
        body: makeOrbitSearchRequest({ type, dimensions, days })
      });
    }
  }
  const settled = await Promise.allSettled(requests.map(async (request) => {
    const data = await fetchOrbitSearchConsole(token, property, request.body, { fetcher });
    return parseOrbitSearchRows(data, request.dimensions);
  }));
  const data = {};
  const errors = {};
  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    const key = requests[i].id;
    if (result.status === 'fulfilled') data[key] = result.value;
    else errors[key] = result.reason?.message || 'Unavailable';
  }
  if (Object.keys(data).length === 0) throw new Error(Object.values(errors)[0] || 'Search Console reports unavailable');
  return { property, days, dateRange: gscDateRange(days), data, errors };
}
