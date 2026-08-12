import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { Menu, X, Sparkles, ChevronRight, Phone, ShoppingCart, Search } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { data } = useCms();
  const { settings } = data || {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      {/* ── Top Utility Header Bar (MJL Style) ── */}
      <div style={{
        background: '#221F1F',
        color: '#FFFFFF',
        fontSize: '0.82rem',
        padding: '0.4rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        zIndex: 201,
        position: 'relative'
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
              color: '#FFFFFF', textDecoration: 'none', fontWeight: 700,
              background: '#ED1B34', padding: '0.2rem 0.75rem', borderRadius: '12px',
              fontSize: '0.78rem'
            }}>
              <Phone size={12} /> 16669 Hotline
            </a>
            <span style={{ color: 'rgba(255,255,255,0.6)', display: isMobile ? 'none' : 'inline' }}>
              ✦ ISO 9001:2015 & 14001:2018 Certified Blending Plant
            </span>
          </div>

          {/* Right utility links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => handleNav('products')}
              style={{
                background: 'transparent', border: 'none', color: '#FFFFFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '0.8rem', fontWeight: 600
              }}
            >
              <ShoppingCart size={13} style={{ color: '#ED1B34' }} /> Buy Orbit Lubricants
            </button>
            <span style={{ opacity: 0.3 }}>|</span>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: 'transparent', border: 'none', color: '#FFFFFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '0.8rem', fontWeight: 600
              }}
            >
              <Search size={13} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Drawer Bar ── */}
      {searchOpen && (
        <div style={{
          background: '#FFFFFF', borderBottom: '2px solid #ED1B34',
          padding: '1rem 0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          position: 'sticky', top: 0, zIndex: 200
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
                  border: '1px solid #DEDEDE', fontSize: '0.95rem', outline: 'none'
                }}
              />
              <div className="dc-btn">
                <button type="submit"><span>Search</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Main Sticky Corporate Navbar ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 190,
        background: isScrolled ? 'rgba(255,255,255,0.98)' : '#FFFFFF',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 0 #DEDEDE',
        transition: 'all 0.3s ease',
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
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2.2rem', height: '100%' }}>
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  style={{
                    background: 'none', border: 'none',
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: '0.92rem',
                    color: activePage === link.id ? '#ED1B34' : '#221F1F',
                    cursor: 'pointer', height: '100%',
                    position: 'relative', transition: 'color 0.25s ease', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center'
                  }}
                >
                  {link.label}
                  {activePage === link.id && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: '3px', background: '#ED1B34'
                    }} />
                  )}
                </button>
              ))}
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
                  background: mobileOpen ? '#221F1F' : 'transparent',
                  border: '1px solid #DEDEDE',
                  borderRadius: '10px',
                  color: mobileOpen ? '#FFFFFF' : '#221F1F',
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

      {/* ── Mobile Navigation Drawer ── */}
      {isMobile && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 299,
              background: 'rgba(34,31,31,0.65)',
              opacity: mobileOpen ? 1 : 0,
              pointerEvents: mobileOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
            }}
          />

          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '85vw', maxWidth: '340px',
            background: '#FFFFFF', zIndex: 300,
            boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(105%)',
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid #DEDEDE',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <img
                src={settings?.logoUrl || '/logo.png'}
                alt="Orbit Lubricants"
                style={{ height: '36px', objectFit: 'contain' }}
              />
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: '#F9F9F9', border: '1px solid #DEDEDE',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#221F1F',
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
                    background: activePage === link.id ? 'rgba(237,27,52,0.06)' : 'transparent',
                    border: 'none', borderBottom: '1px solid #E1E4E6',
                    padding: '1rem 0.5rem',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem',
                    color: activePage === link.id ? '#ED1B34' : '#221F1F',
                    cursor: 'pointer',
                  }}
                >
                  {link.label}
                  <ChevronRight size={18} style={{ color: '#ED1B34', opacity: 0.7 }} />
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
                fontSize: '0.8rem', color: '#475569', fontWeight: 600
              }}>
                📞 Hotline: <a href="tel:16669" style={{ color: '#ED1B34', fontWeight: 800 }}>16669</a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

