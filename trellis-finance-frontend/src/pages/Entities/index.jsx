import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { useLedger } from '../../hooks/useLedger';
import { formatCurrency } from '../../utils/currencyFormatter';

function EntityCard({ entity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="entity-card">
      <div className="entity-header" onClick={() => setExpanded(e => !e)}>
        <div>
          <div className="entity-name">{entity.orgName}</div>
          <div className="entity-sub">{entity.accounts?.length || 0} accounts</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:2 }}>Local Balance</div>
            <div style={{ fontSize:16, fontWeight:800, color:'var(--text)', fontVariantNumeric:'tabular-nums' }}>
              {formatCurrency(entity.localBalance, entity.localCurrency)}
            </div>
          </div>
          <div className="currency-pill">{entity.localCurrency}</div>
          <svg
            style={{ width:14, height:14, color:'var(--text-3)', transition:'transform .2s', transform: expanded ? 'rotate(180deg)' : 'none' }}
            viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M5 7l5 5 5-5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="entity-accounts">
          {(entity.accounts || []).map(account => (
            <div key={account.id} className="account-row">
              <div>
                <div className="acct-name">{account.name}</div>
                <div className="acct-type">{account.accountType}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="acct-balance" style={{ color: account.currentBalance > 0 ? 'var(--teal)' : 'var(--text-2)' }}>
                  {formatCurrency(account.currentBalance, account.currency)}
                </div>
                <div style={{ fontSize:10, color:'var(--text-3)' }}>{account.currency}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Entities() {
  const { consolidated, loading } = useLedger();

  const entities   = consolidated?.entities ?? [];
  const total      = consolidated?.totalConsolidatedBalance ?? 0;
  const base       = consolidated?.baseCurrency ?? 'USD';
  const [parent]   = entities;
  const subsidiaries = entities.slice(1);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Entities</h1>
          <p>Organization structure, subsidiaries, and account mapping</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.06em' }}>Consolidated ({base})</div>
          <div style={{ fontSize:24, fontWeight:900, color:'var(--teal)', fontVariantNumeric:'tabular-nums' }}>
            {formatCurrency(total, base, true)}
          </div>
        </div>
      </div>

      {loading && !consolidated && (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <div className="spinner" style={{ width:32, height:32 }} />
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total Entities',   value:entities.length || 3,           color:'var(--blue)' },
          { label:'Total Accounts',   value:entities.reduce((s,e) => s+(e.accounts?.length||0), 0) || 7, color:'var(--teal)' },
          { label:'Idle Capital',     value:formatCurrency(consolidated?.totalIdleCash||0, base, true), color:'var(--green)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign:'center' }}>
            <div style={{ fontSize:32, fontWeight:900, color:s.color, fontVariantNumeric:'tabular-nums', marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Parent entity */}
      {entities.length > 0 ? (
        <div>
          {/* Parent */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:24, height:24, borderRadius:6, background:'linear-gradient(135deg,var(--blue),var(--teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff' }}>P</div>
            <span style={{ fontSize:12, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.07em', fontWeight:700 }}>Parent Organization</span>
          </div>
          {parent && <EntityCard key={parent.orgId} entity={parent} />}

          {subsidiaries.length > 0 && (
            <div style={{ marginTop:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, paddingLeft:20, borderLeft:'2px solid var(--border-blue)' }}>
                <span style={{ fontSize:12, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.07em', fontWeight:700 }}>Subsidiaries ({subsidiaries.length})</span>
              </div>
              <div style={{ paddingLeft:20, borderLeft:'2px solid rgba(10,132,255,.15)', display:'flex', flexDirection:'column', gap:0 }}>
                {subsidiaries.map(e => <EntityCard key={e.orgId} entity={e} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="empty">
            <div className="empty-icon">⬡</div>
            <div className="empty-text">No entities loaded. Ensure the backend is running with seed data.</div>
          </div>
        )
      )}

      {/* FX Rates Banner */}
      <div className="card" style={{ marginTop:20 }}>
        <div className="card-title" style={{ marginBottom:14 }}>Live Exchange Rates to {base}</div>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {entities.filter(e => e.localCurrency !== base).map((e, i) => (
            <div key={i} style={{
              padding:'10px 16px', borderRadius:8,
              background:'rgba(0,201,167,.07)', border:'1px solid rgba(0,201,167,.15)',
              display:'flex', flexDirection:'column', gap:3,
            }}>
              <div style={{ fontSize:11, color:'var(--text-3)', letterSpacing:'.06em', textTransform:'uppercase' }}>
                {e.localCurrency} → {base}
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:'var(--teal)', fontVariantNumeric:'tabular-nums' }}>
                {e.exchangeRate.toFixed(4)}
              </div>
            </div>
          ))}
          {entities.filter(e => e.localCurrency !== base).length === 0 && (
            <div style={{ fontSize:13, color:'var(--text-3)' }}>All entities share the same base currency.</div>
          )}
        </div>
      </div>
    </div>
  );
}
