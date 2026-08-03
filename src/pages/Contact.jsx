import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

export const Contact = ({ selectedProductForInquiry }) => {
  const { data, addInquiry } = useCms();
  const { contactInfo } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: selectedProductForInquiry ? `Inquiry for ${selectedProductForInquiry}` : 'Becoming a Distributor',
    message: selectedProductForInquiry ? `I would like to receive a price quotation and delivery terms for ${selectedProductForInquiry}.` : ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    addInquiry(formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'Becoming a Distributor',
      message: ''
    });
  };

  return (
    <div>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #051526 100%)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '760px' }}>
          <span className="eyebrow on-dark">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
            GET IN TOUCH WITH OUR TEAM
          </span>
          <h1 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Let's Talk Lubrication
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Distributor, workshop operator, industrial buyer, or fleet manager — reach out and our technical team will respond promptly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem'
          }}>
            {/* Contact Details Column */}
            <div>
              <span className="eyebrow">HEADQUARTERS & SALES</span>
              <h2 style={{ marginBottom: '1.5rem' }}>Corporate Office</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem' }}>
                  <MapPin size={24} style={{ color: 'var(--orange)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.2rem', fontFamily: 'var(--font-display)' }}>
                      Address
                    </h4>
                    <p style={{ color: 'var(--steel)', fontSize: '0.92rem' }}>
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem' }}>
                  <Phone size={24} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.2rem', fontFamily: 'var(--font-display)' }}>
                      Phone / Helpline
                    </h4>
                    <p style={{ color: 'var(--steel)', fontSize: '0.92rem' }}>
                      {contactInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem' }}>
                  <Mail size={24} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.2rem', fontFamily: 'var(--font-display)' }}>
                      Email Inquiries
                    </h4>
                    <p style={{ color: 'var(--steel)', fontSize: '0.92rem' }}>
                      {contactInfo.email} / {contactInfo.salesEmail}
                    </p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem' }}>
                  <Clock size={24} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.2rem', fontFamily: 'var(--font-display)' }}>
                      Business Hours
                    </h4>
                    <p style={{ color: 'var(--steel)', fontSize: '0.92rem' }}>
                      {contactInfo.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div>
              <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem'
                    }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                      Inquiry Received!
                    </h3>
                    <p style={{ color: 'var(--steel)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                      Thank you for contacting Orbit Lubricant Industries. Your message has been routed to our sales and technical engineering team.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn btn-outline">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--navy)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
                      Send Us a Message
                    </h3>

                    <div className="form-group">
                      <label>Your Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. Engr. Rafiqul Islam"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="+880 1711-000000"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Inquiry Type</label>
                      <select
                        className="form-control"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option>Becoming a Distributor</option>
                        <option>Industrial Lubricants Quotation</option>
                        <option>Automotive / Fleet Supply</option>
                        <option>Technical Support & Oil Survey</option>
                        <option>Other Inquiry</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Message / Details *</label>
                      <textarea
                        className="form-control"
                        rows={5}
                        required
                        placeholder="Describe your lubricant requirements, machinery specs, or dealership location..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      <span>Send Inquiry</span>
                      <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
