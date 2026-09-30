import React, { useState } from 'react';
import { ArrowRight, Check, ChevronRight, Gauge, Headphones, PackageCheck, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';

export const Home = ({ setActivePage, setSelectedProductForInquiry }) => {
  const { data } = useCms();
  const { hero, products, categories, whyUs } = data;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const featured = products.filter((item) => item.featured).slice(0, 6);
  const heroProducts = products.filter((item) => ['elite-hde-15w40-5l', 'xpower-10w30-1l', 'supreme-20w50-4l'].includes(item.id));

  const inquire = (item) => {
    setSelectedProduct(null);
    setSelectedProductForInquiry?.(item.name);
    setActivePage('contact');
  };

  return (
    <div>
      <section className="premium-hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="container premium-hero-grid">
          <div className="premium-hero-copy reveal-up">
            <span className="premium-kicker">{hero.eyebrow || 'Orbit Lubricants'}</span>
            <h1>{hero.title}</h1>
            <p>{hero.subtitle}</p>
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

          <div className="product-stage" aria-label="Featured Orbit lubricant products">
            {heroProducts.map((item, index) => (
              <button key={item.id} className={`stage-product stage-product-${index + 1}`} onClick={() => setSelectedProduct(item)} aria-label={`View ${item.name}`}>
                <img src={item.image} alt={item.name} fetchPriority={index === 1 ? 'high' : 'auto'} />
              </button>
            ))}
            <div className="stage-ring" />
          </div>
        </div>
        <div className="container hero-metrics">
          {[hero.stat1, hero.stat2, hero.stat3].map((stat, index) => (
            <div className="hero-metric" key={index}><strong>{stat.number}</strong><span>{stat.label}</span></div>
          ))}
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
                <button className="application-card" key={category.id} onClick={() => setActivePage('products')}>
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
