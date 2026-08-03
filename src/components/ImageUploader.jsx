import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({ value, onChange, label = "Upload Image" }) => {
  const [tab, setTab] = useState('drag'); // 'drag' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#94A3B8' }}>
        {label}
      </label>

      {/* Preview if image is present */}
      {value ? (
        <div style={{
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0A192F',
          padding: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <img 
            src={value} 
            alt="Preview" 
            style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '6px', background: '#FFFFFF', padding: '4px' }} 
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 600 }}>Image Selected</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {value.startsWith('data:') ? 'Local Drag & Drop Image (Base64)' : value}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer'
            }}
            title="Remove Image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div style={{
          background: '#0A192F',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          padding: '1rem'
        }}>
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setTab('drag')}
              style={{
                background: tab === 'drag' ? 'var(--orange)' : 'transparent',
                color: tab === 'drag' ? '#FFF' : '#94A3B8',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <UploadCloud size={14} />
              <span>Drag & Drop File</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('url')}
              style={{
                background: tab === 'url' ? 'var(--orange)' : 'transparent',
                color: tab === 'url' ? '#FFF' : '#94A3B8',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <LinkIcon size={14} />
              <span>Paste Image URL</span>
            </button>
          </div>

          {/* Drag & Drop Zone */}
          {tab === 'drag' ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? 'var(--orange)' : 'rgba(255, 255, 255, 0.2)'}`,
                background: isDragging ? 'rgba(247, 148, 29, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => document.getElementById('fileInputCustom').click()}
            >
              <UploadCloud size={32} style={{ color: 'var(--orange)', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.88rem', color: '#F8FAFC', fontWeight: 600 }}>
                Drag & Drop Image Here or Click to Browse
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                Supports PNG, JPG, WEBP, SVG
              </div>
              <input
                id="fileInputCustom"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            /* URL Paste Input */
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/logo.png"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="btn btn-primary btn-sm"
              >
                Apply URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
