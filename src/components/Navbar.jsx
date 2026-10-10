import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { Menu, X, ChevronRight } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { data } = useCms();
  const { settings } = data || {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1120;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen && isMobile) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isMobile]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products & Technology' },
    { id: 'about', label: 'About Orbit' },
    { id: 'finder', label: 'Lube Finder' },
    { id: 'contact', label: 'Dealer Network & Contact' }
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Transparent Header Wrapper (Fixed Overlay Over Hero) ── */}
      <div style={{
        position: isScrolled ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        transition: 'all 0.35s ease',
      }}>
        {/* Main Header */}
        <header style={{
          background: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: isScrolled ? '0 10px 35px rgba(10,37,64,0.10)' : '0 1px 0 rgba(10,37,64,0.08)',
          borderBottom: '1px solid rgba(0,90,171,0.10)',
          transition: 'all 0.35s ease',
        }}>
          <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '75px',
          }}>
            {/* Brand Logo */}
            <div
              onClick={() => handleNav('home')}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <img
                src={settings?.logoUrl || '/logo.png'}
                alt="Orbit Lubricants"
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 10px rgba(10,37,64,0.12))'
                }}
              />
            </div>

            {/* Desktop Nav Links (Default White Text + Intelligent Red Glow Hover) */}
            {!isMobile && (
              <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '100%' }}>
                {navLinks.map(link => {
                  const isActive = activePage === link.id;
                  const isHovered = hoveredNav === link.id;

                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNav(link.id)}
                      onMouseEnter={() => setHoveredNav(link.id)}
                      onMouseLeave={() => setHoveredNav(null)}
                      style={{
                        background: isHovered ? 'rgba(0,90,171,0.07)' : 'transparent',
                        border: 'none',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.94rem',
                        color: (isActive || isHovered) ? '#F47C00' : '#0A2540',
                        textShadow: 'none',
                        cursor: 'pointer',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '12px',
                        position: 'relative',
                        transition: 'all 0.25s ease',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {/* Red Top Indicator Line */}
                      {(isActive || isHovered) && (
                        <div style={{
                          position: 'absolute',
                          top: '-16px',
                          left: '14px',
                          right: '14px',
                          height: '3px',
                          background: '#F7931E',
                          borderRadius: '2px',
                          boxShadow: '0 3px 10px rgba(247,147,30,.28)',
                          transition: 'all 0.25s ease'
                        }} />
                      )}
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Right Action CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!isMobile && (
                <div className="dc-btn">
                  <button onClick={() => handleNav('contact')}>
                    <span>Get a Quote</span>
                  </button>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              {isMobile && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  style={{
                    background: mobileOpen ? '#F7931E' : '#EDF5FC',
                    border: '1px solid rgba(0,90,171,0.16)',
                    borderRadius: '10px',
                    color: mobileOpen ? '#FFFFFF' : '#0A5AA5',
                    cursor: 'pointer', padding: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '44px', height: '44px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {isMobile && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 299,
              background: 'rgba(10,37,64,0.28)',
              opacity: mobileOpen ? 1 : 0,
              pointerEvents: mobileOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
            }}
          />

          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '85vw', maxWidth: '340px',
            background: '#FFFFFF', color: '#0A2540', zIndex: 300,
            boxShadow: '-18px 0 50px rgba(10,37,64,0.18)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(105%)',
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid rgba(0,90,171,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <img
                src={settings?.logoUrl || '/logo.png'}
                alt="Orbit Lubricants"
                style={{ height: '38px', objectFit: 'contain' }}
              />
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: '#EDF5FC', border: '1px solid rgba(0,90,171,0.14)',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#0A5AA5',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <nav style={{ padding: '1rem', flex: 1 }}>
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', textAlign: 'left',
                    background: activePage === link.id ? 'rgba(247, 147, 30, 0.10)' : 'transparent',
                    border: 'none', borderBottom: '1px solid rgba(10,37,64,0.08)',
                    padding: '1rem 0.5rem',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem',
                    color: activePage === link.id ? '#F47C00' : '#0A2540',
                    cursor: 'pointer',
                  }}
                >
                  {link.label}
                  <ChevronRight size={18} style={{ color: '#F7931E', opacity: 0.8 }} />
                </button>
              ))}
            </nav>

            <div style={{ padding: '1.5rem 1rem' }}>
              <div className="dc-btn" style={{ width: '100%' }}>
                <button onClick={() => handleNav('contact')} style={{ width: '100%' }}>
                  <span>Get a Quote / Contact</span>
                </button>
              </div>
              <div style={{
                marginTop: '1rem', textAlign: 'center',
                fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600
              }}>
                📞 Hotline: <a href="tel:01709643307" style={{ color: '#F7931E', fontWeight: 800 }}>01709643307</a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
