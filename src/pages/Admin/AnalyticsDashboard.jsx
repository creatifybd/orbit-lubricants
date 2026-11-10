import React, { useEffect, useRef, useState } from 'react';
import { Activity, BarChart3, ExternalLink, Eye, Gauge, Globe, LockKeyhole, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import {
  isValidGA4PropertyId, isValidGoogleOAuthClientId, loadOrbitReportSet,
  makeOrbitReport, fetchOrbitGA4, parseOrbitReport
} from '../../lib/ga4Reports';

const CONFIG_KEY = 'orbit_ga4_owner_report_config_v1';
const GOOGLE_OAUTH_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

function getConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
    return {
      propertyId: String(saved.propertyId || import.meta.env?.VITE_GA4_PROPERTY_ID || ''),
      clientId: String(saved.clientId || import.meta.env?.VITE_GOOGLE_OAUTH_CLIENT_ID || '')
    };
  } catch {
    return { propertyId: '', clientId: '' };
  }
}

let gisLoading;
function loadGoogleIdentityClient() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!gisLoading) {
    gisLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => window.google?.accounts?.oauth2 ? resolve() : reject(new Error('Google sign-in unavailable'));
      script.onerror = () => reject(new Error('Google Identity Services could not load'));
      document.head.appendChild(script);
    }).catch((error) => {
      gisLoading = null;
      throw error;
    });
  }
  return gisLoading;
}

const dataValue = (row, field) => {
  const value = Number(row?.[field]);
  return Number.isFinite(value) ? value : 0;
};
const compact = (value) => Intl.NumberFormat('en-BD', { maximumFractionDigits: 0 }).format(value);

function SummaryCard({ label, value, note, icon: Icon }) {
  return (
    <div className="orbit-analytics-stat">
      <span className="orbit-analytics-stat-icon"><Icon size={19} /></span>
      <span className="orbit-analytics-stat-label">{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
function ReportTable({ title, rows, labels, emptyText }) {
  return (
    <section className="orbit-analytics-table-wrap">
      <h3>{title}</h3>
      {rows?.length ? (
        <div className="orbit-analytics-table-scroll">
          <table>
            <thead><tr>{labels.map((label) => <th scope="col" key={label.key}>{label.title}</th>)}</tr></thead>
            <tbody>{rows.map((row, index) => (
              <tr key={index}>
                {labels.map((label) => <td key={label.key}>{label.format ? label.format(row[label.key]) : row[label.key]}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <p className="orbit-analytics-empty">{emptyText || 'No recorded activity in this report period.'}</p>}
    </section>
  );
}

export function AnalyticsDashboard() {
  const [config, setConfig] = useState(getConfig);
  const [period, setPeriod] = useState('28daysAgo');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportSet, setReportSet] = useState(null);
  const [sectionRows, setSectionRows] = useState(null);
  const [sectionStatus, setSectionStatus] = useState('');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const tokenRef = useRef(null);
  const tokenExpiresAt = useRef(0);

  useEffect(() => () => {
    // Access tokens never enter localStorage, sessionStorage, URLs or logs.
    tokenRef.current = null;
    tokenExpiresAt.current = 0;
  }, []);

  const valid = isValidGA4PropertyId(config.propertyId) && isValidGoogleOAuthClientId(config.clientId);

  const saveConfiguration = (event) => {
    event.preventDefault();
    if (!valid) {
      setError('Provide a numeric GA4 Property ID and Google OAuth Web Client ID.');
      return;
    }
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      tokenRef.current = null;
      tokenExpiresAt.current = 0;
      setConnected(false);
      setReportSet(null);
      setError('');
    } catch {
      setError('Unable to save public configuration in this browser.');
    }
  };

  const loadData = async (accessToken, selectedPeriod = period) => {
    setLoading(true);
    setError('');
    setSectionRows(null);
    setSectionStatus('');
    try {
      const data = await loadOrbitReportSet(accessToken, config.propertyId, selectedPeriod);
      setReportSet(data);
      setLastUpdated(new Date().toLocaleString());
      try {
        const json = await fetchOrbitGA4(accessToken, config.propertyId, makeOrbitReport('sections', selectedPeriod));
        setSectionRows(parseOrbitReport(json).rows);
      } catch {
        setSectionStatus('To show each section separately, register the event-scoped custom dimension section_id in GA4 Admin after enabling section_view events.');
      }
    } catch (err) {
      setReportSet(null);
      setError(err.message || 'Could not retrieve Google Analytics reports.');
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    if (!valid) {
      setError('Save your Google OAuth Web Client ID and numeric GA4 Property ID first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loadGoogleIdentityClient();
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: GOOGLE_OAUTH_SCOPE,
        callback: (response) => {
          if (!response?.access_token) {
            setLoading(false);
            setError(response?.error || 'Google Analytics permission was not granted.');
            return;
          }
          tokenRef.current = response.access_token;
          tokenExpiresAt.current = Date.now() + Math.min(Number(response.expires_in || 3500), 3500) * 1000;
          setConnected(true);
          loadData(response.access_token);
        },
        error_callback: () => {
          setLoading(false);
          setError('Google Analytics authorization was cancelled or blocked.');
        }
      });
      // This call is made directly from the admin button, not from an effect.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Unable to open Google authorization.');
    }
  };

  const refresh = (nextPeriod = period) => {
    if (!tokenRef.current || Date.now() > tokenExpiresAt.current) {
      setConnected(false);
      setError('Access has expired. Reconnect your Google Analytics account.');
      return;
    }
    loadData(tokenRef.current, nextPeriod);
  };

  const disconnect = () => {
    const oldToken = tokenRef.current;
    tokenRef.current = null;
    tokenExpiresAt.current = 0;
    if (oldToken) window.google?.accounts?.oauth2?.revoke(oldToken, () => {});
    setConnected(false);
    setReportSet(null);
    setSectionRows(null);
    setError('');
  };

  const summary = reportSet?.reports?.overview?.rows?.[0] || {};
  const reportError = (key) => reportSet?.errors?.[key] || '';

  return (
    <div className="orbit-analytics">
      <header className="orbit-analytics-head">
        <div>
          <span className="orbit-analytics-eyebrow"><ShieldCheck size={17} /> OWNER REPORTS · READ-ONLY</span>
          <h1>Website Analytics</h1>
          <p>Real GA4 reports from an authorized Google account — never browser-generated visitor totals.</p>
        </div>
        <span className="orbit-analytics-head-status"><LockKeyhole size={14} /> No visitor identities or access tokens stored</span>
      </header>

      <div className="orbit-analytics-note" role="note">
        <strong>Setup status:</strong> This is a read-only Google Analytics reporting workspace. Visitor data appears
        only after Orbit's GA4 property, web stream, OAuth client and consent-aware visitor tracking are configured.
        The existing local CMS passcode is <strong>not</strong> centralized administrator security; Google independently controls reporting access.
      </div>

      <form className="orbit-analytics-setup" onSubmit={saveConfiguration}>
        <div><label htmlFor="orbit-ga4-property">GA4 numeric Property ID</label>
          <input id="orbit-ga4-property" className="form-control" value={config.propertyId}
            onChange={(e) => setConfig((p) => ({ ...p, propertyId: e.target.value.trim() }))}
            placeholder="123456789" inputMode="numeric" />
        </div>
        <div><label htmlFor="orbit-ga4-oauth">Google OAuth Web Client ID</label>
          <input id="orbit-ga4-oauth" className="form-control" value={config.clientId}
            onChange={(e) => setConfig((p) => ({ ...p, clientId: e.target.value.trim() }))}
            placeholder="123456789-example.apps.googleusercontent.com" autoComplete="off" />
        </div>
        <button type="submit" className="btn btn-outline">Save public IDs on this device</button>
      </form>

      <div className="orbit-analytics-actions">
        <button type="button" className="btn btn-primary" onClick={connect} disabled={!valid || loading}>
          <LockKeyhole size={16} /> {connected ? 'Reconnect Analytics account' : 'Connect Analytics (Google OAuth)'}
        </button>
        {connected && (
          <>
            <select className="form-control" aria-label="Report period" value={period}
              onChange={(e) => { setPeriod(e.target.value); refresh(e.target.value); }}>
              <option value="7daysAgo">Past 7 days</option><option value="28daysAgo">Past 28 days</option><option value="90daysAgo">Past 90 days</option>
            </select>
            <button type="button" className="btn btn-outline" onClick={() => refresh()} disabled={loading}>
              <RefreshCw size={16} /> Refresh reports
            </button>
            <button type="button" className="btn btn-outline" onClick={disconnect}>Disconnect</button>
          </>
        )}
      </div>
      {error && <p role="alert" className="orbit-analytics-error">{error}</p>}
      {loading && <p role="status" className="orbit-analytics-progress">Loading authorized GA4 data…</p>}

      {reportSet && (
        <>
          <div className="orbit-analytics-stats">
            <SummaryCard icon={Activity} label="Active visitors (Realtime)" value={reportSet.realtimeActiveUsers === null ? 'Unavailable' : compact(reportSet.realtimeActiveUsers)} note="GA4 Realtime: last 30 minutes" />
            <SummaryCard icon={Globe} label="Active users" value={compact(dataValue(summary, 'activeUsers'))} note="Selected reporting period" />
            <SummaryCard icon={Gauge} label="Sessions" value={compact(dataValue(summary, 'sessions'))} />
            <SummaryCard icon={Eye} label="Page views" value={compact(dataValue(summary, 'screenPageViews'))} />
            <SummaryCard icon={BarChart3} label="Engagement rate" value={(dataValue(summary, 'engagementRate') * 100).toFixed(1) + '%'} />
          </div>
          {lastUpdated && <p className="orbit-analytics-last">Refreshed {lastUpdated}; Google Analytics reporting can be delayed or filtered by consent, thresholds and quota.</p>}
          <div className="orbit-analytics-report-grid">
            <ReportTable title="Most viewed pages" rows={reportSet.reports.pages?.rows} emptyText={reportError('pages')}
              labels={[{key:'pagePath',title:'Page path'},{key:'screenPageViews',title:'Views',format:v=>compact(Number(v||0))}]} />
            <ReportTable title="Most viewed product packs" rows={reportSet.reports.products?.rows}
              emptyText={reportError('products') || 'No view_item events recorded yet.'}
              labels={[{key:'itemId',title:'Catalog product ID'},{key:'itemsViewed',title:'Item views',format:v=>compact(Number(v||0))}]} />
            <ReportTable title="Traffic sources" rows={reportSet.reports.channels?.rows} emptyText={reportError('channels')}
              labels={[{key:'sessionSourceMedium',title:'Source / medium'},{key:'sessions',title:'Sessions',format:v=>compact(Number(v||0))}]} />
            <ReportTable title="Tracked interaction events" rows={reportSet.reports.events?.rows} emptyText={reportError('events')}
              labels={[{key:'eventName',title:'GA4 event'},{key:'eventCount',title:'Count',format:v=>compact(Number(v||0))}]} />
            <ReportTable title="Section interactions" rows={sectionRows}
              emptyText={sectionStatus || 'No section_view events recorded in this period.'}
              labels={[{key:'customEvent:section_id',title:'Section'},{key:'eventCount',title:'Views',format:v=>compact(Number(v||0))}]} />
          </div>
        </>
      )}
      {!reportSet && !loading && (
        <div className="orbit-analytics-empty-state">
          <Search size={27} />
          <h2>No authenticated analytics data loaded</h2>
          <p>Connect a Google account that has Viewer access to the Orbit GA4 Property. No demo visitor numbers are displayed.</p>
          <p><a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">Open Google Analytics <ExternalLink size={14} /></a></p>
        </div>
      )}
    </div>
  );
}
