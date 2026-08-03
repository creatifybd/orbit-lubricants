import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { data } = useCms();
  const { settings } = data || {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 869;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); // auto-close when resizing to desktop
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = (mobileOpen && isMobile) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isMobile]);

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
      {/* ── Announcement Banner ── */}
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
          <span>{settings.bannerText}</span>
        </div>
      )}

      {/* ── Main Sticky Header ── */}
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

          {/* Desktop Nav — only rendered when NOT mobile */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  style={{
                    background: 'none', border: 'none',
                    fontFamily: 'var(--font-body)', fontWeight: 600,
                    fontSize: '0.92rem',
                    color: activePage === link.id ? 'var(--orange-deep)' : 'var(--navy)',
                    cursor: 'pointer', padding: '0.5rem 0',
                    position: 'relative', transition: 'color 0.2s ease', whiteSpace: 'nowrap',
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
          )}

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Desktop CTA — hidden on mobile */}
            {!isMobile && (
              <button onClick={() => handleNav('contact')} className="btn btn-primary btn-sm">
                Get a Quote
              </button>
            )}

            {/* Mobile Hamburger — only shown on mobile */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                style={{
                  background: mobileOpen ? 'var(--mist)' : 'none',
                  border: '1.5px solid var(--line)',
                  borderRadius: '10px',
                  color: 'var(--navy)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  width: '42px', height: '42px',
                }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Overlay + Drawer — only rendered on mobile ── */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 199,
              background: 'rgba(5,21,38,0.5)',
              backdropFilter: 'blur(4px)',
              opacity: mobileOpen ? 1 : 0,
              pointerEvents: mobileOpen ? 'auto' : 'none',
              transition: 'opacity 0.28s ease',
            }}
          />

          {/* Slide-in Drawer */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '80vw', maxWidth: '300px',
            background: '#FFFFFF', zIndex: 300,
            boxShadow: '-8px 0 40px rgba(10,37,64,0.22)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(105%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '1.1rem 1.1rem 0.9rem',
              borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <img
                src={settings?.logoUrl || '/logo.png'}
                alt="Orbit Lubricants"
                style={{ height: '34px', objectFit: 'contain' }}
              />
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: 'var(--mist)', border: '1px solid var(--line)',
                  borderRadius: '50%', width: '34px', height: '34px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--navy)',
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Nav Links */}
            <nav style={{ padding: '0.75rem', flex: 1 }}>
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', textAlign: 'left',
                    background: activePage === link.id
                      ? 'rgba(247,148,29,0.08)'
                      : 'transparent',
                    border: 'none', borderRadius: '10px',
                    padding: '0.9rem 0.85rem',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem',
                    color: activePage === link.id ? 'var(--orange-deep)' : 'var(--navy)',
                    cursor: 'pointer', marginBottom: '2px',
                    borderLeft: activePage === link.id
                      ? '3px solid var(--orange)'
                      : '3px solid transparent',
                  }}
                >
                  {link.label}
                  <ChevronRight size={16} style={{ opacity: 0.35, flexShrink: 0 }} />
                </button>
              ))}
            </nav>

            {/* Drawer Footer CTA */}
            <div style={{ padding: '0.85rem 1rem 2rem' }}>
              <button
                onClick={() => handleNav('contact')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get a Quote
              </button>
              <div style={{
                marginTop: '0.85rem', padding: '0.75rem',
                background: 'var(--mist)', borderRadius: '8px',
                fontSize: '0.72rem', color: 'var(--steel)',
                textAlign: 'center', fontFamily: 'var(--font-mono)',
              }}>
                ⚡ API CI-4 · JASO MA2 · ACEA E7
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
