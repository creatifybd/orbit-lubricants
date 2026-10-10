import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Gauge, Headphones, PackageCheck, Pause, Play, Plus, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
const assetBase = 'https://cdn.jsdelivr.net/gh/creatifybd/orbit-lubricants@f85a4eb3d6b4c37e54749ed367c6bbc6f594282a/public/images/custom';
const bundledHeroImages = [
  `${assetBase}/home-hero-automotive.webp`,
  `${assetBase}/home-hero-heavy-duty.webp`,
  `${assetBase}/home-hero-manufacturing.webp`
];

export const Home = ({ setActivePage, setSelectedProductForInquiry }) => {
  const { data } = useCms();
  const { hero, products, categories, whyUs } = data;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPlaying, setHeroPlaying] = useState(true);
  const featured = products.filter((item) => item.featured).slice(0, 6);
  const heroSlides = hero.slides || [];
  const activeHero = heroSlides[heroSlide];

  useEffect(() => {
    if (!heroPlaying) return undefined;
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [heroPlaying, heroSlides.length]);

  const inquire = (item) => {
    setSelectedProduct(null);
    setSelectedProductForInquiry?.(item.name);
    setActivePage('contact');
  };

  return (
    <div>
      <section className="premium-hero" aria-roledescription="carousel" aria-label="Orbit product applications">
        <div className="hero-slides" aria-live="polite">
          {heroSlides.map((slide, index) => <img key={slide.image} className={`hero-slide-image ${index === heroSlide ? 'active' : ''}`} src={bundledHeroImages[index] || slide.image} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} />)}
        </div>
        <div className="hero-slide-overlay" />
        <div className="container premium-hero-grid" key={heroSlide}>
          <div className="premium-hero-copy reveal-up">
            <span className="premium-kicker">{activeHero.eyebrow}</span>
            <h1>{activeHero.title}</h1>
            <p>{activeHero.description}</p>
            <div className="premium-actions">
              <button className="btn btn-primary btn-lg" onClick={() => setActivePage('products')}>
                {hero.ctaPrimary}<ArrowRight size={18} />
              </button>
              <button className="btn btn-ghost-dark btn-lg" onClick={() => setActivePage('contact')}>
                {hero.ctaSecondary}
              </button>
            </div>
            <div className="hero-trust-line"><ShieldCheck size={18} /> Product specifications shown exactly as stated on pack labels.</div>
          </div>
        </div>
        <div className="container hero-carousel-footer">
          <div className="hero-carousel-controls"><button onClick={() => setHeroSlide((heroSlide - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide"><ArrowLeft size={18} /></button>{heroSlides.map((slide, index) => <button key={slide.image} className={`hero-dot ${index === heroSlide ? 'active' : ''}`} onClick={() => setHeroSlide(index)} aria-label={`Show slide ${index + 1}`} aria-current={index === heroSlide ? 'true' : undefined}><span /></button>)}<button onClick={() => setHeroSlide((heroSlide + 1) % heroSlides.length)} aria-label="Next slide"><ArrowRight size={18} /></button><button onClick={() => setHeroPlaying(!heroPlaying)} aria-label={heroPlaying ? 'Pause slideshow' : 'Play slideshow'}>{heroPlaying ? <Pause size={16} /> : <Play size={16} />}</button></div>
          <div className="hero-metrics">{[hero.stat1, hero.stat2, hero.stat3].map((stat, index) => <div className="hero-metric" key={index}><strong>{stat.number}</strong><span>{stat.label}</span></div>)}</div>
        </div>
      </section>

      <section className="section range-section">
        <div className="container">
          <div className="section-heading-row">
            <div><span className="premium-kicker dark">Product portfolio</span><h2>Choose by application</h2></div>
            <button className="text-link" onClick={() => setActivePage('products')}>View all products <ArrowRight size={17} /></button>
          </div>
          <div className="application-grid">
            {categories.map((category, index) => {
              const match = products.find((p) => p.category === category.id);
              const count = products.filter((p) => p.category === category.id).length;
              return (
                <button className="application-card" key={category.id} onClick={() => { sessionStorage.setItem('orbit_catalog_category', category.id); setActivePage('products'); }}>
                  <div className="application-number">0{index + 1}</div>
                  {match && <img src={match.image} alt="" loading="lazy" />}
                  <div><span>{count} {count === 1 ? 'product' : 'products'}</span><h3>{category.name}</h3></div>
                  <ChevronRight size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-head center"><span className="premium-kicker dark">Current lineup</span><h2>Featured products</h2><p>Fourteen updated packs, organized by application and label-stated performance classification.</p></div>
          <div className="premium-product-grid">
            {featured.map((item) => <ProductCard key={item.id} product={item} onSelect={setSelectedProduct} onInquire={inquire} />)}
          </div>
        </div>
      </section>

      <section className="section corporate-showcase-section">
        <div className="container">
          <div className="mjl-showcase-grid">
            <button type="button" className="mjl-showcase-card" onClick={() => setActivePage('about')}>
              <img src="/images/custom/home-showcase-leadership.webp" alt="Orbit Lubricants leadership" className="card-img-bg" loading="lazy" decoding="async" />
              <span className="card-overlay">
                <span className="circle-plus"><Plus size={20} /></span>
                <span className="showcase-eyebrow">Leadership</span>
                <strong>Board of Directors</strong>
                <span className="showcase-description">Take a look at the leaders of innovation at the helm of Orbit Lubricants.</span>
              </span>
            </button>

            <button type="button" className="mjl-showcase-card" onClick={() => setActivePage('products')}>
              <img src="/images/custom/home-showcase-product-range-v2.webp" alt="Orbit Lubricants product range" className="card-img-bg" loading="lazy" decoding="async" />
              <span className="card-overlay">
                <span className="circle-plus"><Plus size={20} /></span>
                <span className="showcase-eyebrow">Portfolio</span>
                <strong>Product Range</strong>
                <span className="showcase-description">Engineered for modern passenger cars, heavy trucks and industrial plant machinery.</span>
              </span>
            </button>

            <button type="button" className="mjl-showcase-card" onClick={() => setActivePage('about')}>
              <img src="/images/custom/home-showcase-client-relations.webp" alt="Orbit corporate client relations" className="card-img-bg" loading="lazy" decoding="async" />
              <span className="card-overlay">
                <span className="circle-plus"><Plus size={20} /></span>
                <span className="showcase-eyebrow">Corporate</span>
                <strong>Corporate Client Relations</strong>
                <span className="showcase-description">Our unrivaled attitude towards excellence is a big reason behind our client trust and growth.</span>
              </span>
            </button>

            <button type="button" className="mjl-showcase-card" onClick={() => setActivePage('about')}>
              <img src="/images/custom/home-showcase-quality.webp" alt="Orbit quality assurance" className="card-img-bg" loading="lazy" decoding="async" />
              <span className="card-overlay">
                <span className="circle-plus"><Plus size={20} /></span>
                <span className="showcase-eyebrow">Certification</span>
                <strong>Quality Assurance</strong>
                <span className="showcase-description">Each product goes through acute QA measures to ensure uncompromised quality.</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="section confidence-section">
        <div className="container confidence-grid">
          <div><span className="premium-kicker">Clear product information</span><h2>Choose with confidence.</h2><p>Every catalog entry separates pack-label facts from selection guidance. For final compatibility, always follow the vehicle or equipment manufacturer’s manual.</p><button className="btn btn-primary" onClick={() => setActivePage('finder')}>Open lubricant finder <ArrowRight size={17} /></button></div>
          <div className="confidence-list">
            {whyUs.map((item, index) => {
              const icons = [Gauge, PackageCheck, ShieldCheck, Headphones];
              const Icon = icons[index % icons.length];
              return <div className="confidence-item" key={item.id}><span><Icon size={22} /></span><div><h3>{item.title}</h3><p>{item.desc}</p></div><Check size={18} /></div>;
            })}
          </div>
        </div>
      </section>

      <section className="catalog-cta">
        <div className="container catalog-cta-inner"><div><span className="premium-kicker">Distribution & bulk supply</span><h2>Need product or sales support?</h2></div><button className="btn btn-primary btn-lg" onClick={() => setActivePage('contact')}>Contact Orbit <ArrowRight size={18} /></button></div>
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onInquire={inquire} />
    </div>
  );
};
