import React from 'react';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useLedger } from '../../hooks/useLedger';

export default function Navbar({ title, subtitle }) {
  const user = useAuthStore(s => s.user);
  const { consolidated, refresh } = useLedger();

  const total = consolidated?.totalConsolidatedBalance;
  const base  = consolidated?.baseCurrency || 'USD';

  return (
    <header className="navbar">
      <div style={{ flex: 1 }}>
        <div className="navbar-title">
          {title}
          {subtitle && <span className="navbar-sub">{subtitle}</span>}
        </div>
      </div>

      {total != null && (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, color:'var(--text-3)', letterSpacing:'.06em', textTransform:'uppercase' }}>
            Consolidated
          </span>
          <span style={{ fontSize:15, fontWeight:800, color:'var(--teal)', fontVariantNumeric:'tabular-nums' }}>
            {formatCurrency(total, base, true)}
          </span>
        </div>
      )}

      <div className="live-badge">
        <div className="live-dot" />
        <span className="live-text">Live</span>
      </div>

      <div className="navbar-actions" style={{ display:'flex', gap:8 }}>
        <button className="icon-btn" onClick={refresh} title="Refresh data">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 10A7 7 0 1 1 10 3M17 3v4h-4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{
          width:32, height:32, borderRadius:'50%',
          background:'linear-gradient(135deg,var(--blue),var(--teal))',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:12, fontWeight:800, color:'#fff',
        }}>
          {(user?.fullName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
      </div>
    </header>
  );
}
