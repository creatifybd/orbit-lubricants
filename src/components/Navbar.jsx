import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { data } = useCms();
  const { settings } = data || {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About Us' },
    { id: 'finder', label: 'Lube Finder' },
    { id: 'contact', label: 'Contact & Dealers' }
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Announcement Banner */}
      {settings?.showBanner && settings?.bannerText && (
        <div style={{
          background: 'linear-gradient(90deg, #0A2540 0%, #005AAB 50%, #0A2540 100%)',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          fontWeight: 500,
          padding: '0.45rem 1rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          lineHeight: 1.4,
        }}>
          <Sparkles style={{ width: '13px', height: '13px', color: '#F7941D', flexShrink: 0 }} />
          <span style={{ maxWidth: '600px' }}>{settings.bannerText}</span>
        </div>
      )}

      {/* Main Sticky Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: isScrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isScrolled ? 'var(--line)' : 'transparent'}`,
        boxShadow: isScrolled ? '0 8px 24px -8px rgba(10,37,64,0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}>
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <img
              src={settings?.logoUrl || '/logo.png'}
              alt="Orbit Lubricants"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: activePage === link.id ? 'var(--orange-deep)' : 'var(--navy)',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  position: 'relative',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
                {activePage === link.id && (
                  <div style={{
                    position: 'absolute', bottom: '-4px', left: 0, right: 0,
                    height: '2.5px', borderRadius: '2px', background: 'var(--orange)'
                  }} />
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleNav('contact')}
              className="btn btn-primary btn-sm desktop-nav"
            >
              Get a Quote
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              aria-label="Toggle menu"
              style={{
                background: mobileOpen ? 'var(--mist)' : 'none',
                border: '1.5px solid var(--line)',
                borderRadius: '10px',
                color: 'var(--navy)',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 199,
            background: 'rgba(5,21,38,0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className="mobile-toggle"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '82vw',
          maxWidth: '320px',
          background: '#FFFFFF',
          zIndex: 300,
          boxShadow: '-8px 0 40px rgba(10,37,64,0.2)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(105%)',
          transition: 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <img
            src={settings?.logoUrl || '/logo.png'}
            alt="Orbit Lubricants"
            style={{ height: '36px', objectFit: 'contain' }}
          />
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'var(--mist)', border: '1px solid var(--line)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--navy)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                textAlign: 'left',
                background: activePage === link.id
                  ? 'linear-gradient(135deg, rgba(247,148,29,0.1) 0%, rgba(247,148,29,0.05) 100%)'
                  : 'none',
                border: 'none',
                borderRadius: '12px',
                padding: '0.95rem 1rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '1rem',
                color: activePage === link.id ? 'var(--orange-deep)' : 'var(--navy)',
                cursor: 'pointer',
                marginBottom: '0.2rem',
                borderLeft: activePage === link.id ? '3px solid var(--orange)' : '3px solid transparent',
                transition: 'all 0.18s ease',
              }}
            >
              {link.label}
              <ChevronRight size={16} style={{ opacity: 0.4 }} />
            </button>
          ))}
        </nav>

        {/* Drawer CTA */}
        <div style={{ padding: '1rem 1.25rem 2rem' }}>
          <button
            onClick={() => handleNav('contact')}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }}
          >
            Get a Quote
          </button>
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem',
            background: 'var(--mist)',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: 'var(--steel)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
          }}>
            ⚡ API CI-4 · JASO MA2 · ACEA E7
          </div>
        </div>
      </div>
    </>
  );
};
