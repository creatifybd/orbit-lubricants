import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { AdminLogin } from './AdminLogin';
import { DashboardOverview } from './DashboardOverview';
import { ProductManager } from './ProductManager';
import { ContentManager } from './ContentManager';
import { InquiriesManager } from './InquiriesManager';
import { SiteSettings } from './SiteSettings';
import { 
  LayoutDashboard, Package, FileText, Mail, Settings, 
  LogOut, Globe, Shield, Sparkles 
} from 'lucide-react';

export const AdminLayout = ({ onReturnHome }) => {
  const { data, isAdminLoggedIn, logoutAdmin } = useCms();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAdminLoggedIn) {
    return <AdminLogin onReturnHome={onReturnHome} />;
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Product Manager', icon: Package },
    { id: 'content', label: 'Content CMS', icon: FileText },
    { id: 'inquiries', label: 'Leads & Inquiries', icon: Mail },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: '#FFFFFF', borderRadius: '8px', margin: '1rem' }}>
          <img 
            src={data?.settings?.logoUrl || '/logo.png'} 
            alt="Orbit Lubricants Logo" 
            style={{ height: '36px', width: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Sidebar Menu */}
        <nav style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {menuItems.map(item => {
            const IconComp = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: active ? 'linear-gradient(135deg, #005AAB 0%, #0A2540 100%)' : 'transparent',
                  color: active ? '#FFFFFF' : '#94A3B8',
                  border: active ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconComp size={18} style={{ color: active ? '#F7941D' : '#64748B' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={onReturnHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.7rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#CBD5E1',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            <Globe size={16} style={{ color: '#60A5FA' }} />
            <span>View Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.7rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              color: '#EF4444',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            <LogOut size={16} />
            <span>Logout Administrator</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'inquiries' && <InquiriesManager />}
        {activeTab === 'settings' && <SiteSettings />}
      </main>
    </div>
  );
};
