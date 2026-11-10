import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Globe, Image as ImageIcon, LockKeyhole, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import {
  GSC_SCOPE, ORBIT_GSC_PROPERTIES, isOrbitSearchProperty, isGoogleBrowserClientId,
  loadOrbitSearchPerformance
} from '../../lib/searchConsoleReports';

const STORE_KEY = 'orbit_gsc_owner_public_config_v1';
const GA4_STORE_KEY = 'orbit_ga4_owner_report_config_v1';

function initialConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    const ga4 = JSON.parse(localStorage.getItem(GA4_STORE_KEY) || '{}');
    return {
      property: isOrbitSearchProperty(saved.property) ? saved.property : ORBIT_GSC_PROPERTIES[0],
      clientId: saved.clientId || ga4.clientId || import.meta.env?.VITE_GOOGLE_OAUTH_CLIENT_ID || ''
    };
  } catch {
    return { property: ORBIT_GSC_PROPERTIES[0], clientId: '' };
  }
}
let identityLoading;
function googleIdentity() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!identityLoading) {
    identityLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => window.google?.accounts?.oauth2
        ? resolve() : reject(new Error('Google Identity client unavailable.'));
      script.onerror = () => reject(new Error('Could not load Google Identity client.'));
      document.head.appendChild(script);
    }).catch((error) => {
      identityLoading = null;
      throw error;
    });
  }
  return identityLoading;
}

const fmt = (number) => Number.isFinite(number) ? Intl.NumberFormat('en-BD').format(number) : 'Unavailable';
const pct = (value) => Number.isFinite(value) ? (value * 100).toFixed(2) + '%' : 'Unavailable';
const position = (value) => Number.isFinite(value) && value > 0 ? value.toFixed(1) : 'Unavailable';
const only = (rows) => rows?.[0] || null;

function Metric({ label, value, detail }) {
  return (
    <div className="orbit-analytics-stat">
      <span className="orbit-analytics-stat-label">{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
function SearchTable({ heading, rows, field, empty }) {
  return (
    <section className="orbit-analytics-table-wrap">
      <h3>{heading}</h3>
      {rows?.length ? <div className="orbit-analytics-table-scroll">
        <table>
          <thead><tr>
            <th scope="col">{field === 'query' ? 'Google search query' : 'Landing page URL'}</th>
            <th scope="col">Clicks</th>
            <th scope="col">Impressions</th>
            <th scope="col">CTR</th>
            <th scope="col">Avg. position</th>
          </tr></thead>
          <tbody>{rows.map((row, i) => (
            <tr key={i}>
              <td style={{ overflowWrap: 'anywhere', textAlign: 'left' }}>{row[field]}</td>
              <td>{fmt(row.clicks)}</td>
              <td>{fmt(row.impressions)}</td>
              <td>{pct(row.ctr)}</td>
              <td>{position(row.position)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div> : <p className="orbit-analytics-empty">{empty || 'Google did not return rows for this search type and date range.'}</p>}
    </section>
  );
}

export function SearchConsoleDashboard() {
  const [config, setConfig] = useState(initialConfig);
  const [days, setDays] = useState(28);
  const [type, setType] = useState('web');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const token = useRef(null);
  const expires = useRef(0);

  useEffect(() => () => {
    token.current = null;
    expires.current = 0;
  }, []);

  const valid = isOrbitSearchProperty(config.property) && isGoogleBrowserClientId(config.clientId);
  const save = (event) => {
    event.preventDefault();
    if (!valid) {
      setError('Use an approved Google OAuth Web Client ID for Orbit.');
      return;
    }
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(config));
      token.current = null;
      expires.current = 0;
      setConnected(false);
      setData(null);
      setError('');
      setStatus('Public reporting configuration saved in this browser. No access token stored.');
    } catch {
      setError('Could not save public reporting IDs in this browser.');
    }
  };

  const report = async (accessToken, period) => {
    setBusy(true);
    setError('');
    try {
      const result = await loadOrbitSearchPerformance(accessToken, config.property, period);
      setData(result);
      setStatus('Google Search Console response received. Reporting data is typically delayed and may omit anonymized queries.');
    } catch (err) {
      setData(null);
      setError(err.message || 'Search Console reports unavailable.');
    } finally {
      setBusy(false);
    }
  };

  const authorize = async () => {
    if (!valid) {
      setError('Enter an authorized Google OAuth Web Client ID and save configuration.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await googleIdentity();
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: GSC_SCOPE,
        callback: (result) => {
          if (!result?.access_token) {
            setBusy(false);
            setError('Search Console permission was not granted.');
            return;
          }
          token.current = result.access_token;
          expires.current = Date.now() + Math.min(Number(result.expires_in || 3500), 3500) * 1000;
          setConnected(true);
          report(result.access_token, days);
        },
        error_callback: () => {
          setBusy(false);
          setError('Google authorization was cancelled or blocked.');
        }
      });
      client.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      setBusy(false);
      setError(err.message || 'Google account connection failed.');
    }
  };
  const refresh = (period = days) => {
    if (!token.current || Date.now() >= expires.current) {
      setConnected(false);
      setData(null);
      setError('Google permission expired. Reconnect your Google Search Console account.');
      return;
    }
    report(token.current, period);
  };
  const disconnect = () => {
    const old = token.current;
    token.current = null;
    expires.current = 0;
    if (old) window.google?.accounts?.oauth2?.revoke(old, () => {});
    setConnected(false);
    setData(null);
    setStatus('');
    setError('');
  };

  const prefix = type + '_';
  const summary = only(data?.data?.[prefix + 'overview']);
  const queries = data?.data?.[prefix + 'queries'];
  const pages = data?.data?.[prefix + 'pages'];

  return (
    <div className="orbit-analytics">
      <header className="orbit-analytics-head">
        <div>
          <span className="orbit-analytics-eyebrow"><ShieldCheck size={16} /> SEARCH CONSOLE · READ ONLY</span>
          <h1>Google Search Performance</h1>
          <p>See which searches and landing pages earn Google Web and Image Search visibility.</p>
        </div>
        <span className="orbit-analytics-head-status"><LockKeyhole size={14} /> Google owner permission required</span>
      </header>
      <p className="orbit-analytics-note">
        This section reads only from a Search Console property your Google account has permission to access.
        It does not verify or submit the property automatically. No fake impressions, visitor counts or
        rank claims are shown; the local CMS passcode is not your Google authorization.
      </p>
      <form className="orbit-analytics-setup" onSubmit={save}>
        <div>
          <label htmlFor="orbit-search-property">Search Console property</label>
          <select id="orbit-search-property" className="form-control" value={config.property}
            onChange={(e) => setConfig((prev) => ({ ...prev, property: e.target.value }))}>
            <option value="sc-domain:orbit-lubricants.com">Domain: orbit-lubricants.com</option>
            <option value="https://orbit-lubricants.com/">URL prefix: https://orbit-lubricants.com/</option>
          </select>
        </div>
        <div>
          <label htmlFor="orbit-search-client">Google OAuth Web Client ID (public)</label>
          <input id="orbit-search-client" className="form-control" value={config.clientId}
            autoComplete="off" placeholder="12345-yourclient.apps.googleusercontent.com"
            onChange={(e) => setConfig((prev) => ({ ...prev, clientId: e.target.value.trim() }))} />
        </div>
        <button type="submit" className="btn btn-outline">Save public settings</button>
      </form>
      <div className="orbit-analytics-actions">
        <button type="button" className="btn btn-primary" onClick={authorize} disabled={!valid || busy}>
          <LockKeyhole size={16} /> {connected ? 'Reconnect Google' : 'Connect Search Console'}
        </button>
        {connected && <>
          <select className="form-control" aria-label="Search reporting period" value={days}
            onChange={(e) => { const n = Number(e.target.value); setDays(n); refresh(n); }}>
            <option value={28}>Last 28 finalized days</option>
            <option value={90}>Last 90 finalized days</option>
          </select>
          <button type="button" className="btn btn-outline" disabled={busy} onClick={() => refresh()}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button type="button" className="btn btn-outline" onClick={disconnect}>Disconnect</button>
        </>}
      </div>
      {error && <p role="alert" className="orbit-analytics-error">{error}</p>}
      {status && !error && <p role="status" className="orbit-analytics-last">{status}</p>}
      {busy && <p role="status" className="orbit-analytics-progress">Retrieving authorized Search Console reports…</p>}
      {data && <section>
        <div className="orbit-analytics-search-switch" role="group" aria-label="Google Search type">
          <button className={type === 'web' ? 'selected' : ''} type="button" onClick={() => setType('web')}>
            <Globe size={17} /> Web Search
          </button>
          <button className={type === 'image' ? 'selected' : ''} type="button" onClick={() => setType('image')}>
            <ImageIcon size={17} /> Image Search
          </button>
        </div>
        <p className="orbit-analytics-last">
          Date range: {data.dateRange.startDate} to {data.dateRange.endDate} (Google Pacific Time).
          Image Search results refer to Google’s image-results surface; this report alone does not prove which
          original image files have been indexed.
        </p>
        <div className="orbit-analytics-stats orbit-search-stats">
          <Metric label="Organic clicks" value={summary ? fmt(summary.clicks) : 'No data'} detail="Google " />
          <Metric label="Search impressions" value={summary ? fmt(summary.impressions) : 'No data'} detail="Appearance in selected search type" />
          <Metric label="Click-through rate" value={summary ? pct(summary.ctr) : 'No data'} detail="Clicks divided by impressions" />
          <Metric label="Average position" value={summary ? position(summary.position) : 'No data'} detail="Aggregate search result position" />
        </div>
        <div className="orbit-analytics-report-grid">
          <SearchTable heading={type === 'image' ? 'Image Search queries' : 'Web Search queries'}
            field="query" rows={queries} empty={data.errors[prefix + 'queries']} />
          <SearchTable heading={type === 'image' ? 'Image Search landing pages' : 'Web Search landing pages'}
            field="page" rows={pages} empty={data.errors[prefix + 'pages']} />
        </div>
        {data.errors[prefix + 'overview'] && <p className="orbit-analytics-error">{data.errors[prefix + 'overview']}</p>}
      </section>}
      {!data && !busy && <section className="orbit-analytics-empty-state">
        <Search size={28} />
        <h2>No Search Console reports loaded</h2>
        <p>Verify Orbit in Google Search Console, authorize a Google user with access, then connect here.
          Google results typically appear after a processing delay.</p>
        <p><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
          Open Google Search Console</a></p>
      </section>}
    </div>
  );
}
