import React from 'react';

// All visuals reference approved catalog artwork unchanged.
// Two identical sets allow continuous motion without visible restart.
// Duplicates are hidden from accessibility APIs and keyboard tab order.
function MarqueeRow({ products, reverse = false }) {
  if (!products.length) return null;

  const renderItems = (copy) => products.map((item) => (
    <a
      className="orbit-marquee-product"
      key={`${copy}-${item.id}`}
      href={`/products/${item.id}/`}
      aria-hidden={copy === 'duplicate' ? 'true' : undefined}
      tabIndex={copy === 'duplicate' ? -1 : undefined}
      title={item.name}
    >
      <span className="orbit-marquee-product-media">
        <img src={item.image} alt={copy === 'duplicate' ? '' : item.name} loading="lazy" decoding="async" />
      </span>
      <span className="orbit-marquee-product-name">{item.name}</span>
      <span className="orbit-marquee-product-pack">{item.packing}</span>
    </a>
  ));

  return (
    <div className="orbit-marquee-viewport">
      <div className={`orbit-marquee-track${reverse ? ' orbit-marquee-track-reverse' : ''}`}>
        <div className="orbit-marquee-group">{renderItems('primary')}</div>
        <div className="orbit-marquee-group" aria-hidden="true">{renderItems('duplicate')}</div>
      </div>
    </div>
  );
}

export function ProductMarquee({ products = [] }) {
  if (!products.length) return null;
  const midpoint = Math.ceil(products.length / 2);
  const firstRow = products.slice(0, midpoint);
  const secondRow = products.slice(midpoint);

  return (
    <section data-orbit-section="product_marquee" className="orbit-product-marquee section" aria-labelledby="orbit-marquee-title">
      <div className="container orbit-marquee-head">
        <div>
          <span className="premium-kicker dark">Original product lineup</span>
          <h2 id="orbit-marquee-title">Explore the Orbit range</h2>
          <p>View individual packs and label-stated specifications across automotive and industrial applications.</p>
        </div>
        <a className="orbit-marquee-all-link" href="/products/">Explore all {products.length} packs</a>
      </div>
      <MarqueeRow products={firstRow} />
      <MarqueeRow products={secondRow} reverse />
    </section>
  );
}
