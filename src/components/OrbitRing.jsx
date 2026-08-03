import React from 'react';
import { useCms } from '../context/CmsContext';

export const OrbitRing = () => {
  const { data } = useCms();
  const { settings } = data || {};

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
          background: 'radial-gradient(circle, rgba(247, 148, 29, 0.45) 0%, rgba(0, 90, 171, 0.3) 45%, transparent 70%)',
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
          border: '2px dashed rgba(255, 255, 255, 0.28)',
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
          border: '1.5px stroke rgba(247, 148, 29, 0.5)',
          boxShadow: 'inset 0 0 35px rgba(0, 90, 171, 0.45)'
        }}
      />

      {/* Primary Orbiting Droplet (Orange) */}
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

      {/* Secondary Orbiting Particle (Blue) */}
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

      {/* Center Circle with Official Orbit Logo */}
      <div
        className="animate-float"
        style={{
          width: '58%',
          height: '58%',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)',
          border: '3px solid rgba(247, 148, 29, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(247, 148, 29, 0.35)',
          position: 'relative',
          zIndex: 2,
          padding: '1.2rem'
        }}
      >
        <img
          src={settings?.logoUrl || '/logo.png'}
          alt="Orbit Lubricants Official Logo"
          style={{
            maxWidth: '85%',
            maxHeight: '85%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 6px 12px rgba(10, 37, 64, 0.15))'
          }}
        />
      </div>
    </div>
  );
};
