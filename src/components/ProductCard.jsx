import React, { useState } from 'react';
import { ChevronRight, Shield, Zap, Award } from 'lucide-react';

export const ProductCard = ({ product, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => onSelect(product)}
      className="glass-card-premium"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#FFFFFF',
        cursor: 'pointer',
        border: '1px solid #DEDEDE',
        position: 'relative',
      }}
    >
      {/* ── Product Image Area ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #F9F9F9 0%, #E1E4E6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '270px',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow behind product */}
        <div style={{
          position: 'absolute',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${(product.imageColor || '#ED1B34')}22 0%, transparent 70%)`,
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
              height: '230px',
              width: 'auto',
              maxWidth: '85%',
              objectFit: 'contain',
              objectPosition: 'center',
              filter: 'drop-shadow(0 14px 28px rgba(34, 31, 31, 0.25))',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.74, 0.22, 0.99)',
              opacity: imgLoaded ? 1 : 0,
              position: 'relative',
              zIndex: 1,
            }}
          />
        ) : (
          /* Fallback canister illustration */
          <svg viewBox="0 0 120 200" width="110" height="185" style={{ filter: 'drop-shadow(0 12px 28px rgba(34,31,31,0.2))' }}>
            <rect x="25" y="15" width="70" height="170" rx="10" fill={product.imageColor || '#ED1B34'} />
            <rect x="30" y="20" width="60" height="30" rx="6" fill="rgba(255,255,255,0.18)" />
            <rect x="32" y="55" width="56" height="90" rx="4" fill="rgba(255,255,255,0.95)" />
            <text x="60" y="82" textAnchor="middle" fontSize="8" fontWeight="800" fill={product.imageColor || '#ED1B34'} fontFamily="sans-serif">ORBIT</text>
            <text x="60" y="95" textAnchor="middle" fontSize="6" fill="#333" fontFamily="sans-serif">{product.viscosity}</text>
            <text x="60" y="108" textAnchor="middle" fontSize="5" fill="#666" fontFamily="sans-serif">{product.apiGrade}</text>
            <rect x="30" y="155" width="60" height="20" rx="4" fill="rgba(255,255,255,0.18)" />
            <rect x="40" y="8" width="40" height="10" rx="4" fill={product.imageColor || '#ED1B34'} />
          </svg>
        )}

        {/* Viscosity badge — top right */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#FFFFFF',
          background: product.imageColor || '#ED1B34',
          padding: '4px 12px',
          borderRadius: '19px',
          letterSpacing: '0.04em',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
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
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#221F1F',
            background: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '19px',
            border: '1px solid #DEDEDE',
            letterSpacing: '0.03em',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
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
            gap: '5px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#ED1B34',
            background: 'rgba(237, 27, 52, 0.08)',
            padding: '3px 10px',
            borderRadius: '12px',
            letterSpacing: '0.04em',
          }}>
            <Shield size={11} />
            {product.apiGrade}
          </span>
        </div>

        <h3 style={{
          fontSize: '1.1rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          marginBottom: '0.55rem',
          color: '#221F1F',
          lineHeight: 1.3,
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: '#475569',
          marginBottom: '1.1rem',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* Bottom Action Row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.9rem',
          borderTop: '1px solid #DEDEDE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} color="#ED1B34" />
            <span style={{ fontSize: '0.78rem', color: '#221F1F', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {product.packing}
            </span>
          </div>

          <div className="dc-btn" style={{ height: '34px', minWidth: '95px' }}>
            <button onClick={e => { e.stopPropagation(); onSelect(product); }} style={{ padding: '0 14px', fontSize: '12px' }}>
              <span>Specs <ChevronRight size={12} /></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

