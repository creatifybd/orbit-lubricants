import React, { useState, useEffect } from 'react';
import { CmsProvider } from './context/CmsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { LubricantFinder } from './components/LubricantFinder';
import { AdminLayout } from './pages/Admin/AdminLayout';

// Determine initial page from URL hash
function getInitialPage() {
  const hash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();
  const path = window.location.pathname.replace('/', '').toLowerCase();
  if (hash === 'admin' || path === 'admin') return 'admin';
  if (hash === 'products' || path === 'products') return 'products';
  if (hash === 'about' || path === 'about') return 'about';
  if (hash === 'contact' || path === 'contact') return 'contact';
  if (hash === 'finder' || path === 'finder') return 'finder';
  return 'home';
}

export function AppContent() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState(null);

  // Sync URL hash with page state
  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId === 'home' ? '' : pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for hash changes (e.g., user types #admin in URL)
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getInitialPage();
      setActivePage(newPage);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (activePage === 'admin') {
    return <AdminLayout onReturnHome={() => handlePageChange('home')} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage={activePage} setActivePage={handlePageChange} />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <Home
            setActivePage={handlePageChange}
            setSelectedProductForInquiry={setSelectedProductForInquiry}
          />
        )}
        {activePage === 'products' && (
          <Products
            setActivePage={handlePageChange}
            setSelectedProductForInquiry={setSelectedProductForInquiry}
          />
        )}
        {activePage === 'about' && <About />}
        {activePage === 'finder' && (
          <section className="section">
            <div className="container">
              <LubricantFinder
                onSelectProduct={(p) => {
                  setSelectedProductForInquiry(p.name);
                  handlePageChange('contact');
                }}
              />
            </div>
          </section>
        )}
        {activePage === 'contact' && (
          <Contact selectedProductForInquiry={selectedProductForInquiry} />
        )}
      </main>

      <Footer setActivePage={handlePageChange} />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <AppContent />
    </CmsProvider>
  );
}
