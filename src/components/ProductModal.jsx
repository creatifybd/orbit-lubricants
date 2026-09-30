import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Info, Package, X } from 'lucide-react';

export const ProductModal = ({ product, onClose, onInquire }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!product) return undefined;
    const previous = document.activeElement;
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(() => dialogRef.current?.focus());
    const keydown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.classList.remove('modal-open'); document.removeEventListener('keydown', keydown); previous?.focus?.(); };
  }, [product, onClose]);

  if (!product) return null;
  const specs = Object.entries(product.specs || {});

  return (
    <div className="product-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" ref={dialogRef} tabIndex={-1}>
        <button className="product-dialog-close" onClick={onClose} aria-label="Close product specifications"><X size={20} /></button>
        <div className="product-dialog-visual">
          <div className="product-dialog-watermark">{product.viscosity}</div>
          <img src={product.image} alt={product.name} />
          <div className="product-dialog-pack"><Package size={16} /><span>Pack size</span><strong>{product.packing}</strong></div>
        </div>
        <div className="product-dialog-content">
          <span className="premium-kicker dark">{product.badge}</span>
          <h2 id="product-dialog-title">{product.name}</h2>
          <p className="product-dialog-intro">{product.description}</p>
          <div className="product-dialog-specs">
            <div className="product-dialog-specs-head"><h3>Product specifications</h3><span>Label-verified data</span></div>
            <dl>{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </div>
          {product.benefits?.length > 0 && <div className="product-dialog-benefits">{product.benefits.map((benefit) => <span key={benefit}><CheckCircle2 size={15} />{benefit}</span>)}</div>}
          <div className="product-dialog-note"><Info size={16} /><p>Confirm viscosity and fluid compatibility in the vehicle or equipment manufacturer’s manual before use.</p></div>
          <div className="product-dialog-actions"><button className="btn btn-primary" onClick={() => onInquire(product)}>Request product information <ArrowRight size={17} /></button><button className="btn btn-outline" onClick={onClose}>Continue browsing</button></div>
        </div>
      </div>
    </div>
  );
};
