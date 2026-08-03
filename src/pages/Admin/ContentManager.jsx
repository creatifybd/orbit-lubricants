import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ImageUploader } from '../../components/ImageUploader';
import {
  Save, Layout, Info, PhoneCall, ShieldCheck, Zap,
  Plus, Trash2, Edit2, X, ChevronDown, ChevronUp
} from 'lucide-react';

export const ContentManager = () => {
  const {
    data,
    updateHero, updateAbout, updateContactInfo, updateSettings,
    addWhyUsItem, updateWhyUsItem, deleteWhyUsItem,
    addCoreValue, deleteCoreValue,
    addStandard, deleteStandard
  } = useCms();

  const { hero, about, contactInfo, whyUs, standards } = data;

  const [activeTab, setActiveTab] = useState('hero');
  const [heroForm, setHeroForm] = useState({ ...hero });
  const [aboutForm, setAboutForm] = useState({ ...about });
  const [contactForm, setContactForm] = useState({ ...contactInfo });

  // Why Us editing
  const [editingWhyId, setEditingWhyId] = useState(null);
  const [whyForm, setWhyForm] = useState({ icon: 'ShieldCheck', title: '', desc: '' });
  const [newWhyForm, setNewWhyForm] = useState({ icon: 'ShieldCheck', title: '', desc: '' });
  const [showNewWhy, setShowNewWhy] = useState(false);

  // New core value form
  const [newValue, setNewValue] = useState({ title: '', desc: '' });
  const [showNewValue, setShowNewValue] = useState(false);

  // New standard form
  const [newStd, setNewStd] = useState({ code: '', name: '', status: 'Certified' });
  const [showNewStd, setShowNewStd] = useState(false);

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'whyus', label: 'Why Choose Us', icon: Zap },
    { id: 'about', label: 'About & Values', icon: Info },
    { id: 'standards', label: 'Certifications', icon: ShieldCheck },
    { id: 'contact', label: 'Contact Info', icon: PhoneCall }
  ];

  const iconOptions = ['ShieldCheck', 'Cpu', 'Flame', 'Truck', 'Wrench', 'Star', 'Award', 'Globe', 'Zap', 'Factory'];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontFamily: 'var(--font-display)' }}>
          Website Content Manager
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
          Edit every section of the website in real-time.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                color: activeTab === tab.id ? '#FFF' : '#94A3B8',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===== HERO SECTION ===== */}
      {activeTab === 'hero' && (
        <div style={{ background: '#0F233D', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); updateHero(heroForm); }} className="dark-form">
            <h3 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Hero Section</h3>

            <div className="form-group">
              <label>Main Headline</label>
              <input type="text" className="form-control" value={heroForm.title || ''} onChange={e => setHeroForm({ ...heroForm, title: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Sub-Headline / Description</label>
              <textarea className="form-control" rows={3} value={heroForm.subtitle || ''} onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Primary Button Label</label>
                <input type="text" className="form-control" value={heroForm.ctaPrimary || ''} onChange={e => setHeroForm({ ...heroForm, ctaPrimary: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Secondary Button Label</label>
                <input type="text" className="form-control" value={heroForm.ctaSecondary || ''} onChange={e => setHeroForm({ ...heroForm, ctaSecondary: e.target.value })} />
              </div>
            </div>

            <h4 style={{ color: '#FFFFFF', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Statistics Counters</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {['stat1', 'stat2', 'stat3'].map((stat, i) => (
                <div key={stat} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label>Stat {i + 1} Number</label>
                    <input type="text" className="form-control" value={heroForm[stat]?.number || ''} onChange={e => setHeroForm({ ...heroForm, [stat]: { ...heroForm[stat], number: e.target.value } })} placeholder="e.g. 50+" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Stat {i + 1} Label</label>
                    <input type="text" className="form-control" value={heroForm[stat]?.label || ''} onChange={e => setHeroForm({ ...heroForm, [stat]: { ...heroForm[stat], label: e.target.value } })} placeholder="e.g. Products" />
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <Save size={16} /> Save Hero Changes
            </button>
          </form>
        </div>
      )}

      {/* ===== WHY US SECTION ===== */}
      {activeTab === 'whyus' && (
        <div style={{ background: '#0F233D', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Why Choose Us — Feature Cards</h3>
            <button onClick={() => setShowNewWhy(!showNewWhy)} className="btn btn-primary btn-sm">
              <Plus size={15} /> Add Card
            </button>
          </div>

          {/* New Item Form */}
          {showNewWhy && (
            <div style={{ background: 'rgba(247,148,29,0.08)', border: '1px solid rgba(247,148,29,0.25)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }} className="dark-form">
              <h4 style={{ color: '#F7941D', marginBottom: '1rem', fontSize: '0.95rem' }}>New Feature Card</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Icon Name</label>
                  <select className="form-control" value={newWhyForm.icon} onChange={e => setNewWhyForm({ ...newWhyForm, icon: e.target.value })}>
                    {iconOptions.map(ic => <option key={ic}>{ic}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Card Title</label>
                  <input type="text" className="form-control" value={newWhyForm.title} onChange={e => setNewWhyForm({ ...newWhyForm, title: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={2} value={newWhyForm.desc} onChange={e => setNewWhyForm({ ...newWhyForm, desc: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => { addWhyUsItem(newWhyForm); setNewWhyForm({ icon: 'ShieldCheck', title: '', desc: '' }); setShowNewWhy(false); }}>
                  Save Card
                </button>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none' }} onClick={() => setShowNewWhy(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Existing Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {whyUs.map(item => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem' }}>
                {editingWhyId === item.id ? (
                  <div className="dark-form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Icon</label>
                        <select className="form-control" value={whyForm.icon} onChange={e => setWhyForm({ ...whyForm, icon: e.target.value })}>
                          {iconOptions.map(ic => <option key={ic}>{ic}</option>)}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Title</label>
                        <input type="text" className="form-control" value={whyForm.title} onChange={e => setWhyForm({ ...whyForm, title: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" rows={2} value={whyForm.desc} onChange={e => setWhyForm({ ...whyForm, desc: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => { updateWhyUsItem(item.id, whyForm); setEditingWhyId(null); }}>Save</button>
                      <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none' }} onClick={() => setEditingWhyId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.96rem' }}>{item.title}</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.25rem' }}>{item.desc}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button onClick={() => { setEditingWhyId(item.id); setWhyForm({ icon: item.icon, title: item.title, desc: item.desc }); }} style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button onClick={() => { if (window.confirm('Delete this card?')) deleteWhyUsItem(item.id); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== ABOUT SECTION ===== */}
      {activeTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Story Form */}
          <div style={{ background: '#0F233D', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
            <form onSubmit={(e) => { e.preventDefault(); updateAbout(aboutForm); }} className="dark-form">
              <h3 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Company Story, Mission & Vision</h3>

              <div className="form-group">
                <label>About Page Hero Title</label>
                <input type="text" className="form-control" value={aboutForm.heroTitle || ''} onChange={e => setAboutForm({ ...aboutForm, heroTitle: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Hero Subtitle</label>
                <input type="text" className="form-control" value={aboutForm.heroSubtitle || ''} onChange={e => setAboutForm({ ...aboutForm, heroSubtitle: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Company Heritage Narrative</label>
                <textarea className="form-control" rows={4} value={aboutForm.story || ''} onChange={e => setAboutForm({ ...aboutForm, story: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Mission Statement</label>
                  <textarea className="form-control" rows={3} value={aboutForm.mission || ''} onChange={e => setAboutForm({ ...aboutForm, mission: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Vision Statement</label>
                  <textarea className="form-control" rows={3} value={aboutForm.vision || ''} onChange={e => setAboutForm({ ...aboutForm, vision: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                <Save size={16} /> Save About Changes
              </button>
            </form>
          </div>

          {/* Core Values CRUD */}
          <div style={{ background: '#0F233D', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Core Values</h3>
              <button onClick={() => setShowNewValue(!showNewValue)} className="btn btn-primary btn-sm"><Plus size={15} /> Add Value</button>
            </div>

            {showNewValue && (
              <div style={{ background: 'rgba(247,148,29,0.08)', border: '1px solid rgba(247,148,29,0.25)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }} className="dark-form">
                <div className="form-group">
                  <label>Value Title</label>
                  <input type="text" className="form-control" value={newValue.title} onChange={e => setNewValue({ ...newValue, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows={2} value={newValue.desc} onChange={e => setNewValue({ ...newValue, desc: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { addCoreValue(newValue); setNewValue({ title: '', desc: '' }); setShowNewValue(false); }}>Save</button>
                  <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none' }} onClick={() => setShowNewValue(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(about.values || []).map((v, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{v.title}</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.25rem' }}>{v.desc}</div>
                  </div>
                  <button onClick={() => { if (window.confirm('Delete this value?')) deleteCoreValue(idx); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', flexShrink: 0 }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== STANDARDS SECTION ===== */}
      {activeTab === 'standards' && (
        <div style={{ background: '#0F233D', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Quality Certifications & Standards</h3>
            <button onClick={() => setShowNewStd(!showNewStd)} className="btn btn-primary btn-sm"><Plus size={15} /> Add Standard</button>
          </div>

          {showNewStd && (
            <div style={{ background: 'rgba(247,148,29,0.08)', border: '1px solid rgba(247,148,29,0.25)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }} className="dark-form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Code (e.g. API SP)</label>
                  <input type="text" className="form-control" value={newStd.code} onChange={e => setNewStd({ ...newStd, code: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input type="text" className="form-control" value={newStd.name} onChange={e => setNewStd({ ...newStd, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Status</label>
                  <select className="form-control" value={newStd.status} onChange={e => setNewStd({ ...newStd, status: e.target.value })}>
                    <option>Certified</option>
                    <option>Compliant</option>
                    <option>Approved</option>
                    <option>Verified</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => { addStandard(newStd); setNewStd({ code: '', name: '', status: 'Certified' }); setShowNewStd(false); }}>Save</button>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none' }} onClick={() => setShowNewStd(false)}>Cancel</button>
              </div>
            </div>
          )}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Full Name</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {standards.map((std, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#F7941D', fontWeight: 700 }}>{std.code}</td>
                  <td>{std.name}</td>
                  <td><span className="admin-badge badge-new">{std.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => { if (window.confirm(`Remove ${std.code}?`)) deleteStandard(idx); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== CONTACT SECTION ===== */}
      {activeTab === 'contact' && (
        <div style={{ background: '#0F233D', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); updateContactInfo(contactForm); }} className="dark-form">
            <h3 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Corporate Contact Information</h3>

            <div className="form-group">
              <label>Full Address</label>
              <input type="text" className="form-control" value={contactForm.address || ''} onChange={e => setContactForm({ ...contactForm, address: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Phone Numbers</label>
                <input type="text" className="form-control" value={contactForm.phone || ''} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Primary Email</label>
                <input type="email" className="form-control" value={contactForm.email || ''} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Sales / Distribution Email</label>
                <input type="email" className="form-control" value={contactForm.salesEmail || ''} onChange={e => setContactForm({ ...contactForm, salesEmail: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Business Hours</label>
                <input type="text" className="form-control" value={contactForm.hours || ''} onChange={e => setContactForm({ ...contactForm, hours: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={16} /> Save Contact Info
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
