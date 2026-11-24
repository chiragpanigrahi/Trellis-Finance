import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';

const COLORS = ['#0A84FF', '#00C9A7', '#34D399'];

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#0A1A2E', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, padding:'10px 14px' }}>
      <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:800, color:'var(--blue)' }}>
        {formatCurrency(payload[0].value, currency)}
      </div>
      <div style={{ fontSize:10, color:'var(--text-3)', marginTop:3 }}>Converted to {currency}</div>
    </div>
  );
};

export default function SubsidiaryBarChart({ entities = [], baseCurrency = 'USD' }) {
  const data = (entities || []).map((e, i) => ({
    name: e.orgName?.replace('Trellis ', '') || `Entity ${i+1}`,
    value: parseFloat(e.convertedBalance || 0),
    color: COLORS[i % COLORS.length],
  }));

  if (!data.length) {
    [
      { name:'Global HQ',  value:13000000, color:COLORS[0] },
      { name:'Europe',     value:2350000,  color:COLORS[1] },
      { name:'UK',         value:1305000,  color:COLORS[2] },
    ].forEach(d => data.push(d));
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top:8, right:16, left:0, bottom:0 }} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill:'#4A6278', fontSize:11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill:'#4A6278', fontSize:11 }} axisLine={false} tickLine={false}
          tickFormatter={v => formatCurrency(v, baseCurrency, true)} width={68}
        />
        <Tooltip content={<CustomTooltip currency={baseCurrency} />} cursor={{ fill:'rgba(255,255,255,.04)' }} />
        <Bar dataKey="value" radius={[5,5,0,0]} animationDuration={800}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
