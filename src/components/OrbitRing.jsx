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
          boxShadow: '0 0 30px rgba(0, 90, 171, 0.25)'
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

      {/* Primary Orbiting Droplet with Counter-Rotation to keep drop strictly upright */}
      <div
        className="animate-spin-slow"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Counter-rotation matches spinSlow 20s exactly so orientation remains upright all 360 degrees */}
          <div style={{
            animation: 'spinReverse 20s linear infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg
              viewBox="0 0 24 32"
              width="26"
              height="32"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(247, 147, 30, 0.95)) drop-shadow(0 0 22px rgba(247, 147, 30, 0.65))',
                overflow: 'visible'
              }}
            >
              <defs>
                <linearGradient id="orbitDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFAE34" />
                  <stop offset="45%" stopColor="#F7931E" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
              {/* Teardrop path pointing upright */}
              <path
                d="M12 2 C12 2, 2.5 14, 2.5 20.5 C2.5 25.7 6.8 30 12 30 C17.2 30 21.5 25.7 21.5 20.5 C21.5 14, 12 2, 12 2 Z"
                fill="url(#orbitDropGrad)"
              />
              {/* Glossy light reflection */}
              <ellipse
                cx="8"
                cy="18"
                rx="2.2"
                ry="4.5"
                transform="rotate(-25 8 18)"
                fill="rgba(255,255,255,0.6)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Secondary Orbiting Blue Particle */}
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

      {/* Center 3D Circle with Special Dark-Background Logo */}
      <div
        className="animate-float"
        style={{
          width: '58%',
          height: '58%',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #0D325E 0%, #051526 100%)',
          border: '2px solid rgba(255, 255, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), inset 0 0 25px rgba(0, 90, 171, 0.5)',
          position: 'relative',
          zIndex: 2,
          padding: '1.2rem'
        }}
      >
        <img
          src="/logo-dark-bg.png"
          alt="Orbit Lubricants"
          style={{
            maxWidth: '85%',
            maxHeight: '85%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
};
