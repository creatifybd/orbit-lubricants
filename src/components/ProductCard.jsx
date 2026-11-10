import React, { useState } from 'react';
import { ArrowUpRight, Check, FileText, MessageSquare, Package, Scale } from 'lucide-react';

export const ProductCard = ({ product, onSelect, onInquire, onToggleCompare, isCompared = false, disableCompare = false }) => {
  const [loaded, setLoaded] = useState(false);
  const standardVisible = product.apiGrade && !product.apiGrade.toLowerCase().includes('not stated');

  const open = () => onSelect?.(product);

  return (
    <article className="catalog-product-card">
      <button className="catalog-card-open" onClick={open} aria-label={`View specifications for ${product.name}`} />
      <div className="catalog-product-visual">
        <div className="catalog-product-code">{product.viscosity}</div>
        <div className="catalog-product-lines" />
        <img className={loaded ? 'loaded' : ''} src={product.image} alt={product.name} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
        <span className="catalog-product-pack"><Package size={13} /> {product.packing}</span>
      </div>
      <div className="catalog-product-content">
        <span className="catalog-product-category">{product.badge}</span>
        <h3>{product.name}</h3>
        {standardVisible && <div className="catalog-product-standard"><FileText size={13} /> {product.apiGrade}</div>}
        <p>{product.description}</p>
        <div className="catalog-product-actions">
          <span>View specifications <ArrowUpRight size={16} /></span>
          <a className="catalog-product-deep-link" href={`/products/${product.id}/`} onClick={(event) => event.stopPropagation()} aria-label={`Open dedicated page for ${product.name}`}>Product page</a>
          {onToggleCompare && (
            <button
              type="button"
              className={`catalog-compare${isCompared ? ' active' : ''}`}
              aria-pressed={isCompared}
              aria-label={`${isCompared ? 'Remove' : 'Add'} ${product.name} ${isCompared ? 'from' : 'to'} comparison`}
              disabled={disableCompare && !isCompared}
              onClick={() => onToggleCompare(product)}
            >
              {isCompared ? <Check size={15} /> : <Scale size={15} />}
              <span>{isCompared ? 'Added' : 'Compare'}</span>
            </button>
          )}
          {onInquire && <button className="catalog-inquire" onClick={() => onInquire(product)} aria-label={`Enquire about ${product.name}`}><MessageSquare size={16} /></button>}
        </div>
      </div>
    </article>
  );
};
