import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { Menu, X, Sparkles } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { data } = useCms();
  const { settings } = data;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About Us' },
    { id: 'finder', label: 'Lube Finder' },
    { id: 'contact', label: 'Contact & Dealers' }
  ];

  return (
    <>
      {/* Announcement Banner */}
      {settings.showBanner && settings.bannerText && (
        <div style={{
          background: 'linear-gradient(90deg, #0A2540 0%, #005AAB 50%, #0A2540 100%)',
          color: '#FFFFFF',
          fontSize: '0.84rem',
          fontWeight: 500,
          padding: '0.5rem 1rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <Sparkles style={{ width: '14px', height: '14px', color: '#F7941D' }} />
          <span>{settings.bannerText}</span>
        </div>
      )}

      {/* Main Sticky Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: isScrolled ? 'rgba(255, 255, 255, 0.97)' : 'rgba(255, 255, 255, 0.90)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isScrolled ? 'var(--line)' : 'transparent'}`,
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(10, 37, 64, 0.08)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          {/* Official Logo */}
          <div
            onClick={() => setActivePage('home')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <img
              src={settings?.logoUrl || '/logo.png'}
              alt="Orbit Lubricants Official Logo"
              style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.94rem',
                  color: activePage === link.id ? 'var(--orange-deep)' : 'var(--navy)',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.label}
                {activePage === link.id && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2.5px',
                    borderRadius: '2px',
                    background: 'var(--orange)'
                  }} />
                )}
              </button>
            ))}
          </nav>

          {/* Contact CTA Button + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setActivePage('contact')}
              className="btn btn-primary btn-sm desktop-nav"
            >
              Get a Quote
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{ background: 'none', border: 'none', color: 'var(--navy)', cursor: 'pointer', padding: '4px' }}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div style={{
            background: '#FFFFFF',
            borderBottom: '1px solid var(--line)',
            padding: '1.25rem 1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setActivePage(link.id); setMobileOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: activePage === link.id ? 'var(--mist)' : 'none',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: activePage === link.id ? 'var(--orange-deep)' : 'var(--navy)',
                  cursor: 'pointer',
                  marginBottom: '0.25rem'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 869px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};
