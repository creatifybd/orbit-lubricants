import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Search, Filter, Sparkles, Layers } from 'lucide-react';

export const Products = ({ setActivePage, setSelectedProductForInquiry }) => {
  const { data } = useCms();
  const { products, categories } = data;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products based on category & search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.viscosity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.apiGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

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
      <section style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #051526 100%)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <span className="eyebrow on-dark">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
            COMPLETE FORMULATION CATALOG
          </span>
          <h1 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Our Product Portfolio
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Explore our comprehensive range of high-performance engine oils, industrial gear fluids, hydraulic oils, and high-temperature greases.
          </p>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="section">
        <div className="container">
          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', maxWidth: '540px', width: '100%', margin: '0 auto' }}>
              <Search 
                size={20} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--steel)' }} 
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search by viscosity (e.g. 5W-30), API standard, or product name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  height: '52px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>

            {/* Category Buttons — horizontal scroll on mobile */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}>
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
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
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
