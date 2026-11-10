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
import { PrivacyPreferences } from './components/PrivacyPreferences';
import { trackOrbitEvent } from './lib/analytics';

// Support old hash links and new crawlable paths, including trailing slashes.
// Product detail pages are generated separately at /products/:slug/.
function getInitialPage() {
  const hash = window.location.hash.slice(1).split('/').filter(Boolean).join('/').toLowerCase();
  const path = window.location.pathname.split('/').filter(Boolean).join('/').toLowerCase();
  const routes = ['admin', 'products', 'about', 'contact', 'finder'];
  // Legacy hash selection takes precedence over the underlying document URL.
  if (routes.includes(hash)) return hash;
  if (routes.includes(path)) return path;
  return 'home';
}

const PAGE_METADATA = {
  home: {
    title: 'Orbit Lubricants Bangladesh | Engine Oil, Gear Oil & Brake Fluid',
    description: 'Explore Orbit Lubricants in Bangladesh: motorcycle, passenger-car and heavy-duty engine oils, gear oils, brake fluids and transmission fluids.'
  },
  products: {
    title: 'Engine Oil, Gear Oil & Brake Fluid Catalog | Orbit Lubricants',
    description: 'Browse Orbit Lubricants oils and fluids by application, viscosity, performance class and pack size.'
  },
  about: {
    title: 'About Orbit Lubricants | Bangladesh Automotive Lubricants',
    description: 'Learn about Orbit Lubricants and our automotive, motorcycle, heavy-duty and transmission fluid range.'
  },
  contact: {
    title: 'Contact Orbit Lubricants | Product & Distributor Enquiries',
    description: 'Contact Orbit Lubricants for product details, dealership and bulk supply enquiries in Bangladesh.'
  },
  finder: {
    title: 'Lubricant Finder | Choose By Application | Orbit Lubricants',
    description: 'Explore Orbit lubricants by application. Verify vehicle or equipment requirements before choosing a grade.'
  },
  admin: {
    title: 'Local CMS Preview | Orbit Lubricants',
    description: 'Browser-local content management preview, not a public management portal.'
  }
};

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

  // Keep canonical, description, Open Graph and title consistent with the visible route.
  // Pre-rendered category pages contain the same metadata in their initial HTML.
  useEffect(() => {
    const route = PAGE_METADATA[activePage] || PAGE_METADATA.home;
    const pagePath = activePage === 'home' ? '/' : `/${activePage}/`;
    const canonicalUrl = `https://orbit-lubricants.com${pagePath}`;

    document.title = route.title;
    if (activePage !== 'admin') trackOrbitEvent('page_view', { page_path: pagePath });
    const setMeta = (selector, attribute, value) => {
      const element = document.head.querySelector(selector);
      if (element) element.setAttribute(attribute, value);
    };
    setMeta('meta[name="description"]', 'content', route.description);
    setMeta('meta[property="og:title"]', 'content', route.title);
    setMeta('meta[property="og:description"]', 'content', route.description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="robots"]', 'content', activePage === 'admin' ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
    if (activePage !== 'admin') {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', canonicalUrl);
    }
  }, [activePage]);

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

  // One anonymous impression per visible content section, after consent.
  // Raw scroll coordinates or visitor identity are never captured.
  useEffect(() => {
    if (activePage === 'admin' || !('IntersectionObserver' in window)) return undefined;
    const nodes = [...document.querySelectorAll('[data-orbit-section]')];
    if (!nodes.length) return undefined;
    const observed = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const sectionId = entry.target.getAttribute('data-orbit-section');
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35 ||
          document.visibilityState !== 'visible' || observed.has(sectionId)) continue;
        if (trackOrbitEvent('section_view', { section_id: sectionId })) {
          observed.add(sectionId);
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: [0.35, 0.6] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activePage]);

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
      <PrivacyPreferences />
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
