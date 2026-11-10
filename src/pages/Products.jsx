import React, { useEffect, useState } from 'react';
import { useCms } from '../context/CmsContext';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Search, Sparkles, Layers, X } from 'lucide-react';
import { trackOrbitEvent } from '../lib/analytics';

export const Products = ({ setActivePage, setSelectedProductForInquiry }) => {
  const { data } = useCms();
  const { products, categories } = data;

  const [selectedCategory, setSelectedCategory] = useState(() => sessionStorage.getItem('orbit_catalog_category') || 'all');
  const [searchQuery, setSearchQuery] = useState(() => sessionStorage.getItem('orbit_catalog_search') || '');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState('catalog');
  const [comparisonIds, setComparisonIds] = useState([]);

  const toggleComparison = (item) => {
    const next = comparisonIds.includes(item.id)
      ? comparisonIds.filter((id) => id !== item.id)
      : comparisonIds.length < 3 ? [...comparisonIds, item.id] : comparisonIds;
    setComparisonIds(next);
    trackOrbitEvent('product_compare', { item_count: next.length });
  };
  const comparedProducts = comparisonIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const displayName = (categoryId) => categories.find((cat) => cat.id === categoryId)?.name || categoryId;


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

  useEffect(() => {
    if (!searchQuery.trim()) return undefined;
    const timer = setTimeout(() => trackOrbitEvent('view_search_results', {
      result_count: filteredProducts.length
    }), 700);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredProducts.length]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'name') return a.name.localeCompare(b.name, undefined, { numeric: true });
    if (sortOrder === 'grade') return (a.viscosity || '').localeCompare(b.viscosity || '', undefined, { numeric: true })
      || a.name.localeCompare(b.name);
    if (sortOrder === 'pack') return (a.packing || '').localeCompare(b.packing || '', undefined, { numeric: true })
      || a.name.localeCompare(b.name);
    return 0;
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
      <section data-orbit-section="products_catalog" className="section">
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
                type="search"
                aria-label="Search Orbit products by name, grade or pack size"
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
            <div className="orbit-catalog-sort-row">
              <p className="catalog-results-count" aria-live="polite">Showing {filteredProducts.length} of {products.length} products</p>
              <label htmlFor="orbit-product-sort">Sort by
                <select
                  id="orbit-product-sort"
                  className="form-control"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value="catalog">Catalog order</option>
                  <option value="name">Product name A–Z</option>
                  <option value="grade">Viscosity / grade</option>
                  <option value="pack">Pack label</option>
                </select>
              </label>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="catalog-grid">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  prioritizeImage={index === 0}
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    trackOrbitEvent('select_item', { item_id: p.id, item_category: p.category });
                    trackOrbitEvent('view_item', { item_id: p.id, item_category: p.category });
                  }}
                  onInquire={handleInquireFromModal}
                  onToggleCompare={toggleComparison}
                  isCompared={comparisonIds.includes(product.id)}
                  disableCompare={comparisonIds.length >= 3}
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

      {comparedProducts.length > 0 && (
        <section className="orbit-compare-region" aria-labelledby="orbit-compare-title">
          <div className="container">
            <div className="orbit-compare-heading">
              <div>
                <h2 id="orbit-compare-title">Compare label information</h2>
                <p>Comparing {comparedProducts.length} of up to 3 products. These values reflect published pack information, not an OEM compatibility approval.</p>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setComparisonIds([])}>Clear comparison</button>
            </div>
            <div className="orbit-compare-scroll">
              <table className="orbit-compare-table">
                <caption>Orbit product pack information comparison</caption>
                <thead>
                  <tr>
                    <th scope="col">Specification</th>
                    {comparedProducts.map((item) => (
                      <th scope="col" key={item.id}>
                        <a href={`/products/${item.id}/`}>{item.name}</a>
                        <button type="button" onClick={() => toggleComparison(item)} aria-label={`Remove ${item.name} from comparison`}><X size={16} /></button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Application</th>{comparedProducts.map((item) => <td key={item.id}>{displayName(item.category)}</td>)}</tr>
                  <tr><th scope="row">Viscosity / fluid grade</th>{comparedProducts.map((item) => <td key={item.id}>{item.viscosity || 'Not stated'}</td>)}</tr>
                  <tr><th scope="row">Label classification</th>{comparedProducts.map((item) => <td key={item.id}>{item.apiGrade || 'Not stated'}</td>)}</tr>
                  <tr><th scope="row">Pack format</th>{comparedProducts.map((item) => <td key={item.id}>{item.packing || 'Not stated'}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <p className="orbit-compare-note">For product suitability, follow the vehicle or equipment manufacturer’s manual. Never substitute a grade based on this table alone.</p>
          </div>
        </section>
      )}

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
