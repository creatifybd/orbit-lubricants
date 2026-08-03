import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ImageUploader } from '../../components/ImageUploader';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';

export const ProductManager = () => {
  const { data, addProduct, updateProduct, deleteProduct } = useCms();
  const { products, categories } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: '',
    category: 'automotive',
    viscosity: '',
    apiGrade: '',
    packing: '',
    featured: false,
    badge: 'Premium',
    image: '',
    description: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      viscosity: '5W-30',
      apiGrade: 'API SP / SN Plus',
      packing: '1L, 4L, 208L Barrel',
      featured: true,
      badge: 'Fully Synthetic'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingId(prod.id);
    setFormData({ ...emptyForm, ...prod });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.viscosity) return;
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    setModalOpen(false);
  };

  const set = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontFamily: 'var(--font-display)' }}>
            Product Catalog Manager
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Add, update, or remove lubricants from the public catalog.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div style={{ background: '#0F233D', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Viscosity</th>
              <th>API Standard</th>
              <th>Featured</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '6px', background: '#fff', padding: '3px' }} />
                  ) : (
                    <div style={{ width: '44px', height: '44px', borderRadius: '6px', background: prod.imageColor || '#005AAB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', padding: '2px' }}>
                      {prod.name?.slice(0, 6)}
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 600, color: '#FFFFFF' }}>{prod.name}</td>
                <td style={{ textTransform: 'capitalize' }}>{prod.category}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#F7941D' }}>{prod.viscosity}</td>
                <td>{prod.apiGrade}</td>
                <td>
                  {prod.featured
                    ? <span className="admin-badge badge-featured">Featured</span>
                    : <span style={{ color: '#64748B' }}>Standard</span>}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleOpenEdit(prod)} style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer', marginRight: '12px' }} title="Edit"><Edit2 size={18} /></button>
                  <button onClick={() => { if (window.confirm(`Delete "${prod.name}"?`)) deleteProduct(prod.id); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-card dark-modal"
            onClick={e => e.stopPropagation()}
            style={{ padding: '2rem', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
                {editingId ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="dark-form">

              {/* ✅ IMAGE UPLOADER — Drag & Drop + Paste URL */}
              <ImageUploader
                label="Product Image (Drag & Drop or Paste URL)"
                value={formData.image}
                onChange={val => set('image', val)}
              />

              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" className="form-control" required value={formData.name} onChange={e => set('name', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={formData.category} onChange={e => set('category', e.target.value)}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Viscosity Grade *</label>
                  <input type="text" className="form-control" required placeholder="e.g. 5W-30 or ISO VG 68" value={formData.viscosity} onChange={e => set('viscosity', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>API / Industrial Standard</label>
                  <input type="text" className="form-control" placeholder="e.g. API SP / DIN 51524" value={formData.apiGrade} onChange={e => set('apiGrade', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Packaging Sizes</label>
                  <input type="text" className="form-control" placeholder="e.g. 1L, 4L, 208L Barrel" value={formData.packing} onChange={e => set('packing', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Badge / Highlight Tag</label>
                <input type="text" className="form-control" placeholder="e.g. Fully Synthetic or Heavy Duty" value={formData.badge} onChange={e => set('badge', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Product Description</label>
                <textarea className="form-control" rows={3} value={formData.description} onChange={e => set('description', e.target.value)} />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={e => set('featured', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="featuredCheck" style={{ margin: 0, cursor: 'pointer' }}>
                  <Star size={14} style={{ color: '#F7941D', marginRight: '4px', verticalAlign: 'middle' }} />
                  Show in Home Page Featured Products
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline" style={{ color: '#FFF', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
