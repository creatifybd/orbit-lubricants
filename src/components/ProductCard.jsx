import React from 'react';
import { ShieldCheck, ChevronRight, Award, Layers } from 'lucide-react';

export const ProductCard = ({ product, onSelect }) => {
  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Color Accent Header */}
      <div style={{
        height: '140px',
        background: `linear-gradient(135deg, ${product.imageColor || '#005AAB'} 0%, #0A2540 100%)`,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {product.badge && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              {product.badge}
            </span>
          )}

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#F7941D',
            background: 'rgba(5, 21, 38, 0.6)',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px'
          }}>
            {product.viscosity}
          </span>
        </div>

        {/* 3D Rendered Oil Can Visual */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            <svg width="24" height="24" viewBox="0 0 100 100">
              <path d="M50 15 L75 40 L75 85 L25 85 L25 40 Z" fill={product.imageColor || '#005AAB'} />
              <circle cx="50" cy="60" r="12" fill="#F7941D" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Grade Standard
            </div>
            <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
              {product.apiGrade}
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontFamily: 'var(--font-display)',
          marginBottom: '0.6rem',
          color: 'var(--navy)'
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--steel)',
          marginBottom: '1.25rem',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--steel)', fontFamily: 'var(--font-mono)' }}>
            Pack: {product.packing}
          </div>

          <button
            onClick={() => onSelect(product)}
            className="btn btn-sm btn-outline"
            style={{ gap: '4px' }}
          >
            <span>Details</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
