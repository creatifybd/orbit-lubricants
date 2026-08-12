import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { Menu, X, ChevronRight, Phone, ShoppingCart, Search } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { data } = useCms();
  const { settings } = data || {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 992;
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('products');
      setSearchOpen(false);
    }
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
        {/* Top Utility Header Bar */}
        <div style={{
          background: isScrolled ? 'rgba(10, 25, 45, 0.95)' : 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#FFFFFF',
          fontSize: '0.82rem',
          padding: '0.45rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.35s ease'
        }}>
          <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {/* Hotline & Customer Care */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <a href="tel:16669" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: '#FFFFFF', textDecoration: 'none', fontWeight: 800,
                background: '#F7931E', padding: '0.2rem 0.85rem', borderRadius: '14px',
                fontSize: '0.78rem', boxShadow: '0 4px 12px rgba(247, 147, 30, 0.5)'
              }}>
                <Phone size={12} /> 16669 Hotline
              </a>
              <span style={{ color: 'rgba(255,255,255,0.75)', display: isMobile ? 'none' : 'inline', fontWeight: 500 }}>
                ✦ ISO 9001:2015 & 14001:2018 Certified Blending Facility
              </span>
            </div>

            {/* Right Utility Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <button
                onClick={() => handleNav('products')}
                style={{
                  background: 'transparent', border: 'none', color: '#FFFFFF',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.82rem', fontWeight: 600, transition: 'color 0.25s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#F7931E'}
                onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
              >
                <ShoppingCart size={13} style={{ color: '#F7931E' }} /> Buy Orbit Lubricants
              </button>
              <span style={{ opacity: 0.3, color: '#FFFFFF' }}>|</span>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  background: 'transparent', border: 'none', color: '#FFFFFF',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.82rem', fontWeight: 600, transition: 'color 0.25s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#F7931E'}
                onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
              >
                <Search size={13} /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Drawer */}
        {searchOpen && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            borderBottom: '2px solid #F7931E',
            padding: '1rem 0',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="container">
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Search engine oils, gear oils, hydraulic fluids..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1, padding: '0.75rem 1.25rem', borderRadius: '19px',
                    border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.95rem', outline: 'none',
                    background: 'rgba(255,255,255,0.08)', color: '#FFFFFF'
                  }}
                />
                <div className="dc-btn">
                  <button type="submit"><span>Search</span></button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Header */}
        <header style={{
          background: isScrolled
            ? 'rgba(10, 25, 45, 0.95)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          boxShadow: isScrolled ? '0 8px 30px rgba(0,0,0,0.25)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
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
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
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
                        background: isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
                        border: 'none',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.94rem',
                        color: (isActive || isHovered) ? '#F7931E' : '#FFFFFF',
                        textShadow: (isActive || isHovered) ? '0 0 14px rgba(247, 147, 30, 0.7)' : '0 1px 4px rgba(0,0,0,0.4)',
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
                          boxShadow: '0 0 10px #F7931E',
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
                    background: mobileOpen ? '#F7931E' : 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
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
              background: 'rgba(5,15,30,0.75)',
              opacity: mobileOpen ? 1 : 0,
              pointerEvents: mobileOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
            }}
          />

          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '85vw', maxWidth: '340px',
            background: '#0F172A', color: '#FFFFFF', zIndex: 300,
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(105%)',
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
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
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#FFFFFF',
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
                    background: activePage === link.id ? 'rgba(247, 147, 30, 0.15)' : 'transparent',
                    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)',
                    padding: '1rem 0.5rem',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem',
                    color: activePage === link.id ? '#F7931E' : '#FFFFFF',
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
                📞 Hotline: <a href="tel:16669" style={{ color: '#F7931E', fontWeight: 800 }}>16669</a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};


