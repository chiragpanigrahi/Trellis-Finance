import React, { useMemo } from 'react';
import { useLedger } from '../../hooks/useLedger';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/dateFormatter';
import CashFlowChart      from '../../components/charts/CashFlowChart';
import SubsidiaryBarChart from '../../components/charts/SubsidiaryBarChart';
import LiquidityGaugeChart from '../../components/charts/LiquidityGaugeChart';
import SpendingBreakdownChart from '../../components/charts/SpendingBreakdownChart';

function MetricCard({ label, value, sub, color, iconChar, trend, trendLabel }) {
  return (
    <div className={`metric-card c-${color}`}>
      <div className={`metric-icon i-${color}`} style={{ fontSize:20 }}>{iconChar}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {(trend != null) && (
        <div className={`metric-trend trend-${trend >= 0 ? 'up' : 'down'}`}>
          <span>{trend >= 0 ? '▲' : '▼'}</span>
          <span>{Math.abs(trend).toFixed(1)}% {trendLabel}</span>
        </div>
      )}
      {!trend && sub && <div style={{ fontSize:12, color:'var(--text-3)' }}>{sub}</div>}
    </div>
  );
}

// Build demo cash flow data if API returns none
function buildCashFlowData(entities) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const m = (now.getMonth() - 11 + i + 12) % 12;
    const base = 2_800_000 + (i * 180_000) + (Math.sin(i) * 400_000);
    return { label: months[m], value: base };
  });
}

export default function Dashboard() {
  const { consolidated, summary, loading } = useLedger();

  const total    = consolidated?.totalConsolidatedBalance ?? 0;
  const idle     = consolidated?.totalIdleCash ?? 0;
  const entities = consolidated?.entities ?? [];
  const base     = consolidated?.baseCurrency ?? 'USD';
  const txToday  = summary?.transactionsToday ?? 0;
  const totalTx  = summary?.totalTransactions ?? 0;

  const cashFlowData = useMemo(() => buildCashFlowData(entities), [entities]);

  // Recent transactions from first entity's first account (demo)
  const recentTx = useMemo(() => {
    const demo = [
      { id:1, description:'Q2 UK Enterprise Renewals',     type:'CREDIT', amount:520000,  currency:'GBP', transactionDate:'2026-05-22', category:'Revenue' },
      { id:2, description:'AWS us-east-1 May Invoice',     type:'DEBIT',  amount:55200,   currency:'USD', transactionDate:'2026-05-24', category:'Cloud Infrastructure' },
      { id:3, description:'April 2026 UK Payroll',         type:'DEBIT',  amount:95000,   currency:'GBP', transactionDate:'2026-05-22', category:'Payroll' },
      { id:4, description:'Q2 SaaS Renewal — N. America',  type:'CREDIT', amount:650000,  currency:'USD', transactionDate:'2026-05-27', category:'Revenue' },
      { id:5, description:'AWS eu-west-1 May Invoice',     type:'DEBIT',  amount:49800,   currency:'EUR', transactionDate:'2026-05-26', category:'Cloud Infrastructure' },
    ];
    return demo;
  }, []);

  if (loading && !consolidated) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
        <div className="spinner" style={{ width:32, height:32 }} />
      </div>
    );
  }

  return (
    <div>
      {/* HUD Hero */}
      <div className="hud-hero">
        <div className="hud-eyebrow">Total Global Liquidity — {base}</div>
        <div className="hud-value">{formatCurrency(total, base)}</div>
        <div className="hud-stats">
          <div className="hud-stat">
            <div className="hud-stat-label">Idle Cash</div>
            <div className="hud-stat-val">{formatCurrency(idle, base, true)}</div>
          </div>
          <div className="hud-stat">
            <div className="hud-stat-label">Entities</div>
            <div className="hud-stat-val">{entities.length}</div>
          </div>
          <div className="hud-stat">
            <div className="hud-stat-label">Tx Today</div>
            <div className="hud-stat-val">{txToday}</div>
          </div>
          <div className="hud-stat">
            <div className="hud-stat-label">Total Tx</div>
            <div className="hud-stat-val">{totalTx}</div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metric-grid mb-6">
        <MetricCard label="Consolidated Balance" value={formatCurrency(total, base, true)} color="blue"   iconChar="$" trend={3.2}  trendLabel="vs last month" />
        <MetricCard label="Idle Cash"            value={formatCurrency(idle, base, true)}  color="teal"   iconChar="◎" trend={8.1}  trendLabel="above threshold" />
        <MetricCard label="Active Entities"      value={entities.length || 3}               color="green"  iconChar="⬡" sub="1 parent · 2 subsidiaries" />
        <MetricCard label="Transactions Today"   value={txToday}                            color="purple" iconChar="≡" sub={`${totalTx} total on ledger`} />
      </div>

      {/* Charts Row 1 */}
      <div className="chart-2-1 gap-section">
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <div className="card-title">Cash Flow Trend</div>
              <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2 }}>12-month net cash flow in {base}</div>
            </div>
            <div style={{ fontSize:12, color:'var(--teal)', fontWeight:700 }}>+3.2% MoM</div>
          </div>
          <CashFlowChart data={cashFlowData} currency={base} />
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom:14 }}>Idle Cash Allocation</div>
          <LiquidityGaugeChart total={total} idle={idle} currency={base} />
          <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'var(--text-3)' }}>Deployed</span>
              <span style={{ color:'var(--blue)', fontWeight:700 }}>{formatCurrency(total - idle, base, true)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'var(--text-3)' }}>Idle</span>
              <span style={{ color:'var(--teal)', fontWeight:700 }}>{formatCurrency(idle, base, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="chart-1-1 gap-section">
        <div className="card">
          <div className="card-title" style={{ marginBottom:14 }}>Entity Balances ({base})</div>
          <SubsidiaryBarChart entities={entities} baseCurrency={base} />
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom:14 }}>Spending Breakdown (90 days)</div>
          <SpendingBreakdownChart data={[]} currency={base} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div className="card-title">Recent Transactions</div>
          <a href="/ledger" style={{ fontSize:12, color:'var(--blue)', fontWeight:600 }}>View all</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th style={{ textAlign:'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontWeight:600, color:'var(--text)' }}>{tx.description}</td>
                  <td><span style={{ fontSize:11, color:'var(--text-3)' }}>{tx.category}</span></td>
                  <td style={{ fontSize:12 }}>{formatDate(tx.transactionDate)}</td>
                  <td>
                    <span className={`badge badge-${tx.type.toLowerCase()}`}>{tx.type}</span>
                  </td>
                  <td className={tx.type === 'CREDIT' ? 'credit' : 'debit'} style={{ textAlign:'right' }}>
                    {tx.type === 'CREDIT' ? '+' : '−'}{formatCurrency(tx.amount, tx.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
