import React, { useEffect } from 'react';
import { X, Package, ArrowRight, Shield } from 'lucide-react';

export const ProductModal = ({ product, onClose, onInquire }) => {
  if (!product) return null;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ padding: 0, overflow: 'hidden' }}
      >
        {/* Drag handle (mobile UX) */}
        <div style={{
          width: '40px', height: '4px', borderRadius: '2px',
          background: 'rgba(0,0,0,0.15)', margin: '10px auto 0',
        }} className="mobile-drag-handle" />

        {/* Header with image */}
        <div style={{
          background: `linear-gradient(135deg, ${product.imageColor || '#005AAB'} 0%, #0A2540 100%)`,
          padding: '1.5rem 1.5rem 1.25rem',
          color: '#FFFFFF',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%',
              width: '38px', height: '38px', color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {product.badge && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600,
                padding: '0.3rem 0.7rem', borderRadius: '999px',
                background: 'rgba(255,255,255,0.2)', color: '#FFFFFF',
              }}>
                {product.badge}
              </span>
            )}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
              color: '#F7941D', background: 'rgba(5,21,38,0.7)',
              padding: '0.3rem 0.7rem', borderRadius: '6px',
            }}>
              {product.viscosity}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {product.image && (
              <div style={{
                flexShrink: 0,
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '88px', height: '88px',
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                color: '#FFFFFF', fontSize: 'clamp(1.1rem, 4vw, 1.65rem)',
                marginBottom: '0.35rem', fontFamily: 'var(--font-display)', lineHeight: 1.2,
              }}>
                {product.name}
              </h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)',
                background: 'rgba(255,255,255,0.12)', padding: '4px 10px',
                borderRadius: '999px',
              }}>
                <Shield size={12} />
                {product.apiGrade}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem', color: 'var(--navy)' }}>
            Product Overview
          </h4>
          <p style={{ color: 'var(--steel)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Specs Table */}
          {product.specs && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', marginBottom: '0.65rem', color: 'var(--navy)' }}>
                Technical Data Sheet
              </h4>
              <div style={{ background: 'var(--mist)', borderRadius: '10px', border: '1px solid var(--line)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={idx} style={{ borderBottom: idx < Object.keys(product.specs).length - 1 ? '1px solid var(--line)' : 'none' }}>
                        <td style={{ padding: '0.7rem 0.9rem', fontWeight: 600, color: 'var(--navy)', width: '42%', fontSize: '0.82rem' }}>
                          {key}
                        </td>
                        <td style={{ padding: '0.7rem 0.9rem', color: 'var(--steel)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Packaging */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem',
            padding: '0.85rem 1rem', background: '#F1F5F9', borderRadius: '10px',
          }}>
            <Package style={{ color: 'var(--orange-deep)', flexShrink: 0 }} size={18} />
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)' }}>Available Packaging: </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--steel)', fontFamily: 'var(--font-mono)' }}>{product.packing}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
            <button
              onClick={() => { onClose(); onInquire(product); }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }}
            >
              <span>Request Bulk Quotation</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 869px) {
          .modal-drag-handle { display: none; }
          .modal-card .btn { flex-direction: row; width: auto !important; }
          .modal-card > div:last-child > div:last-child {
            flex-direction: row !important;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};
