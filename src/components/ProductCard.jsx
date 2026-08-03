import React, { useState } from 'react';
import { ChevronRight, Shield, Zap } from 'lucide-react';

export const ProductCard = ({ product, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => onSelect(product)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#FFFFFF',
        boxShadow: '0 2px 16px rgba(10, 37, 64, 0.10)',
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        border: '1px solid rgba(10, 37, 64, 0.08)',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(10, 37, 64, 0.18)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(10, 37, 64, 0.10)';
      }}
    >
      {/* ── Product Image Area ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '260px',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow behind product */}
        <div style={{
          position: 'absolute',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${(product.imageColor || '#005AAB')}22 0%, transparent 70%)`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              height: '220px',
              width: 'auto',
              maxWidth: '85%',
              objectFit: 'contain',
              objectPosition: 'center',
              filter: 'drop-shadow(0 12px 28px rgba(10, 37, 64, 0.22))',
              transition: 'transform 0.3s ease',
              opacity: imgLoaded ? 1 : 0,
              position: 'relative',
              zIndex: 1,
            }}
          />
        ) : (
          /* Fallback canister illustration */
          <svg viewBox="0 0 120 200" width="110" height="185" style={{ filter: 'drop-shadow(0 12px 28px rgba(10,37,64,0.18))' }}>
            <rect x="25" y="15" width="70" height="170" rx="10" fill={product.imageColor || '#005AAB'} />
            <rect x="30" y="20" width="60" height="30" rx="6" fill="rgba(255,255,255,0.15)" />
            <rect x="32" y="55" width="56" height="90" rx="4" fill="rgba(255,255,255,0.92)" />
            <text x="60" y="82" textAnchor="middle" fontSize="8" fontWeight="800" fill={product.imageColor || '#005AAB'} fontFamily="sans-serif">ORBIT</text>
            <text x="60" y="95" textAnchor="middle" fontSize="6" fill="#333" fontFamily="sans-serif">{product.viscosity}</text>
            <text x="60" y="108" textAnchor="middle" fontSize="5" fill="#666" fontFamily="sans-serif">{product.apiGrade}</text>
            <rect x="30" y="155" width="60" height="20" rx="4" fill="rgba(255,255,255,0.15)" />
            <rect x="40" y="8" width="40" height="10" rx="4" fill={product.imageColor || '#005AAB'} />
          </svg>
        )}

        {/* Viscosity badge — top right */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#FFFFFF',
          background: product.imageColor || '#005AAB',
          padding: '4px 10px',
          borderRadius: '999px',
          letterSpacing: '0.04em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 2,
        }}>
          {product.viscosity}
        </span>

        {/* Category badge — top left */}
        {product.badge && (
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 600,
            color: product.imageColor || '#005AAB',
            background: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '999px',
            border: `1.5px solid ${product.imageColor || '#005AAB'}33`,
            letterSpacing: '0.03em',
            zIndex: 2,
          }}>
            {product.badge}
          </span>
        )}
      </div>

      {/* ── Card Content ── */}
      <div style={{ padding: '1.4rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* API/JASO grade pill */}
        <div style={{ marginBottom: '0.65rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: product.imageColor || '#005AAB',
            background: `${product.imageColor || '#005AAB'}12`,
            padding: '3px 10px',
            borderRadius: '999px',
            letterSpacing: '0.05em',
          }}>
            <Shield size={10} />
            {product.apiGrade}
          </span>
        </div>

        <h3 style={{
          fontSize: '1.05rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          marginBottom: '0.55rem',
          color: '#0A2540',
          lineHeight: 1.3,
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: '#64748B',
          marginBottom: '1.1rem',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* Bottom row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.9rem',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} color={product.imageColor || '#005AAB'} />
            <span style={{ fontSize: '0.78rem', color: '#475569', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              {product.packing}
            </span>
          </div>

          <button
            onClick={e => { e.stopPropagation(); onSelect(product); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              background: product.imageColor || '#005AAB',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '999px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            View Details <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
