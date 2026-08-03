import React from 'react';
import { useCms } from '../context/CmsContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useCms();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'error': return 'bg-red-950/90 border-red-800 text-red-100';
      case 'warning': return 'bg-amber-950/90 border-amber-800 text-amber-100';
      case 'info': return 'bg-blue-950/90 border-blue-800 text-blue-100';
      default: return 'bg-slate-900/95 border-emerald-500/50 text-slate-100';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      borderRadius: '12px',
      background: type === 'error' ? '#7F1D1D' : type === 'warning' ? '#78350F' : '#0F233D',
      color: '#FFFFFF',
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.15)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {getIcon()}
      <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
};
