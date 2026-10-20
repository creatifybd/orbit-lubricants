import React, { useEffect, useState } from 'react';
import { useCms } from '../context/CmsContext';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Search, Sparkles, Layers, X } from 'lucide-react';

export const Products = ({ setActivePage, setSelectedProductForInquiry }) => {
  const { data } = useCms();
  const { products, categories } = data;

  const [selectedCategory, setSelectedCategory] = useState(() => sessionStorage.getItem('orbit_catalog_category') || 'all');
  const [searchQuery, setSearchQuery] = useState(() => sessionStorage.getItem('orbit_catalog_search') || '');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    sessionStorage.removeItem('orbit_catalog_search');
    sessionStorage.removeItem('orbit_catalog_category');
  }, []);

  // Filter products based on category & search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchable = [product.name, product.viscosity, product.apiGrade, product.packing, product.badge, product.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const handleInquireFromModal = (prod) => {
    if (setSelectedProductForInquiry) {
      setSelectedProductForInquiry(prod.name);
    }
    setActivePage('contact');
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero" style={{
        background: 'linear-gradient(135deg, #EEF7FF 0%, #FFFFFF 72%)',
        color: '#0A2540',
        padding: '8.5rem 0 4.5rem',
        borderBottom: '1px solid rgba(0, 90, 171, 0.12)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <span className="eyebrow on-dark">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
            CURRENT PRODUCT CATALOG
          </span>
          <h1 style={{ color: '#0A2540', marginBottom: '1rem' }}>
            Our Product Portfolio
          </h1>
          <p style={{ color: '#52677B', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Browse all {products.length} Orbit packs across engine oils, transmission fluids, gear oils, brake fluids and bulk formats.
          </p>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="section">
        <div className="container">
          {/* Search & Filter Bar */}
          <div className="catalog-toolbar">
            {/* Search Input */}
            <div className="catalog-search">
              <Search 
                size={20} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--steel)' }} 
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search by product, viscosity or label-stated classification..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '48px',
                  paddingRight: searchQuery ? '48px' : '16px',
                  height: '52px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              {searchQuery && <button type="button" className="catalog-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear product search"><X size={18} /></button>}
            </div>

            {/* Category Buttons — horizontal scroll on mobile */}
            <div className="catalog-filter-scroll" role="group" aria-label="Filter products by application">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
              >
                All Products ({products.length})
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <p className="catalog-results-count" aria-live="polite">Showing {filteredProducts.length} of {products.length} products</p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="catalog-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                  onInquire={handleInquireFromModal}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)'
            }}>
              <Layers size={48} style={{ color: 'var(--steel)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                No Products Found
              </h3>
              <p style={{ color: 'var(--steel)', fontSize: '0.94rem' }}>
                Try adjusting your search query or select another category filter.
              </p>
            </div>
          )}
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
