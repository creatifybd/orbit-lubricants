import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Settings, Save, Download, Upload, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

export const SiteSettings = () => {
  const { 
    data, 
    updateSettings, 
    exportDataJSON, 
    importDataJSON, 
    resetToFactoryDefaults 
  } = useCms();
  
  const { settings } = data;
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [importJson, setImportJson] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const handleImport = (e) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    importDataJSON(importJson);
    setImportJson('');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontFamily: 'var(--font-display)' }}>
          Site Settings & Backup System
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
          Control top announcement banner, site title, and backup/restore CMS configuration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Settings Form */}
        <div style={{
          background: '#0F233D',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem'
        }}>
          <form onSubmit={handleSave} className="dark-form">
            <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              General & Banner Configuration
            </h3>

            <div className="form-group">
              <label>Website Title</label>
              <input
                type="text"
                className="form-control"
                value={settingsForm.siteTitle}
                onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Top Announcement Banner Text</label>
              <textarea
                className="form-control"
                rows={2}
                value={settingsForm.bannerText}
                onChange={e => setSettingsForm({ ...settingsForm, bannerText: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="showBannerCheck"
                checked={settingsForm.showBanner}
                onChange={e => setSettingsForm({ ...settingsForm, showBanner: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="showBannerCheck" style={{ margin: 0, cursor: 'pointer' }}>
                Show Top Announcement Banner
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Save size={18} />
              <span>Save Settings</span>
            </button>
          </form>
        </div>

        {/* Backup & Restore Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Export JSON */}
          <div style={{
            background: '#0F233D',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.75rem'
          }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
              Export CMS Data Backup
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Download a complete JSON snapshot of all products, inquiries, and page content for off-site backup.
            </p>
            <button onClick={exportDataJSON} className="btn btn-primary" style={{ width: '100%', gap: '8px' }}>
              <Download size={18} />
              <span>Export JSON Backup File</span>
            </button>
          </div>

          {/* Import JSON */}
          <div style={{
            background: '#0F233D',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.75rem'
          }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
              Import CMS Data Backup
            </h4>
            <form onSubmit={handleImport} className="dark-form">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Paste backup JSON string here..."
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
                style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}
              />
              <button type="submit" className="btn btn-outline" style={{ width: '100%', color: '#FFF', gap: '8px' }}>
                <Upload size={18} />
                <span>Import JSON Configuration</span>
              </button>
            </form>
          </div>

          {/* Factory Reset */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem', color: '#EF4444' }}>
              <ShieldAlert size={18} />
              <strong style={{ fontSize: '0.95rem' }}>Danger Zone</strong>
            </div>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Reset all CMS state back to original factory initial dataset.
            </p>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all CMS content to factory defaults?")) {
                  resetToFactoryDefaults();
                }
              }}
              className="btn btn-sm" 
              style={{ background: '#EF4444', color: '#FFF', width: '100%', gap: '6px' }}
            >
              <RotateCcw size={14} />
              <span>Reset to Factory Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
