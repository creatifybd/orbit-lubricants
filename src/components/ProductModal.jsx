import React from 'react';
import { X, ShieldCheck, CheckCircle2, Package, Cpu, ArrowRight } from 'lucide-react';

export const ProductModal = ({ product, onClose, onInquire }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()}
        style={{ padding: 0, overflow: 'hidden' }}
      >
        {/* Header Header */}
        <div style={{
          background: `linear-gradient(135deg, ${product.imageColor || '#005AAB'} 0%, #0A2540 100%)`,
          padding: '2rem',
          color: '#FFFFFF',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(0,0,0,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            {product.badge && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF'
              }}>
                {product.badge}
              </span>
            )}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#F7941D',
              background: 'rgba(5, 21, 38, 0.7)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px'
            }}>
              Viscosity: {product.viscosity}
            </span>
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h2>

          <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
            Standard: {product.apiGrade}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem' }}>
          <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '0.6rem', color: 'var(--navy)' }}>
            Product Overview
          </h4>
          <p style={{ color: 'var(--steel)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {product.description}
          </p>

          {/* Specifications Table */}
          {product.specs && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '0.75rem', color: 'var(--navy)' }}>
                Technical Data Sheet (TDS Specs)
              </h4>
              <div style={{
                background: 'var(--mist)',
                borderRadius: '10px',
                border: '1px solid var(--line)',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={idx} style={{ borderBottom: idx < Object.keys(product.specs).length - 1 ? '1px solid var(--line)' : 'none' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--navy)', width: '40%' }}>
                          {key}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--steel)', fontFamily: 'var(--font-mono)' }}>
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Packaging Sizes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '1rem', background: '#F1F5F9', borderRadius: '10px' }}>
            <Package style={{ color: 'var(--orange-deep)' }} />
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>Available Packaging: </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--steel)', fontFamily: 'var(--font-mono)' }}>{product.packing}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button onClick={onClose} className="btn btn-outline">
              Close
            </button>
            <button 
              onClick={() => {
                onClose();
                onInquire(product);
              }} 
              className="btn btn-primary"
            >
              <span>Request Bulk Quotation</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
