import React from 'react';
import { useCms } from '../context/CmsContext';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, Factory, Flame } from 'lucide-react';

export const About = () => {
  const { data } = useCms();
  const { about, standards } = data;

  return (
    <div>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #051526 100%)',
        color: '#FFFFFF',
        padding: '5.5rem 0 4.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <span className="eyebrow on-dark">ABOUT ORBIT LUBRICANTS</span>
          <h1 style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>
            {about.heroTitle || "Protecting Engines. Powering Industry."}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: '1.12rem', lineHeight: 1.6 }}>
            {about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">OUR HERITAGE & QUALITY</span>
            <h2>Driven by Precision Tribology</h2>
          </div>

          <div style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--steel)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <p>{about.story}</p>
            <p>
              Our technical team continuously works on research and product development to deliver lubricants that perform efficiently in Bangladesh's climate and road conditions as well as international operating environments.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Mission Card */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(247, 148, 29, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'var(--orange-deep)'
              }}>
                <Target size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--steel)', lineHeight: 1.65, fontSize: '0.98rem' }}>
                {about.mission}
              </p>
            </div>

            {/* Vision Card */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(0, 90, 171, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'var(--blue)'
              }}>
                <Eye size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
                Our Vision
              </h3>
              <p style={{ color: 'var(--steel)', lineHeight: 1.65, fontSize: '0.98rem' }}>
                {about.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {about.values && (
        <section className="section">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">GUIDING PRINCIPLES</span>
              <h2>Our Core Commitments</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {about.values.map((v, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '0.6rem', fontFamily: 'var(--font-display)' }}>
                    {v.title}
                  </h4>
                  <p style={{ color: 'var(--steel)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
