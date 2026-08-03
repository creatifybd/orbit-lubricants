import React from 'react';
import { useCms } from '../../context/CmsContext';
import { Package, Mail, Layers, ShieldCheck, Activity, ArrowUpRight, Sparkles } from 'lucide-react';

export const DashboardOverview = ({ setActiveTab }) => {
  const { data } = useCms();
  const { products, categories, inquiries, settings } = data;

  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #005AAB 100%)',
        padding: '2rem',
        borderRadius: 'var(--radius-md)',
        color: '#FFFFFF',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <Sparkles style={{ color: '#F7941D' }} size={18} />
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
              LIVE SYSTEM HEALTH: OPTIMAL
            </span>
          </div>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>
            Welcome to Orbit CMS Dashboard
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.94rem' }}>
            Real-time management portal for Orbit Lubricant Industries.
          </p>
        </div>

        <button onClick={() => setActiveTab('products')} className="btn btn-primary">
          <span>Manage Product Catalog</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="admin-stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(0, 90, 171, 0.2)',
            color: '#60A5FA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Products
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
              {products.length}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(247, 148, 29, 0.2)',
            color: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pending Inquiries
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
              {newInquiriesCount}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34D399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
              {categories.length}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.2)',
            color: '#C084FC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Site Status
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34D399', fontFamily: 'var(--font-display)' }}>
              {settings.maintenanceMode ? 'Maintenance' : 'Live & Active'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries Panel */}
      <div style={{
        background: '#0F233D',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
            Recent Customer & Distributor Leads
          </h3>
          <button onClick={() => setActiveTab('inquiries')} className="btn btn-sm btn-outline" style={{ color: '#F8FAFC' }}>
            View All ({inquiries.length})
          </button>
        </div>

        {inquiries.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Inquiry Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.slice(0, 4).map(inq => (
                <tr key={inq.id}>
                  <td>{inq.date}</td>
                  <td style={{ fontWeight: 600, color: '#FFFFFF' }}>{inq.name}</td>
                  <td>{inq.type}</td>
                  <td>
                    <span className={`admin-badge ${inq.status === 'New' ? 'badge-new' : 'badge-closed'}`}>
                      {inq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No inquiries submitted yet.</p>
        )}
      </div>
    </div>
  );
};
