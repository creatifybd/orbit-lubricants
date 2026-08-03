import React from 'react';
import { useCms } from '../context/CmsContext';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  const { data } = useCms();
  const { contactInfo, standards, settings } = data || {};

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0A2540 0%, #051526 100%)',
      color: '#F8FAFC',
      paddingTop: '5rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 90, 171, 0.2) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ marginBottom: '1.5rem', background: '#FFFFFF', padding: '0.6rem 1rem', borderRadius: '10px', display: 'inline-block' }}>
              <img
                src={settings?.logoUrl || '/logo.png'}
                alt="Orbit Lubricants Official Logo"
                style={{ height: '42px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Premium automotive and industrial lubricants engineered for superior engine protection, thermal efficiency, and maximum equipment uptime.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {standards.slice(0, 3).map((std, idx) => (
                <span key={idx} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#CBD5E1'
                }}>
                  {std.code}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'products', label: 'Product Catalog' },
                { id: 'about', label: 'Company Profile & Quality' },
                { id: 'finder', label: 'Lube Finder Tool' },
                { id: 'contact', label: 'Distributor Network & Inquiry' }
              ].map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => setActivePage(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color 0.2s ease',
                      padding: 0
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F7941D'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                  >
                    <ArrowUpRight size={14} />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Corporate Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} style={{ color: '#F7941D', flexShrink: 0, marginTop: '3px' }} />
                <span>{contactInfo.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Phone size={18} style={{ color: '#F7941D', flexShrink: 0 }} />
                <span>{contactInfo.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Mail size={18} style={{ color: '#F7941D', flexShrink: 0 }} />
                <span>{contactInfo.email}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} style={{ color: '#F7941D', flexShrink: 0 }} />
                <span>{contactInfo.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} Orbit Lubricant Industries. All Rights Reserved.
          </div>
          <div style={{ color: '#475569' }}>
            Power in Every Drop™
          </div>
        </div>
      </div>
    </footer>
  );
};
