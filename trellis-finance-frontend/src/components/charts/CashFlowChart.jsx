import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, defs, linearGradient, stop
} from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'#0A1A2E', border:'1px solid rgba(255,255,255,.08)',
      borderRadius:8, padding:'10px 14px',
    }}>
      <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:14, fontWeight:700, color: p.value >= 0 ? 'var(--teal)' : 'var(--red)' }}>
          {formatCurrency(p.value, currency)}
        </div>
      ))}
    </div>
  );
};

export default function CashFlowChart({ data = [], currency = 'USD' }) {
  const positive = (data || []).map(d => ({ ...d, value: parseFloat(d.value || 0) }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={positive} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cfGradientPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#00C9A7" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#00C9A7" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="cfGradientNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#FF453A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#FF453A" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
        <XAxis
          dataKey="label"
          tick={{ fill:'#4A6278', fontSize:11 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill:'#4A6278', fontSize:11 }}
          axisLine={false} tickLine={false}
          tickFormatter={v => formatCurrency(v, currency, true)}
          width={70}
        />
        <Tooltip content={<CustomTooltip currency={currency} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#00C9A7"
          strokeWidth={2.5}
          fill="url(#cfGradientPos)"
          dot={false}
          activeDot={{ r: 5, fill:'#00C9A7', stroke:'#050B18', strokeWidth:2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
