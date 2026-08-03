import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { OrbitRing } from '../components/OrbitRing';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { LubricantFinder } from '../components/LubricantFinder';
import { 
  ShieldCheck, Cpu, Flame, Truck, Wrench, ArrowRight, 
  Sparkles, Award, Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const Home = ({ setActivePage, setSelectedProductForInquiry }) => {
  const { data } = useCms();
  const { hero, whyUs, products, standards } = data;
  const [selectedProduct, setSelectedProduct] = useState(null);

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8 text-blue-600" />;
      case 'Cpu': return <Cpu className="w-8 h-8 text-blue-600" />;
      case 'Flame': return <Flame className="w-8 h-8 text-blue-600" />;
      case 'Truck': return <Truck className="w-8 h-8 text-blue-600" />;
      default: return <Wrench className="w-8 h-8 text-blue-600" />;
    }
  };

  const handleInquireFromModal = (prod) => {
    if (setSelectedProductForInquiry) {
      setSelectedProductForInquiry(prod.name);
    }
    setActivePage('contact');
  };

  return (
    <div>
      {/* ==================== HERO SECTION ==================== */}
      <section style={{
        background: 'radial-gradient(120% 100% at 85% 15%, #0F3560 0%, #0A2540 50%, #051526 100%)',
        color: '#FFFFFF',
        paddingTop: '6.5rem',
        paddingBottom: '5.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Grid Accent */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          pointerEvents: 'none',
          backgroundImage: `
            repeating-linear-gradient(115deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 90px),
            repeating-linear-gradient(25deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 90px)
          `
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Hero Text */}
            <div>
              <span className="eyebrow on-dark">
                <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
                PREMIUM LUBRICANTS INDUSTRY
              </span>

              <h1 style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>
                {hero.title || "Power in Every Drop"}
              </h1>

              <p style={{
                color: 'rgba(255, 255, 255, 0.78)',
                fontSize: '1.12rem',
                lineHeight: 1.6,
                marginBottom: '2.25rem',
                maxWidth: '540px'
              }}>
                {hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <button onClick={() => setActivePage('products')} className="btn btn-primary btn-lg">
                  <span>{hero.ctaPrimary || "Explore Products"}</span>
                  <ArrowRight size={18} />
                </button>
                <button onClick={() => setActivePage('contact')} className="btn btn-ghost-dark btn-lg">
                  <span>{hero.ctaSecondary || "Become a Distributor"}</span>
                </button>
              </div>

              {/* Statistics Strip */}
              <div style={{
                display: 'flex',
                gap: '2.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--orange)' }}>
                    {hero.stat1?.number || "50+"}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    {hero.stat1?.label || "Formulated Oils"}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: '#FFFFFF' }}>
                    {hero.stat2?.number || "100%"}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    {hero.stat2?.label || "API & ISO Certified"}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--orange)' }}>
                    {hero.stat3?.number || "250+"}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    {hero.stat3?.label || "Dealer Outlets"}
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Orbit Drop Visual */}
            <div>
              <OrbitRing />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRUST STRIP ==================== */}
      <div style={{
        background: '#051526',
        padding: '1.1rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#94A3B8',
        fontSize: '0.82rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <span>✦ API SP / CK-4 FORMULATIONS</span>
          <span>✦ 100% VIRGIN BASE STOCK</span>
          <span>✦ ISO 9001:2015 CERTIFIED</span>
          <span>✦ EXTREME TROPICAL THERMAL STABILITY</span>
        </div>
      </div>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">THE ORBIT ADVANTAGE</span>
            <h2>Why Industrial & Automotive Leaders Choose Orbit</h2>
            <p>Engineered with zero compromises on chemical purity, extreme pressure performance, and thermal endurance.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {whyUs.map((item) => (
              <div key={item.id} className="glass-card" style={{ padding: '1.75rem 1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(0, 90, 171, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--blue)'
                }}>
                  {getIcon(item.icon)}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--steel)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span className="eyebrow">ENGINEERED FOR EXCELLENCE</span>
              <h2>Featured Product Portfolio</h2>
            </div>
            <button onClick={() => setActivePage('products')} className="btn btn-outline" style={{ gap: '6px' }}>
              <span>View Full Catalog ({products.length})</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LUBRICANT FINDER WIZARD ==================== */}
      <section className="section" style={{ background: '#F1F5F9' }}>
        <div className="container">
          <LubricantFinder onSelectProduct={(p) => setSelectedProduct(p)} />
        </div>
      </section>

      {/* ==================== STANDARDS & CERTIFICATIONS ==================== */}
      <section className="section" style={{
        background: 'linear-gradient(160deg, #0A2540 0%, #051526 100%)',
        color: '#FFFFFF'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <span className="eyebrow on-dark">INTERNATIONAL COMPLIANCE</span>
              <h2 style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Formulated & Tested to Global Benchmarks
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Our in-house R&D laboratory performs rigorous kinematic viscosity, pour point, total base number (TBN), and 4-ball wear test protocols on every batch before bottling.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {standards.map((std, idx) => (
                  <div key={idx} style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--orange)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 600 }}>
                      {std.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Seal Box */}
            <div className="glass-card-dark" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F7941D 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 30px rgba(247, 148, 29, 0.5)'
              }}>
                <Award size={40} color="#FFFFFF" />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                100% Quality Assurance
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.94rem' }}>
                Every barrel and bottle of Orbit Lubricant comes backed with full batch traceability and lab analysis certification for commercial transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="section" style={{ background: '#F8FAFC', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <span className="eyebrow">PARTNERSHIP OPPORTUNITIES</span>
          <h2>Grow Your Lubricant Business with Orbit</h2>
          <p style={{ margin: '1.25rem 0 2rem', fontSize: '1.08rem' }}>
            We offer attractive dealership margins, point-of-sale branding support, and direct technical backing for workshops, fleets, and industrial users.
          </p>
          <button onClick={() => setActivePage('contact')} className="btn btn-primary btn-lg">
            <span>Apply for Dealership & Partnership</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onInquire={handleInquireFromModal}
        />
      )}
    </div>
  );
};
