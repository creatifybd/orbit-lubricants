import React from 'react';
import { useCms } from '../context/CmsContext';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  const { data } = useCms();
  const { contactInfo, standards, settings } = data || {};

  return (
    <>
      <footer style={{
        background: '#E1E4E6',
        color: '#221F1F',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        borderTop: '1px solid #DEDEDE',
        position: 'relative',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(34,31,31,0.2)'
          }}>
            {/* Col 1: Logo & Overview */}
            <div>
              <img
                src={settings?.logoUrl || '/logo.png'}
                alt="Orbit Lubricants Official Logo"
                style={{ height: '44px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }}
              />
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Orbit Lubricant Industries PLC is a modern lubricant manufacturing company delivering premium automotive and industrial lubrication solutions for local and international markets.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {standards.slice(0, 3).map((std, idx) => (
                  <span key={idx} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    background: '#FFFFFF',
                    border: '1px solid #DEDEDE',
                    color: '#221F1F',
                    fontWeight: 600
                  }}>
                    {std.code}
                  </span>
                ))}
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 style={{ color: 'rgba(34,31,31,0.4)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.08em', fontWeight: 800 }}>
                Quick Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { id: 'home', label: 'Home Page' },
                  { id: 'products', label: 'Products Catalog' },
                  { id: 'about', label: 'About Orbit & LOBP' },
                  { id: 'finder', label: 'Lube Finder Tool' },
                  { id: 'contact', label: 'Distributor Network' }
                ].map(link => (
                  <li key={link.id}>
                    <button
                      onClick={() => setActivePage(link.id)}
                      style={{
                        background: 'none', border: 'none', color: '#221F1F',
                        fontFamily: 'var(--font-display)', fontWeight: 600,
                        fontSize: '0.88rem', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: '6px', padding: 0,
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ED1B34'}
                      onMouseLeave={e => e.currentTarget.style.color = '#221F1F'}
                    >
                      <ArrowUpRight size={14} style={{ color: '#ED1B34' }} />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact Details */}
            <div>
              <h4 style={{ color: 'rgba(34,31,31,0.4)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.08em', fontWeight: 800 }}>
                Corporate Address
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#221F1F', fontWeight: 600 }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MapPin size={16} style={{ color: '#ED1B34', flexShrink: 0, marginTop: '2px' }} />
                  <span>{contactInfo.address}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Phone size={16} style={{ color: '#ED1B34', flexShrink: 0 }} />
                  <span>{contactInfo.phone}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Mail size={16} style={{ color: '#ED1B34', flexShrink: 0 }} />
                  <span>{contactInfo.email}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Clock size={16} style={{ color: '#ED1B34', flexShrink: 0 }} />
                  <span>{contactInfo.hours}</span>
                </div>
              </div>
            </div>

            {/* Col 4: Social Channels & Hotline */}
            <div>
              <h4 style={{ color: 'rgba(34,31,31,0.4)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.08em', fontWeight: 800 }}>
                Customer Care & Hotline
              </h4>
              <div style={{ marginBottom: '1.25rem' }}>
                <a href="tel:16669" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#ED1B34', color: '#FFFFFF', padding: '0.5rem 1.2rem',
                  borderRadius: '19px', textDecoration: 'none', fontWeight: 800,
                  fontSize: '0.92rem', boxShadow: '0 4px 14px rgba(237, 27, 52, 0.3)'
                }}>
                  <Phone size={14} /> Call Hotline 16669
                </a>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { icon: <Facebook size={14} />, href: '#' },
                  { icon: <Linkedin size={14} />, href: '#' },
                  { icon: <Youtube size={14} />, href: '#' },
                  { icon: <Instagram size={14} />, href: '#' }
                ].map((s, i) => (
                  <a key={i} href={s.href} style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: '#221F1F', color: '#FFFFFF', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ED1B34'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#221F1F'}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#475569',
            fontWeight: 600
          }}>
            <div>
              © {new Date().getFullYear()} Orbit Lubricant Industries. All Rights Reserved.
            </div>
            <div>
              Power in Every Drop™
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Call Button (MJL Style) */}
      <a href="tel:16669" className="mobile-call-btn" aria-label="Call Hotline">
        <Phone size={24} />
      </a>
    </>
  );
};

