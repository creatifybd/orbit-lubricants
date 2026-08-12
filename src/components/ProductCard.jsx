import React, { useState } from 'react';
import { ChevronRight, Shield, Zap, ArrowUpRight, MessageSquare } from 'lucide-react';

export const ProductCard = ({ product, onSelect, onInquire }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const accentColor = product.imageColor || '#ED1B34';

  // Parse spec tags from apiGrade (e.g. "API SP / ACEA A3" → ["API SP", "ACEA A3"])
  const specTags = product.apiGrade
    ? product.apiGrade.split(/\s*[\/,]\s*/).map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="product-card-advanced"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(product)}
    >
      {/* ── IMAGE STAGE ── */}
      <div className="product-stage-advanced">
        {/* Ambient radial glow */}
        <div
          className="product-ambient-glow"
          style={{ background: `radial-gradient(circle at 50% 60%, ${accentColor}33 0%, transparent 68%)` }}
        />

        {/* Subtle grid texture */}
        <div className="product-stage-grid" />

        {/* Canister Image */}
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className="product-canister-img"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transform: hovered ? 'translateY(-10px) scale(1.07)' : 'translateY(0) scale(1)',
              filter: hovered
                ? `drop-shadow(0 22px 36px ${accentColor}55) drop-shadow(0 6px 14px rgba(0,0,0,0.3))`
                : 'drop-shadow(0 14px 26px rgba(34, 31, 31, 0.22))',
            }}
          />
        ) : (
          /* Fallback SVG Canister */
          <svg viewBox="0 0 120 200" width="110" height="185" className="product-canister-img"
            style={{
              transform: hovered ? 'translateY(-10px) scale(1.07)' : 'translateY(0) scale(1)',
              filter: hovered ? `drop-shadow(0 22px 36px ${accentColor}55)` : 'drop-shadow(0 12px 28px rgba(34,31,31,0.2))',
            }}>
            <rect x="25" y="15" width="70" height="170" rx="10" fill={accentColor} />
            <rect x="30" y="20" width="60" height="30" rx="6" fill="rgba(255,255,255,0.18)" />
            <rect x="32" y="55" width="56" height="90" rx="4" fill="rgba(255,255,255,0.95)" />
            <text x="60" y="82" textAnchor="middle" fontSize="8" fontWeight="800" fill={accentColor} fontFamily="sans-serif">ORBIT</text>
            <text x="60" y="95" textAnchor="middle" fontSize="6" fill="#333" fontFamily="sans-serif">{product.viscosity}</text>
            <text x="60" y="108" textAnchor="middle" fontSize="5" fill="#666" fontFamily="sans-serif">{product.apiGrade}</text>
            <rect x="30" y="155" width="60" height="20" rx="4" fill="rgba(255,255,255,0.18)" />
            <rect x="40" y="8" width="40" height="10" rx="4" fill={accentColor} />
          </svg>
        )}

        {/* Viscosity Pill — top right */}
        <span className="product-viscosity-badge" style={{ background: accentColor }}>
          {product.viscosity}
        </span>

        {/* Category Pill — top left */}
        {product.badge && (
          <span className="product-category-badge">
            {product.badge}
          </span>
        )}

        {/* Bottom shimmer line */}
        <div className="product-stage-shimmer" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}99, transparent)` }} />
      </div>

      {/* ── CARD CONTENT ── */}
      <div className="product-card-body">

        {/* Spec tags row */}
        {specTags.length > 0 && (
          <div className="product-spec-tags">
            {specTags.map((tag, i) => (
              <span key={i} className="product-spec-chip">
                <Shield size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Product Title */}
        <h3 className="product-card-title">{product.name}</h3>

        {/* Description */}
        <p className="product-card-desc">{product.description}</p>

        {/* Bottom CTA Row */}
        <div className="product-card-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} color="#ED1B34" />
            <span style={{ fontSize: '0.78rem', color: '#221F1F', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {product.packing}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Inquire quick button */}
            {onInquire && (
              <button
                className="product-inquire-btn"
                onClick={e => { e.stopPropagation(); onInquire(product); }}
                title="Quick Inquiry"
              >
                <MessageSquare size={14} />
              </button>
            )}

            {/* Primary CTA */}
            <div className="dc-btn" style={{ height: '34px', minWidth: '88px' }}>
              <button onClick={e => { e.stopPropagation(); onSelect(product); }} style={{ padding: '0 13px', fontSize: '12px' }}>
                <span>Specs <ChevronRight size={12} /></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top red accent border (on hover, via CSS) */}
      <div className="product-card-top-border" style={{ background: accentColor }} />
    </div>
  );
};
