import React from 'react';
import { useCms } from '../context/CmsContext';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, Factory, Flame, PackageCheck, Layers, Users, Sparkles } from 'lucide-react';

export const About = () => {
  const { data } = useCms();
  const { about, productRangeList, whyUs } = data || {};

  return (
    <div>
      {/* ── Hero Header ── */}
      <section style={{
        background: 'radial-gradient(120% 100% at 85% 15%, #0F3560 0%, #0A2540 50%, #051526 100%)',
        color: '#FFFFFF',
        padding: '5.5rem 0 4.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px', position: 'relative', zIndex: 2 }}>
          <span className="eyebrow on-dark fade-in-up">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
            ORBIT LUBRICANT INDUSTRIES
          </span>
          <h1 className="fade-in-up delay-100" style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>
            {about?.heroTitle || "Driving Performance Through Advanced Lubrication Technology"}
          </h1>
          <p className="fade-in-up delay-200" style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '1.12rem', lineHeight: 1.65 }}>
            {about?.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── Company Overview Story ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">COMPANY OVERVIEW</span>
            <h2>Protecting Engines, Powering the Future</h2>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', lineHeight: 1.85, fontSize: '1.02rem', color: 'var(--steel)' }}>
            <p style={{ marginBottom: '1.25rem' }}>
              {about?.story}
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="grid-responsive-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {/* Mission Card */}
            <div className="glass-card fade-in-up" style={{ padding: '2.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(247, 148, 29, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'var(--orange-deep)'
              }}>
                <Target size={30} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--steel)', lineHeight: 1.7, fontSize: '0.98rem' }}>
                {about?.mission}
              </p>
            </div>

            {/* Vision Card */}
            <div className="glass-card fade-in-up delay-100" style={{ padding: '2.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(0, 90, 171, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'var(--blue)'
              }}>
                <Eye size={30} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
                Our Vision
              </h3>
              <p style={{ color: 'var(--steel)', lineHeight: 1.7, fontSize: '0.98rem' }}>
                {about?.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Orbit Lubricant Industries (10 Points) ── */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">UNMATCHED ADVANTAGE</span>
            <h2>Why Choose Orbit Lubricant Industries</h2>
            <p>Formulated to deliver peak performance, reliability, and maximum thermal stability.</p>
          </div>

          <div className="grid-responsive-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {(whyUs || []).map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 90, 171, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--blue)',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.02rem', marginBottom: '0.3rem', color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--steel)', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Complete Product Range ── */}
      {productRangeList && (
        <section className="section" style={{ background: '#0A2540', color: '#FFFFFF' }}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow on-dark">PORTFOLIO COVERAGE</span>
              <h2 style={{ color: '#FFFFFF' }}>Our Complete Product Range</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)' }}>We produce a comprehensive range of automotive, motorcycle, industrial, and specialty fluids.</p>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              justifyContent: 'center',
              maxWidth: '960px',
              margin: '0 auto'
            }}>
              {productRangeList.map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem 1.4rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <PackageCheck size={16} style={{ color: '#F7941D' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Quality Commitment & Partnership ── */}
      <section className="section">
        <div className="container">
          <div className="grid-responsive-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {/* Quality Commitment */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(0, 90, 171, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem', color: 'var(--blue)'
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
                Quality Commitment
              </h3>
              <p style={{ color: 'var(--steel)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {about?.qualityCommitment}
              </p>
            </div>

            {/* Our Commitment */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(247, 148, 29, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem', color: 'var(--orange-deep)'
              }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
                Partner Commitment
              </h3>
              <p style={{ color: 'var(--steel)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {about?.ourCommitment}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
