import React from 'react';

export const OrbitRing = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '440px',
      aspectRatio: '1 / 1',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Outer Radial Glow */}
      <div
        className="animate-pulse-glow"
        style={{
          position: 'absolute',
          inset: '-15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247, 148, 29, 0.4) 0%, rgba(0, 90, 171, 0.3) 45%, transparent 70%)',
          filter: 'blur(24px)',
          pointerEvents: 'none'
        }}
      />

      {/* Orbit Ring Outer */}
      <div
        className="animate-spin-slow"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px dashed rgba(255, 255, 255, 0.25)',
          boxShadow: '0 0 30px rgba(0, 90, 171, 0.2)'
        }}
      />

      {/* Orbit Ring Inner */}
      <div
        className="animate-spin-reverse"
        style={{
          position: 'absolute',
          inset: '12%',
          borderRadius: '50%',
          border: '1.5px stroke rgba(247, 148, 29, 0.45)',
          boxShadow: 'inset 0 0 35px rgba(0, 90, 171, 0.45)'
        }}
      />

      {/* Primary Orbiting Droplet */}
      <div
        className="animate-spin-slow"
        style={{
          position: 'absolute',
          inset: 0
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '24px',
          borderRadius: '70% 70% 70% 5%',
          background: 'linear-gradient(135deg, #F7941D 0%, #D97706 100%)',
          boxShadow: '0 0 24px 6px rgba(247, 148, 29, 0.85)'
        }} />
      </div>

      {/* Secondary Orbiting Blue Accent Particle */}
      <div
        className="animate-spin-reverse"
        style={{
          position: 'absolute',
          inset: '12%'
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #60A5FA 0%, #005AAB 100%)',
          boxShadow: '0 0 18px 4px rgba(0, 90, 171, 0.85)'
        }} />
      </div>

      {/* Center 3D Drop Logo Card */}
      <div
        className="animate-float"
        style={{
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #0D325E 0%, #051526 100%)',
          border: '2px solid rgba(255, 255, 255, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), inset 0 0 25px rgba(0, 90, 171, 0.5)',
          position: 'relative',
          zIndex: 2,
          padding: '1.5rem'
        }}
      >
        {/* Large SVG Liquid Drop */}
        <svg width="72" height="72" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 8px 18px rgba(247,148,29,0.6))' }}>
          <path d="M50 12 C50 12 22 52 22 70 A28 28 0 0 0 78 70 C78 52 50 12 50 12 Z" fill="url(#dropGrad)" />
          <path d="M42 35 C42 35 30 58 30 68 A16 16 0 0 0 45 74 C36 70 36 55 42 35 Z" fill="rgba(255,255,255,0.4)" />
          <defs>
            <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7941D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#FFFFFF',
          letterSpacing: '0.08em',
          marginTop: '6px'
        }}>
          ORBIT
        </div>
      </div>
    </div>
  );
};
