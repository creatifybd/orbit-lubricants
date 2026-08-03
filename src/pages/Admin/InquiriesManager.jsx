import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Mail, CheckCircle2, Trash2, Phone, Calendar, Download } from 'lucide-react';

export const InquiriesManager = () => {
  const { data, updateInquiryStatus, deleteInquiry } = useCms();
  const { inquiries } = data;

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInquiries = inquiries.filter(inq => {
    if (filterStatus === 'all') return true;
    return inq.status === filterStatus;
  });

  const exportInquiriesCSV = () => {
    if (inquiries.length === 0) return;

    const headers = ['Date', 'Name', 'Email', 'Phone', 'Type', 'Status', 'Message'];
    const rows = inquiries.map(i => [
      `"${i.date}"`,
      `"${i.name}"`,
      `"${i.email}"`,
      `"${i.phone || ''}"`,
      `"${i.type}"`,
      `"${i.status}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orbit-inquiries-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontFamily: 'var(--font-display)' }}>
            Inquiry & Lead Manager ({inquiries.length})
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Customer & dealership inquiries received directly through the website form.
          </p>
        </div>

        <button onClick={exportInquiriesCSV} className="btn btn-outline" style={{ color: '#FFF', gap: '6px' }}>
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'New', 'Contacted', 'Closed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-outline'}`}
            style={{ color: filterStatus !== status ? '#FFF' : undefined, textTransform: 'capitalize' }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: '#0F233D',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}>
        {filteredInquiries.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client Name</th>
                <th>Contact Info</th>
                <th>Inquiry Type</th>
                <th>Message Snippet</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map(inq => (
                <tr key={inq.id}>
                  <td style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>{inq.date}</td>
                  <td style={{ fontWeight: 600, color: '#FFFFFF' }}>{inq.name}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div>{inq.email}</div>
                    <div style={{ color: '#F7941D' }}>{inq.phone}</div>
                  </td>
                  <td>{inq.type}</td>
                  <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.message}
                  </td>
                  <td>
                    <select
                      value={inq.status}
                      onChange={e => updateInquiryStatus(inq.id, e.target.value)}
                      style={{
                        background: '#0A192F',
                        color: inq.status === 'New' ? '#60A5FA' : '#34D399',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete inquiry from ${inq.name}?`)) {
                          deleteInquiry(inq.id);
                        }
                      }}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      title="Delete Inquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
            No inquiries match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
