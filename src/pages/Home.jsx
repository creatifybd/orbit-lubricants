import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { OrbitRing } from '../components/OrbitRing';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { LubricantFinder } from '../components/LubricantFinder';
import { 
  ShieldCheck, Cpu, Flame, Truck, Wrench, ArrowRight, 
  Sparkles, Award, Layers, CheckCircle2, ChevronRight, Plus, ChevronDown, ChevronUp 
} from 'lucide-react';

export const Home = ({ setActivePage, setSelectedProductForInquiry }) => {
  const { data } = useCms();
  const { hero, whyUs, products, standards } = data;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState('car');

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  const productCategories = [
    {
      id: 'car',
      title: 'Car Engine Oils',
      desc: 'Delivers outstanding performance and maximum engine protection under extreme tropical and high-heat driving conditions.',
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'bike',
      title: 'Motorcycle Engine Oils (4T)',
      desc: 'Engineered with JASO MA2 synthetic technology for high-revving 4T motorcycle engines and wet-clutch acceleration.',
      img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'truck',
      title: 'Bus & Truck Heavy Duty Oils',
      desc: 'Heavy-duty formulated diesel engine oils designed for long drain intervals, extended engine life, and commercial fleet efficiency.',
      img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'industrial',
      title: 'Industrial & Specialty Lubricants',
      desc: 'High-performance hydraulic oils, industrial gear lubricants, and turbine fluids for manufacturing plants and heavy machinery.',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'cng',
      title: 'CNG Special Vehicle Oils',
      desc: 'Specially formulated low-ash engine oils engineered for CNG auto-rickshaws, CNG cars, and commercial gas vehicles.',
      img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'grease',
      title: 'Greases & Fluid Products',
      desc: 'High-temperature lithium complex greases, transmission fluids, and brake fluids designed for anti-rust & zero water washout.',
      img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const handleInquireFromModal = (prod) => {
    if (setSelectedProductForInquiry) {
      setSelectedProductForInquiry(prod.name);
    }
    setActivePage('contact');
  };

  return (
    <div>
      {/* ==================== HERO SECTION (MJL BANNER STYLE) ==================== */}
      <section style={{
        background: 'radial-gradient(120% 100% at 85% 15%, #0F3560 0%, #0A2540 50%, #051526 100%)',
        color: '#FFFFFF',
        paddingTop: 'clamp(3.5rem, 8vw, 6rem)',
        paddingBottom: 'clamp(3rem, 7vw, 5.5rem)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Verification Seal Badge (D&B / Quality Seal Style) */}
        <div style={{
          position: 'absolute', top: '25px', right: '30px', zIndex: 10,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <Award style={{ color: '#ED1B34', width: '22px', height: '22px' }} />
          <div style={{ fontSize: '0.72rem', color: '#FFFFFF', fontFamily: 'var(--font-mono)', lineHeight: 1.3 }}>
            <b>ISO 9001:2015</b><br />Certified Blending Facility
          </div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(2rem, 5vw, 3rem)',
            alignItems: 'center'
          }}>
            {/* Hero Text */}
            <div className="fade-in-left">
              <span className="eyebrow on-dark fade-in-up delay-100" style={{ color: '#ED1B34' }}>
                <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
                ORBIT LUBRICANT INDUSTRIES PLC
              </span>

              <h1 className="fade-in-up delay-200" style={{ color: '#FFFFFF', marginBottom: '1.25rem', fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)' }}>
                {hero.title || "Power in Every Drop"}
              </h1>

              <p className="fade-in-up delay-300" style={{
                color: 'rgba(255, 255, 255, 0.82)',
                fontSize: '1.12rem',
                lineHeight: 1.65,
                marginBottom: '2.25rem',
                maxWidth: '540px'
              }}>
                Orbit Lubricant Industries is a modern lubricant manufacturing company committed to delivering premium automotive and industrial lubrication solutions for local & international markets.
              </p>

              {/* Action Buttons (MJL Signature .dc-btn) */}
              <div className="fade-in-up delay-400" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <div className="dc-btn" style={{ height: '46px' }}>
                  <button onClick={() => setActivePage('products')} style={{ padding: '0 28px', fontSize: '15px' }}>
                    <span>Explore Product Range <ArrowRight size={16} /></span>
                  </button>
                </div>
                <div className="dc-btn" style={{ height: '46px' }}>
                  <button onClick={() => setActivePage('contact')} style={{ background: '#006CB7', padding: '0 28px', fontSize: '15px' }}>
                    <span>Become a Distributor</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Orbit Drop Visual */}
            <div className="fade-in-right delay-200">
              <OrbitRing />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT BRAND OVERVIEW + COUNTDOWN ==================== */}
      <section className="section pt-160 pb-120" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ marginBottom: '3.5rem' }}>
            <span className="eyebrow" style={{ color: '#ED1B34' }}>ORBIT LUBRICANT INDUSTRIES PLC</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', color: '#221F1F', maxWidth: '920px', lineHeight: 1.25 }}>
              An embodiment of trust when it comes to providing excellence in petroleum products and retaining optimum engine performance.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <img src="/logo.png" alt="Orbit Logo" style={{ maxWidth: '240px', height: 'auto', marginBottom: '1.5rem' }} />
              <div style={{ borderLeft: '3px solid #ED1B34', paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem' }}>
                State-of-the-art Lube Oil Blending Plant (LOBP) with world-class testing and measuring laboratory equipment.
              </div>
            </div>

            <div>
              <p style={{ fontSize: '1.05rem', color: '#221F1F', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                The journey of blending world-class lubricants started with a strong focus on innovation, quality assurance, and customer satisfaction. We produce high-performance engine oils, gear oils, hydraulic oils, transmission fluids, greases, and specialty lubricants.
              </p>
              <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.65 }}>
                Our products are formulated using high-quality virgin base oils and advanced additive technologies to ensure superior protection, longer engine life, enhanced fuel efficiency, and reliable performance under extreme operating conditions.
              </p>
            </div>
          </div>

          {/* Stat Metric Grid (MJL Counter Style) */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem', background: '#F9F9F9', border: '1px solid #DEDEDE',
            borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'center'
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#ED1B34' }}>No. 1</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#221F1F', marginTop: '4px' }}>Choice of Engineers</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#221F1F' }}>50+</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#221F1F', marginTop: '4px' }}>High-Performance SKUs</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#ED1B34' }}>15+</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#221F1F', marginTop: '4px' }}>Years of Excellence</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#221F1F' }}>100%</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#221F1F', marginTop: '4px' }}>Virgin Base Stock</div>
            </div>
          </div>
        </div>

        {/* ── MJL 4-CARD HOVER SHOWCASE GRID (BOTTOM ROW) ── */}
        <div style={{ marginTop: '5rem' }}>
          <div className="mjl-showcase-grid">
            {/* Card 1: Board of Directors */}
            <div className="mjl-showcase-card" onClick={() => setActivePage('about')}>
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
                alt="Leadership" className="card-img-bg"
              />
              <div className="card-overlay">
                <div className="circle-plus"><Plus size={20} /></div>
                <p style={{ fontSize: '0.82rem', color: '#ED1B34', fontWeight: 700, textTransform: 'uppercase' }}>Leadership</p>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginTop: '4px' }}>Board of Directors</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '6px' }}>Take a look at the leaders of innovation at the helm of Orbit Lubricants.</p>
              </div>
            </div>

            {/* Card 2: Product Line */}
            <div className="mjl-showcase-card" onClick={() => setActivePage('products')}>
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop"
                alt="Products" className="card-img-bg"
              />
              <div className="card-overlay">
                <div className="circle-plus"><Plus size={20} /></div>
                <p style={{ fontSize: '0.82rem', color: '#ED1B34', fontWeight: 700, textTransform: 'uppercase' }}>Portfolio</p>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginTop: '4px' }}>Product Range</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '6px' }}>Engineered for modern passenger cars, heavy trucks & industrial plant machinery.</p>
              </div>
            </div>

            {/* Card 3: Financial & Corporate */}
            <div className="mjl-showcase-card" onClick={() => setActivePage('about')}>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                alt="Financial Reports" className="card-img-bg"
              />
              <div className="card-overlay">
                <div className="circle-plus"><Plus size={20} /></div>
                <p style={{ fontSize: '0.82rem', color: '#ED1B34', fontWeight: 700, textTransform: 'uppercase' }}>Corporate</p>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginTop: '4px' }}>Investor Relations</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '6px' }}>Our unrivaled attitude towards excellence is a big reason behind our growth.</p>
              </div>
            </div>

            {/* Card 4: Quality Assurance */}
            <div className="mjl-showcase-card" onClick={() => setActivePage('about')}>
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
                alt="Quality Assurance" className="card-img-bg"
              />
              <div className="card-overlay">
                <div className="circle-plus"><Plus size={20} /></div>
                <p style={{ fontSize: '0.82rem', color: '#ED1B34', fontWeight: 700, textTransform: 'uppercase' }}>Certification</p>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginTop: '4px' }}>Quality Assurance</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '6px' }}>Each product goes through acute QA measures to ensure uncompromised quality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== "ORBIT FOR ALL" PRODUCT LINE ACCORDION (MJL STYLE) ==================== */}
      <section className="mjl-accordion-wrap pt-120 pb-120">
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ color: '#ED1B34' }}>VERSATILE APPLICATIONS</span>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem' }}>Orbit for Every Machine</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
            {/* Category Accordion Toggles */}
            <div>
              {productCategories.map((cat) => {
                const isOpen = activeAccordion === cat.id;
                return (
                  <div key={cat.id} className={`mjl-accordion-item ${isOpen ? 'active' : ''}`}>
                    <button
                      className="mjl-accordion-header"
                      onClick={() => setActiveAccordion(isOpen ? '' : cat.id)}
                    >
                      <span>{cat.title}</span>
                      {isOpen ? <ChevronUp size={20} style={{ color: '#ED1B34' }} /> : <ChevronDown size={20} style={{ opacity: 0.5 }} />}
                    </button>
                    {isOpen && (
                      <div className="mjl-accordion-body">
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.25rem' }}>{cat.desc}</p>
                        <div className="dc-btn">
                          <button onClick={() => setActivePage('products')}>
                            <span>Explore Category <ArrowRight size={14} /></span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Dynamic Active Category Image Banner */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '460px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <img
                src={productCategories.find(c => c.id === activeAccordion)?.img || productCategories[0].img}
                alt="Category Banner"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(34,31,31,0.2) 0%, rgba(34,31,31,0.85) 100%)',
                padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
              }}>
                <span style={{ color: '#ED1B34', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>FEATURED RANGE</span>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.8rem', marginTop: '4px' }}>
                  {productCategories.find(c => c.id === activeAccordion)?.title || 'Car Engine Oils'}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LUBE OIL BLENDING PLANT (LOBP) TECH SHOWCASE ==================== */}
      <section className="section pt-160 pb-160" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="eyebrow" style={{ color: '#ED1B34' }}>WORLD-CLASS MANUFACTURING</span>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1.25rem' }}>Lube Oil Blending Plant (LOBP)</h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Orbit Lubricant Industries ensures the authenticity of lube oils with an extensive touch of perfection. Our state-of-the-art Lube Oil Blending Plant is engineered as an ultra-modern and technologically enhanced in-line blending facility.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#221F1F', fontWeight: 600 }}>
                  <CheckCircle2 size={18} style={{ color: '#ED1B34' }} /> Fully automated batch blending & dosage control
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#221F1F', fontWeight: 600 }}>
                  <CheckCircle2 size={18} style={{ color: '#ED1B34' }} /> 100% Virgin Group II & Group III base stocks
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#221F1F', fontWeight: 600 }}>
                  <CheckCircle2 size={18} style={{ color: '#ED1B34' }} /> Advanced additive technology from Infineum & Afton
                </li>
              </ul>
              <div className="dc-btn">
                <button onClick={() => setActivePage('about')}>
                  <span>Read Full Tech Specs <ArrowRight size={14} /></span>
                </button>
              </div>
            </div>

            {/* Plant Photography Card */}
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
                alt="Lube Oil Blending Plant"
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LUBE OIL TESTING LAB SHOWCASE ==================== */}
      <section className="section pt-120 pb-160" style={{ background: '#F9F9F9', borderTop: '1px solid #DEDEDE' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop"
                alt="Testing Lab"
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '20px' }}
              />
              <div style={{
                position: 'absolute', bottom: '25px', left: '25px', right: '25px',
                background: '#FFFFFF', padding: '1.5rem', borderRadius: '14px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)', borderLeft: '4px solid #ED1B34'
              }}>
                <h4 style={{ fontSize: '1.1rem', color: '#221F1F', marginBottom: '4px' }}>Fostering Excellence in Quality</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>Equipped under ISO/IEC 17025:2017 & ISO 9001 guidelines.</p>
              </div>
            </div>

            <div>
              <span className="eyebrow" style={{ color: '#ED1B34' }}>QUALITY CONTROL LABORATORY</span>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1.25rem' }}>Lube Oil Testing Lab</h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                MJL/Mobil benchmarked analytical laboratory equipped with FTIR Spectrophotometer, Automatic Viscometer, TAN/TBN Analyzer, Pour Point Determiner, and Karl Fischer Coulometer.
              </p>
              <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.65, marginBottom: '2rem' }}>
                Every single production batch undergoes rigorous Quality Assurance (QA) testing before release, leaving zero margin for error.
              </p>
              <div className="dc-btn">
                <button onClick={() => setActivePage('about')}>
                  <span>View Lab Accreditation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS CATALOG ==================== */}
      <section className="section pt-120 pb-120" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="eyebrow" style={{ color: '#ED1B34' }}>PREMIUM PRODUCTS</span>
              <h2>Featured Lubricant Products</h2>
            </div>
            <button onClick={() => setActivePage('products')} className="btn btn-outline" style={{ borderRadius: '19px' }}>
              <span>View Full Catalog ({products.length})</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid-responsive-3">
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
      <section className="section" style={{ background: '#F9F9F9', borderTop: '1px solid #DEDEDE' }}>
        <div className="container">
          <LubricantFinder onSelectProduct={(p) => setSelectedProduct(p)} />
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

