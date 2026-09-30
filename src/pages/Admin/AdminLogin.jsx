import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Lock, ShieldCheck, Key, ArrowRight } from 'lucide-react';

export const AdminLogin = ({ onReturnHome }) => {
  const { loginAdmin, setupAdminPasscode, hasAdminPasscode } = useCms();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasAdminPasscode) {
      if (password !== confirmPassword) return;
      await setupAdminPasscode(password);
      return;
    }
    await loginAdmin(password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 30%, #0F233D 0%, #06111E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      color: '#FFFFFF'
    }}>
      <div className="glass-card-dark" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #005AAB 0%, #F7941D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 10px 25px rgba(247, 148, 29, 0.4)'
          }}>
            <Lock size={30} color="#FFFFFF" />
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: '1.6rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>
            {hasAdminPasscode ? 'Admin CMS Login' : 'Create Owner Access'}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            {hasAdminPasscode ? 'Orbit Lubricants Management System' : 'Set a private passcode for this browser'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="dark-form">
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} />
              <span>{hasAdminPasscode ? 'Enter Admin Passcode' : 'Create Admin Passcode'}</span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder={hasAdminPasscode ? 'Administrator passcode' : 'At least 10 characters'}
              minLength={hasAdminPasscode ? undefined : 10}
              required
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {!hasAdminPasscode && (
            <div className="form-group">
              <label>Confirm Admin Passcode</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repeat the new passcode"
                minLength={10}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && (
                <small style={{ color: '#FCA5A5' }}>Passcodes do not match.</small>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
            <span>{hasAdminPasscode ? 'Authenticate to Dashboard' : 'Create Passcode & Continue'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={onReturnHome}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
