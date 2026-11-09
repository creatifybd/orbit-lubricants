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

// Support old hash links and new crawlable paths, including trailing slashes.
// Product detail pages are generated separately at /products/:slug/.
function getInitialPage() {
  const hash = window.location.hash.slice(1).split('/').filter(Boolean).join('/').toLowerCase();
  const path = window.location.pathname.split('/').filter(Boolean).join('/').toLowerCase();
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

  // Use canonical paths for new navigation without reloading the React app.
  // Existing #products links remain readable through getInitialPage.
  const handlePageChange = (pageId) => {
    const url = pageId === 'home' ? '/' : `/${pageId}/`;
    window.history.pushState({ page: pageId }, '', url);
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep browser back/forward buttons and legacy hash links working.
  useEffect(() => {
    const handleLocationChange = () => setActivePage(getInitialPage());
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
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
          <section className="section finder-page">
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
