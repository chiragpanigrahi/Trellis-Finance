import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { getInsights, getInvestments } from '../../services/aiService';
import SpendingBreakdownChart from '../../components/charts/SpendingBreakdownChart';

function SeverityBadge({ s }) {
  return <span className={`badge badge-${s.toLowerCase()}`}>{s}</span>;
}

function TypeBadge({ type }) {
  return <span className={`badge badge-${type.toLowerCase()}`}>{type.replace('_',' ')}</span>;
}

function RiskDot({ level }) {
  const colors = { LOW:'var(--green)', MEDIUM:'var(--orange)', HIGH:'var(--red)' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, color:colors[level] || 'var(--text-3)' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:colors[level], display:'inline-block' }} />
      {level} Risk
    </span>
  );
}

export default function Insights() {
  const user = useAuthStore(s => s.user);
  const [insights,    setInsights]    = useState(null);
  const [investments, setInvestments] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [activeTab,   setActiveTab]   = useState('anomalies');

  const load = async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const [ins, inv] = await Promise.all([
        getInsights(user.organizationId),
        getInvestments(user.organizationId),
      ]);
      setInsights(ins.data);
      setInvestments(inv.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user?.organizationId]);

  const anomalies = insights?.anomalies || [];
  const recs      = investments?.investments || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>AI Insights</h1>
          <p>Spending anomaly detection and yield optimization recommendations</p>
        </div>
        <button className="btn btn-primary" onClick={load} disabled={loading}>
          {loading ? <><span className="spinner" />Analyzing...</> : 'Refresh Analysis'}
        </button>
      </div>

      {/* Summary Banner */}
      {insights && (
        <div className="card mb-6" style={{ borderColor:'rgba(10,132,255,.2)', background:'rgba(10,132,255,.05)' }}>
          <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:700, marginBottom:6 }}>
                AI Analysis Complete
              </div>
              <div style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.6 }}>
                {insights.summary}
              </div>
            </div>
            <div style={{ display:'flex', gap:20, flexShrink:0 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:32, fontWeight:900, color:'var(--red)' }}>{anomalies.filter(a=>a.severity==='HIGH').length}</div>
                <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase' }}>High</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:32, fontWeight:900, color:'var(--orange)' }}>{anomalies.filter(a=>a.severity==='MEDIUM').length}</div>
                <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase' }}>Medium</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:32, fontWeight:900, color:'var(--teal)' }}>{recs.length}</div>
                <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase' }}>Opportunities</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {[['anomalies','Spending Anomalies'],['investments','Investment Opportunities'],['breakdown','Breakdown Chart']].map(([tab,label]) => (
          <button
            key={tab}
            className={`btn ${activeTab===tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab(tab)}
          >{label}</button>
        ))}
      </div>

      {/* Anomalies */}
      {activeTab === 'anomalies' && (
        <div className="anomaly-grid">
          {anomalies.length === 0 && <div className="empty"><div className="empty-icon">✓</div><div className="empty-text">No anomalies detected</div></div>}
          {anomalies.map((a, i) => (
            <div key={i} className={`anomaly-card s-${a.severity.toLowerCase()}`}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:6 }}>
                <div className="anomaly-title">{a.category}</div>
                <SeverityBadge s={a.severity} />
              </div>
              <div className="anomaly-entity">{a.entityName}</div>
              <div className={`anomaly-pct s-${a.severity.toLowerCase()}`}>+{a.percentageIncrease.toFixed(1)}%</div>
              <div className="anomaly-desc">{a.description}</div>
              <div className="anomaly-rec">{a.recommendation}</div>
            </div>
          ))}
        </div>
      )}

      {/* Investments */}
      {activeTab === 'investments' && (
        <div className="invest-grid">
          {recs.length === 0 && <div className="empty"><div className="empty-icon">◎</div><div className="empty-text">No recommendations yet</div></div>}
          {recs.map((r, i) => (
            <div key={i} className="invest-card">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <TypeBadge type={r.type} />
                <RiskDot level={r.riskLevel} />
              </div>
              <div className="invest-title">{r.title}</div>
              <div>
                <div className="invest-yield">{r.yieldPercentage.toFixed(1)}%</div>
                <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>Annual Yield (APY)</div>
              </div>
              <div style={{ fontSize:12, color:'var(--text-3)' }}>
                {r.currency} {parseFloat(r.amount.replace(/,/g,'')).toLocaleString()} eligible
              </div>
              <div className="invest-desc">{r.description}</div>
              <button className="btn btn-teal btn-sm" style={{ alignSelf:'flex-start', marginTop:'auto' }}>
                {r.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Breakdown Chart */}
      {activeTab === 'breakdown' && (
        <div className="chart-1-1">
          <div className="card">
            <div className="card-title" style={{ marginBottom:16 }}>Spending Breakdown</div>
            <SpendingBreakdownChart data={[]} />
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom:16 }}>Potential Savings Summary</div>
            {[
              { label:'Cloud Optimization',   saving:'EUR 8,400/mo + USD 12,800/mo', color:'var(--blue)' },
              { label:'SaaS Consolidation',   saving:'GBP 3,200/mo',                 color:'var(--teal)' },
              { label:'Bond Yield Capture',   saving:'4.5% on idle capital',          color:'var(--green)' },
              { label:'Money Market Yield',   saving:'5.1% APY on $800K',            color:'var(--purple)' },
              { label:'Forex Optimization',   saving:'2.8% gain on $1.5M FX',        color:'var(--orange)' },
            ].map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:i<4?'1px solid var(--border)':'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0 }} />
                  <span style={{ fontSize:13.5, fontWeight:600 }}>{s.label}</span>
                </div>
                <span style={{ fontSize:13.5, fontWeight:700, color:s.color }}>{s.saving}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
